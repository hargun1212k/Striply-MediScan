import React, { useState, useCallback, useRef, useEffect } from 'react'
import {
  Welcome, Role, Signup, Login, HomeScreen, Scan, Result, Medicines, Inventory,
  NewBatch, Foil, Org, Preferences, Alerts, Profile, BusinessVerify, VerifyStatus,
  EditProfile, HelpSupport, TermsPrivacy, GoogleAccountModal, AppleAccountModal
} from './screens.jsx'
import { RefreshCw, Home, Terminal, Activity, Wifi, X } from 'lucide-react'

const INITIAL_INV = [
  { name: 'Metformin 500', batch: 'MF-0012', qty: '10,000 tablets', s: 'green' },
  { name: 'Paracetamol 650', batch: 'B204-P-12', qty: '40,000 tablets', s: 'green' },
  { name: 'Amoxycillin 250', batch: 'B191-A', qty: '8,000 tablets', s: 'orange' },
  { name: 'Ubent-D 100/500', batch: 'UB-4491', qty: '2,200 capsules', s: 'indigo' },
  { name: 'Pantocid 40', batch: 'B170-K', qty: '1,500 tablets', s: 'red' },
]

export default function App() {
  // Navigation stack: initial open is strictly 'welcome' (Requirement 2.A)
  const [stack, setStack] = useState(['welcome'])
  const [role, setRole] = useState('customer')
  const [userName, setUserName] = useState('Priya Sharma')
  const [userEmail, setUserEmail] = useState('priya.sharma@gmail.com')
  const [verificationStatus, setVerificationStatus] = useState('Pending')
  const [inv, setInv] = useState(INITIAL_INV)
  const [toastMsg, setToastMsg] = useState('')
  const [googleModal, setGoogleModal] = useState(false)
  const [appleModal, setAppleModal] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [devOpen, setDevOpen] = useState(false)
  const [perfMon, setPerfMon] = useState(false)
  const timer = useRef()

  // Load session from localStorage on startup
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('striply_user')
      if (savedUser) {
        const u = JSON.parse(savedUser)
        if (u.name) setUserName(u.name)
        if (u.email) setUserEmail(u.email)
        if (u.role) setRole(u.role)
        if (u.verificationStatus) setVerificationStatus(u.verificationStatus)
      }
    } catch {
      // ignore
    }
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
    timer.current = setTimeout(() => setToastMsg(''), 2400)
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

  // ============ Google OAuth Handler (Requirement 2.D & 4.A) ============
  const handleGoogleSelect = async (account) => {
    setGoogleModal(false)
    const activeRole = role
    const chosenName = account.name || (activeRole === 'pharmacy' ? 'Cipla Ltd.' : 'Priya Sharma')
    setUserName(chosenName)
    setUserEmail(account.email)

    try {
      const res = await fetch('/api/v1/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: account.email,
          name: chosenName,
          role: activeRole,
          avatar: account.avatar
        })
      })
      const data = await res.json()
      if (data.user?.verificationStatus) {
        setVerificationStatus(data.user.verificationStatus)
      }
      localStorage.setItem('striply_user', JSON.stringify({
        email: account.email,
        name: chosenName,
        role: activeRole,
        verificationStatus: data.user?.verificationStatus || (activeRole === 'pharmacy' ? 'Pending' : 'Verified')
      }))
    } catch {
      // offline fallback
      if (activeRole === 'pharmacy') setVerificationStatus('Pending')
    }

    toast(`Signed in with Google as ${chosenName}`)

    // Routing: Customer -> home; Manufacturer -> business-verify (NO BLANK SCREEN!)
    if (activeRole === 'pharmacy') {
      go('business-verify', true)
    } else {
      go('home', true)
    }
  }

  // ============ Apple OAuth Handler ============
  const handleAppleSelect = async (account) => {
    setAppleModal(false)
    const activeRole = role
    const chosenName = activeRole === 'pharmacy' ? 'Cipla Ltd.' : 'Apple User'
    setUserName(chosenName)
    setUserEmail(account.email)

    try {
      await fetch('/api/v1/auth/apple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: account.email, name: chosenName, role: activeRole })
      })
    } catch {
      // offline fallback
    }

    toast(`Signed in with Apple as ${chosenName}`)
    if (activeRole === 'pharmacy') {
      go('business-verify', true)
    } else {
      go('home', true)
    }
  }

  // ============ Email Sign Up Handler ============
  const handleEmailSignup = async ({ name, email, password }) => {
    const activeRole = role
    setUserName(name)
    setUserEmail(email)

    try {
      const res = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: activeRole })
      })
      const data = await res.json()
      if (!res.ok) {
        toast(data.error || 'Signup failed')
        return
      }
      localStorage.setItem('striply_user', JSON.stringify({
        email,
        name,
        role: activeRole,
        verificationStatus: activeRole === 'pharmacy' ? 'Pending' : 'Verified'
      }))
    } catch {
      // offline fallback
    }

    toast(`Account created for ${name}!`)
    if (activeRole === 'pharmacy') {
      go('business-verify', true)
    } else {
      go('home', true)
    }
  }

  // ============ Email Login Handler ============
  const handleEmailLogin = async ({ email, password }) => {
    const activeRole = role
    const derivedName = email.split('@')[0]
    setUserName(derivedName)
    setUserEmail(email)

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: activeRole })
      })
      const data = await res.json()
      if (!res.ok) {
        toast(data.error || 'Login failed')
        return
      }
      if (data.user?.verificationStatus) {
        setVerificationStatus(data.user.verificationStatus)
      }
      localStorage.setItem('striply_user', JSON.stringify({
        email,
        name: data.user?.name || derivedName,
        role: activeRole,
        verificationStatus: data.user?.verificationStatus || 'Verified'
      }))
    } catch {
      // offline fallback
    }

    toast(`Welcome back, ${derivedName}!`)
    if (activeRole === 'pharmacy') {
      go(verificationStatus === 'Verified' ? 'org' : 'verify-status', true)
    } else {
      go('home', true)
    }
  }

  // ============ Sign-Out Handler (Requirement 2.G) ============
  const handleSignOut = () => {
    setSigningOut(true)
    try {
      localStorage.removeItem('striply_user')
      fetch('/api/v1/auth/logout', { method: 'POST' }).catch(() => {})
    } catch {
      // ignore
    }

    setTimeout(() => {
      setSigningOut(false)
      toast('Signed out successfully')
      // Redirect to second screen "Who are you signing in as?", NOT Welcome (Requirement 2.G)
      setStack(['role'])
    }, 600)
  }

  // ============ Manufacturer Verification Submission ============
  const handleVerificationSubmitted = async (details) => {
    setVerificationStatus('Under Review')
    setUserName(details.businessName)
    try {
      await fetch('/api/v1/manufacturer/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      })
    } catch {
      // offline fallback
    }
  }

  // Add new batch entry to inventory and backend API
  const addEntry = async () => {
    const batch = form.batch.trim() || 'NEW-001'
    const newEntry = {
      name: form.name || 'New medicine',
      batch,
      qty: `${form.qty || '1,000'} ${(form.unit || 'tablets').toLowerCase()}`,
      s: 'green'
    }
    setInv(i => [newEntry, ...i.filter(x => x.batch !== batch)])

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
      // offline fallback
    }
  }

  const cur = stack[stack.length - 1]
  const userDisplayName = role === 'pharmacy' ? (userName === 'Priya Sharma' ? 'Cipla Ltd.' : userName) : userName

  const p = {
    go,
    back,
    role,
    user: userDisplayName,
    userEmail,
    verificationStatus,
    toast,
    onSignOut: handleSignOut,
    onGoogleOAuth: () => setGoogleModal(true),
    onAppleOAuth: () => setAppleModal(true),
    onEmailSignup: handleEmailSignup,
    onEmailLogin: handleEmailLogin,
    onOpenDev: () => setDevOpen(true)
  }

  const screens = {
    welcome: <Welcome {...p} />,
    role: <Role {...p} setRole={setRole} />,
    signup: <Signup {...p} />,
    login: <Login {...p} />,
    home: <HomeScreen {...p} />,
    scan: <Scan {...p} />,
    result: <Result {...p} />,
    medicines: <Medicines {...p} />,
    inventory: <Inventory {...p} items={inv} />,
    batch: <NewBatch {...p} form={form} setForm={setForm} addEntry={addEntry} />,
    foil: <Foil {...p} form={form} toast={toast} />,
    org: <Org {...p} />,
    'business-verify': <BusinessVerify {...p} onVerificationSubmitted={handleVerificationSubmitted} />,
    'verify-status': <VerifyStatus {...p} status={verificationStatus} onToggleDemoStatus={setVerificationStatus} />,
    'edit-profile': <EditProfile {...p} onSave={setUserName} />,
    prefs: <Preferences {...p} />,
    'help-support': <HelpSupport {...p} />,
    'terms-privacy': <TermsPrivacy {...p} />,
    profile: <Profile {...p} />,
    alerts: <Alerts {...p} />,
  }

  return (
    <div className="app-canvas">
      <div key={cur} style={{ position: 'absolute', inset: 0 }}>
        {screens[cur] || screens.welcome}
      </div>

      {/* Google Account Selector Dialog (Requirement 2.D) */}
      {googleModal && (
        <GoogleAccountModal
          role={role}
          onClose={() => setGoogleModal(false)}
          onSelectAccount={handleGoogleSelect}
        />
      )}

      {/* Apple Account Selector Dialog */}
      {appleModal && (
        <AppleAccountModal
          onClose={() => setAppleModal(false)}
          onSelectAccount={handleAppleSelect}
        />
      )}

      {/* Signing Out Animated Overlay (Requirement 2.G) */}
      {signingOut && (
        <div className="drawer-backdrop" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: '#fff' }}>
            <div className="spin" style={{ margin: '0 auto 14px' }} />
            <div style={{ fontSize: 16, fontWeight: 700 }}>Signing out securely…</div>
          </div>
        </div>
      )}

      {/* Performance monitor overlay */}
      {perfMon && (
        <div style={{ position: 'absolute', top: 50, left: 16, background: 'rgba(0,0,0,0.85)', color: '#00FF66', fontSize: 10, padding: '4px 8px', borderRadius: 8, zIndex: 99, fontFamily: 'monospace' }}>
          FPS: 60 | Memory: 24MB | Latency: 12ms
        </div>
      )}

      {/* Dev Panel Modal Drawer */}
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
                  setDevOpen(false)
                  go('verify-status')
                }}
              >
                <Terminal size={16} /> Manufacturer verification status
              </button>
              <button
                className="btn light sm"
                onClick={() => {
                  setPerfMon(!perfMon)
                  toast(perfMon ? 'Performance monitor off' : 'Performance monitor on')
                }}
              >
                <Activity size={16} /> Toggle 60fps monitor ({perfMon ? 'ON' : 'OFF'})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification message */}
      {toastMsg && <div className="toast">{toastMsg}</div>}
    </div>
  )
}
