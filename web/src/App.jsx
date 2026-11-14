import React, { useState, useCallback, useRef, useEffect } from 'react'
import {
  Welcome, Role, Signup, Login, HomeScreen, Scan, Result, Medicines, Inventory,
  NewBatch, Foil, Org, Preferences, Alerts, Profile
} from './screens.jsx'
import { RefreshCw, Home, Terminal, Activity, Eye, Wifi, X } from 'lucide-react'

const INITIAL_INV = [
  { name: 'Metformin 500', batch: 'MF-0012', qty: '10,000 tablets', s: 'green' },
  { name: 'Paracetamol 650', batch: 'B204-P-12', qty: '40,000 tablets', s: 'green' },
  { name: 'Amoxycillin 250', batch: 'B191-A', qty: '8,000 tablets', s: 'orange' },
  { name: 'Ubent-D 100/500', batch: 'UB-4491', qty: '2,200 capsules', s: 'indigo' },
  { name: 'Pantocid 40', batch: 'B170-K', qty: '1,500 tablets', s: 'red' },
]

export default function App() {
  const [stack, setStack] = useState(['welcome'])
  const [role, setRole] = useState('customer')
  const [inv, setInv] = useState(INITIAL_INV)
  const [toastMsg, setToastMsg] = useState('')
  const [devOpen, setDevOpen] = useState(false)
  const [perfMon, setPerfMon] = useState(false)
  const [fakeNet, setFakeNet] = useState(false)
  const timer = useRef()

  const native = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) && window.innerWidth <= 480
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const handleResize = () => setScale(Math.min(1, (window.innerWidth - 24) / 406, (window.innerHeight - 24) / 880))
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [form, setForm] = useState({
    name: 'Paracetamol 650',
    strength: '650 mg',
    mfr: 'Cipla Ltd.',
    batch: 'B204-P-12',
    mfg: '2024-10-15',
    exp: '2027-12-10',
    qty: '10,000',
    unit: 'Tablets',
  })

  const toast = useCallback(m => {
    setToastMsg(m)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToastMsg(''), 2200)
  }, [])

  const go = useCallback((name, replaceAll, replaceTop, reset) => {
    if (name === 'records') name = 'alerts'
    setStack(s => {
      if (reset) return [name]
      if (replaceAll) return [name]
      if (replaceTop) return [...s.slice(0, -1), name]
      return [...s, name]
    })
  }, [])

  const back = useCallback(() => setStack(s => (s.length > 1 ? s.slice(0, -1) : s)), [])
  const finish = () => setStack([role === 'pharmacy' ? 'org' : 'home'])

  // Add entry to inventory and send to backend API
  const addEntry = async () => {
    const batch = form.batch.trim() || 'NEW-001'
    const newEntry = {
      name: form.name || 'New medicine',
      batch,
      qty: `${form.qty || '1,000'} ${(form.unit || 'tablets').toLowerCase()}`,
      s: 'green'
    }
    setInv(i => [newEntry, ...i.filter(x => x.batch !== batch)])

    // Try posting to backend if reachable
    try {
      await fetch('/api/v1/batches/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicine_name: form.name,
          strength: form.strength,
          manufacturer: form.mfr,
          manufacturer_batch_number: form.batch,
          manufacturing_date: form.mfg,
          expiry_date: form.exp,
          available_quantity: parseInt(form.qty) || 1000,
          unit: form.unit
        })
      })
    } catch {
      // Graceful offline fallback
    }
  }

  const user = role === 'pharmacy' ? 'Cipla Ltd.' : 'Priya Sharma'
  const cur = stack[stack.length - 1]
  const p = { go, back, role, user, toast, onOpenDev: () => setDevOpen(true) }

  const screens = {
    welcome: <Welcome {...p} />,
    role: <Role {...p} setRole={setRole} />,
    signup: <Signup {...p} finish={finish} />,
    login: <Login {...p} finish={finish} />,
    home: <HomeScreen {...p} />,
    scan: <Scan {...p} />,
    result: <Result {...p} />,
    medicines: <Medicines {...p} />,
    inventory: <Inventory {...p} items={inv} />,
    batch: <NewBatch {...p} form={form} setForm={setForm} addEntry={addEntry} />,
    foil: <Foil {...p} form={form} toast={toast} />,
    org: <Org {...p} />,
    prefs: <Preferences {...p} />,
    alerts: <Alerts {...p} />,
    profile: <Profile {...p} />,
  }

  return (
    <div className={'phone' + (native ? ' native' : '')} style={native ? undefined : { '--s': scale }}>
      <div key={cur} style={{ position: 'absolute', inset: 0 }}>
        {screens[cur] || screens.welcome}
      </div>

      {/* Performance monitor overlay */}
      {perfMon && (
        <div style={{ position: 'absolute', top: 50, left: 16, background: 'rgba(0,0,0,0.85)', color: '#00FF66', fontSize: 10, padding: '4px 8px', borderRadius: 8, zIndex: 99, fontFamily: 'monospace' }}>
          FPS: 60 | Memory: 24MB | Ping: {fakeNet ? '240ms' : '14ms'}
        </div>
      )}

      {/* Dev Panel Modal Drawer (matching Image 3 Screen 7) */}
      {devOpen && (
        <div className="drawer-backdrop" onClick={() => setDevOpen(false)}>
          <div className="drawer-content" onClick={e => e.stopPropagation()}>
            <div className="row between" style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 800, fontSize: 17 }}>Dev panel</div>
              <button onClick={() => setDevOpen(false)} aria-label="Close Dev panel">
                <X size={20} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                className="btn light sm"
                onClick={() => {
                  setDevOpen(false)
                  setStack(['welcome'])
                  toast('App state reloaded')
                }}
              >
                <RefreshCw size={16} /> Reload application
              </button>
              <button
                className="btn light sm"
                onClick={() => {
                  setDevOpen(false)
                  go('home', true)
                }}
              >
                <Home size={16} /> Go customer home
              </button>
              <button
                className="btn light sm"
                onClick={() => {
                  setDevOpen(false)
                  go('org', true)
                }}
              >
                <Terminal size={16} /> Go manufacturer overview
              </button>
              <button
                className="btn light sm"
                onClick={() => {
                  setPerfMon(!perfMon)
                  toast(perfMon ? 'Performance monitor off' : 'Performance monitor on')
                }}
              >
                <Activity size={16} /> Toggle performance monitor ({perfMon ? 'ON' : 'OFF'})
              </button>
              <div className="glass tile" style={{ padding: '12px 14px' }}>
                <Wifi size={20} color="var(--orange)" />
                <span style={{ flex: 1, fontWeight: 700, fontSize: 13 }}>Simulate slow network</span>
                <input
                  type="checkbox"
                  checked={fakeNet}
                  onChange={e => {
                    setFakeNet(e.target.checked)
                    toast(e.target.checked ? 'Slow 3G network simulation enabled' : 'Normal network restored')
                  }}
                  style={{ width: 18, height: 18, accentColor: 'var(--orange)' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification message */}
      {toastMsg && <div className="toast">{toastMsg}</div>}
    </div>
  )
}

