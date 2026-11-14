import React, { useState, useEffect, useRef } from 'react'
import {
  ArrowRight, ChevronRight, User, Store, Mail, Lock, Eye, EyeOff, Bell, Zap, Image as ImageIcon,
  Pencil, Search, Calendar, ChevronDown, Grid2x2, Building2, Hourglass, XCircle, Package,
  FileText, Settings, HelpCircle, Shield, QrCode, Check, Wifi, LogOut, FolderOpen, Briefcase,
  AlertTriangle, RefreshCw, Smartphone
} from 'lucide-react'
import {
  Screen, Back, Steps, Logo, Chip, Toggle, Check_, CustomerNav, PharmaNav, PillIcon,
  FoilThumb, Blister, PatternDots
} from './ui.jsx'

export const GoogleG = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.7 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.6 17.7 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 7l7.4 5.7c4.3-4 6.9-9.9 6.9-17.2z" />
    <path fill="#FBBC05" d="M10.4 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.8-6.1z" />
    <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.4-5.7c-2 1.4-4.7 2.2-7.8 2.2-6.3 0-11.7-4.1-13.6-9.8l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
  </svg>
)

export const AppleIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#111">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
)

/* ============ 1. Welcome ============ */
export function Welcome({ go, toast }) {
  const [t, setT] = useState(false)
  const [p, setP] = useState(false)
  return (
    <Screen>
      <div className="body" style={{ display: 'flex', flexDirection: 'column', paddingBottom: 26 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 20 }}>
          <Logo height={145} />
          <h1 style={{ fontSize: 36, lineHeight: 1.08 }}>Welcome to<br />Striply</h1>
          <p className="sub" style={{ fontSize: 16, color: 'var(--ink)', opacity: 0.85, maxWidth: 280 }}>
            Smarter medication traceability for a safer tomorrow.
          </p>
        </div>
        <div className="row gap12" style={{ marginBottom: 14 }}>
          <Check_ on={t} onChange={setT} />
          <span style={{ fontSize: 12.5 }}>I have read and agree to Striply's <b>Terms &amp; Conditions</b></span>
        </div>
        <div className="row gap12" style={{ marginBottom: 22 }}>
          <Check_ on={p} onChange={setP} />
          <span style={{ fontSize: 12.5 }}>I have read and agree to Striply's <b>Privacy Policy</b></span>
        </div>
        <button
          className="btn"
          onClick={() => {
            if (t && p) {
              go('role')
            } else {
              toast('Please accept Terms & Privacy Policy to continue')
            }
          }}
        >
          Continue <ArrowRight size={19} />
        </button>
      </div>
    </Screen>
  )
}

/* ============ 2. Role ============ */
export function Role({ go, back, setRole }) {
  const pick = r => {
    setRole(r)
    go('signup')
  }
  const Card = ({ icon, t, d, r }) => (
    <button
      className="glass tile"
      style={{ padding: '22px 18px', borderRadius: 26 }}
      onClick={() => pick(r)}
    >
      <span style={{ color: 'var(--orange)' }}>{icon}</span>
      <span style={{ flex: 1 }}>
        <div className="t1" style={{ fontSize: 15.5 }}>{t}</div>
        <div className="t2" style={{ fontSize: 12.5, lineHeight: 1.35, marginTop: 3 }}>{d}</div>
      </span>
      <ChevronRight size={20} />
    </button>
  )
  return (
    <Screen>
      <div className="body">
        <div className="row" style={{ position: 'relative', height: 40, marginTop: 4 }}>
          <Back onClick={back} />
          <div style={{ position: 'absolute', left: 0, right: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
            <Steps at={0} />
          </div>
        </div>
        <h1 style={{ marginTop: 36, fontSize: 30 }}>Who are you<br />signing in as?</h1>
        <p className="sub" style={{ marginTop: 10 }}>Striply gives each medicine pocket a verifiable identity. Pick the experience that matches your role.</p>
        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card
            r="customer"
            icon={<User size={38} strokeWidth={1.8} />}
            t="I'm a Customer"
            d="Scan RP Lines on your medicine, track doses, get expiry and recall alerts."
          />
          <Card
            r="pharmacy"
            icon={<Store size={38} strokeWidth={1.8} />}
            t="I'm a Pharmacy / Manufacturer"
            d="Register batches, generate RP Lines patterns, manage inventory and verify recall status."
          />
        </div>
        <div style={{ marginTop: 24, padding: '12px 16px', borderRadius: 16, background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield size={16} color="var(--orange)" />
          <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>Manufacturer accounts require verification before issuing official patterns.</span>
        </div>
      </div>
    </Screen>
  )
}

/* ============ 3. Create account ============ */
export function Signup({ go, back, finish, role, toast }) {
  const handleGoogle = () => {
    toast(`Signed in with Google as ${role === 'pharmacy' ? 'Cipla Ltd.' : 'Priya Sharma'}`)
    finish()
  }
  const handleApple = () => {
    toast(`Signed in with Apple as ${role === 'pharmacy' ? 'Cipla Ltd.' : 'Priya Sharma'}`)
    finish()
  }
  return (
    <Screen>
      <div className="body">
        <div className="row" style={{ position: 'relative', height: 40, marginTop: 4 }}>
          <Back onClick={back} />
          <div style={{ position: 'absolute', left: 0, right: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
            <Steps at={1} />
          </div>
        </div>
        <h1 style={{ marginTop: 36, fontSize: 30 }}>Create your account</h1>
        <p className="sub" style={{ marginTop: 10 }}>Get started with Striply in seconds.</p>
        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <button className="btn light" style={{ height: 60, borderRadius: 22 }} onClick={handleGoogle}>
            <GoogleG /> Continue with Google
          </button>
          <button className="btn light" style={{ height: 60, borderRadius: 22 }} onClick={handleApple}>
            <AppleIcon /> Continue with Apple
          </button>
          <div className="divider" style={{ margin: '4px 0' }}>or</div>
          <button className="btn light" style={{ height: 60, borderRadius: 22 }} onClick={() => go('login')}>
            <Mail size={22} color="#FF7A0D" /> Sign up with Email
          </button>
        </div>
        <p style={{ textAlign: 'center', marginTop: 30, fontSize: 13.5 }}>
          Already have an account? <button className="link" onClick={() => go('login')}>Log in</button>
        </p>
      </div>
    </Screen>
  )
}

/* ============ 4. Login ============ */
export function Login({ go, back, finish, role, toast }) {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    if (e) e.preventDefault()
    if (!email || !password) {
      toast('Please enter your email and password')
      return
    }
    toast(`Welcome back! Logged in as ${email}`)
    finish()
  }

  const handleGoogle = () => {
    toast(`Logged in with Google as ${role === 'pharmacy' ? 'Cipla Ltd.' : 'Priya Sharma'}`)
    finish()
  }

  const handleApple = () => {
    toast(`Logged in with Apple as ${role === 'pharmacy' ? 'Cipla Ltd.' : 'Priya Sharma'}`)
    finish()
  }

  return (
    <Screen>
      <div className="body">
        <div className="row" style={{ position: 'relative', height: 40, marginTop: 4 }}>
          <Back onClick={back} />
          <div style={{ position: 'absolute', left: 0, right: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
            <Steps at={2} />
          </div>
        </div>
        <h1 style={{ marginTop: 36, fontSize: 30 }}>Log in to Striply</h1>
        <p className="sub" style={{ marginTop: 10, maxWidth: 290 }}>Welcome back! Continue to manage and verify your medicines.</p>
        <form onSubmit={handleLogin} style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label className="input big">
            <Mail size={20} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
          <label className="input big">
            <Lock size={20} />
            <input
              type={show ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              onClick={() => setShow(!show)}
              type="button"
              style={{ color: 'var(--ink)', padding: 4 }}
              aria-label="Toggle password visibility"
            >
              {show ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </label>
          <div style={{ textAlign: 'right' }}>
            <button
              type="button"
              onClick={() => toast('Password reset link sent to your email')}
              style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink)' }}
            >
              Forgot password?
            </button>
          </div>
          <button className="btn" type="submit">
            Log in <ArrowRight size={19} />
          </button>
          <div className="divider">or</div>
          <div className="row gap16" style={{ justifyContent: 'center' }}>
            <button type="button" className="round-btn" onClick={handleGoogle} aria-label="Sign in with Google">
              <GoogleG size={24} />
            </button>
            <button type="button" className="round-btn" onClick={handleApple} aria-label="Sign in with Apple">
              <AppleIcon size={24} />
            </button>
          </div>
        </form>
        <p style={{ textAlign: 'center', marginTop: 26, fontSize: 13.5 }}>
          Don't have an account? <button className="link" onClick={() => go('signup')}>Sign up</button>
        </p>
      </div>
    </Screen>
  )
}

/* ============ medicine row component ============ */
function MedRow({ name, dose, chip, kind, onClick }) {
  return (
    <button className="glass tile" onClick={onClick}>
      <span className="ico-tile"><PillIcon size={22} /></span>
      <span style={{ flex: 1 }}>
        <div className="t1">{name}</div>
        <div className="t2">{dose}</div>
        <div className="chipwrap">
          <Chip kind={kind} icon={kind === 'green' ? <Check size={11} strokeWidth={3.4} /> : <span style={{ width: 6, height: 6, borderRadius: 9, background: 'currentColor', opacity: 0.85 }} />}>
            {chip}
          </Chip>
        </div>
      </span>
      <ChevronRight size={18} />
    </button>
  )
}

/* ============ 5. Home Screen ============ */
export function HomeScreen({ go, user, toast, onOpenDev }) {
  const [taken, setTaken] = useState(false)

  return (
    <Screen>
      <div className="body pad-nav">
        <div className="row between" style={{ marginTop: 10 }}>
          <div>
            <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>Good morning,</div>
            <div style={{ fontSize: 23, fontWeight: 800, letterSpacing: -0.4 }}>{user}</div>
          </div>
          <div className="row gap8">
            <button
              className="icon-btn"
              style={{ color: 'var(--orange)' }}
              onClick={() => go('alerts')}
              aria-label="Alerts"
            >
              <Bell size={20} fill="currentColor" />
            </button>
            <button
              className="icon-btn"
              onClick={() => go('profile')}
              aria-label="Profile"
            >
              <User size={22} />
            </button>
          </div>
        </div>

        {/* Scan Hero Banner */}
        <button
          className="tile"
          onClick={() => go('scan')}
          style={{
            marginTop: 20,
            background: 'var(--navy)',
            color: '#fff',
            borderRadius: 24,
            padding: '20px',
            boxShadow: '0 14px 28px rgba(16,42,67,0.35)'
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
            <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M8 12h8" />
          </svg>
          <span style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>Scan a medicine</div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>With calibration and verification</div>
          </span>
          <ArrowRight size={22} />
        </button>

        {/* Quick Dose Check-in */}
        <div className="glass tile" style={{ marginTop: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14 }}>Metformin 500</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Scheduled for 08:00 AM</div>
          </div>
          <button
            onClick={() => {
              setTaken(!taken)
              toast(taken ? 'Marked as pending' : 'Metformin 500 marked as taken!')
            }}
            className={`chip ${taken ? 'green' : 'blue'}`}
            style={{ padding: '6px 14px', fontSize: 12, cursor: 'pointer' }}
          >
            {taken ? '✓ Taken' : 'Mark taken'}
          </button>
        </div>

        {/* Currently taking */}
        <div className="row between" style={{ marginTop: 24, marginBottom: 12 }}>
          <h3 style={{ fontSize: 17 }}>Currently taking</h3>
          <button className="small" style={{ fontWeight: 700, color: 'var(--orange)' }} onClick={() => go('medicines')}>See all</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <MedRow name="Paracetamol 650" dose="1 tablet · 08:00 AM" chip="Active" kind="green" onClick={() => go('medicines')} />
          <MedRow name="Metformin 500" dose="1 tablet · 08:00 PM" chip="Active" kind="green" onClick={() => go('medicines')} />
        </div>

        {/* Recent scans */}
        <h3 style={{ fontSize: 17, marginTop: 26, marginBottom: 12 }}>Recent scans</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="glass tile" onClick={() => go('result')}>
            <span className="ico-tile"><QrCode size={22} /></span>
            <span style={{ flex: 1 }}>
              <div className="t1">Paracetamol 650</div>
              <div className="t2">Batch: B204 · 340 days left</div>
            </span>
            <Chip kind="green">Verified</Chip>
          </button>
          <button className="glass tile" onClick={() => go('result')}>
            <span className="ico-tile"><QrCode size={22} /></span>
            <span style={{ flex: 1 }}>
              <div className="t1">Amoxycillin 250</div>
              <div className="t2">Batch: B191 · 18 days left</div>
            </span>
            <Chip kind="amber">Near Expiry</Chip>
          </button>
          <button className="glass tile" onClick={() => go('result')}>
            <span className="ico-tile"><QrCode size={22} /></span>
            <span style={{ flex: 1 }}>
              <div className="t1">Pantocid 40</div>
              <div className="t2">Batch: B170 · Expired 14 days ago</div>
            </span>
            <Chip kind="red">Expired</Chip>
          </button>
        </div>
      </div>
      <CustomerNav active="home" go={go} labels />
    </Screen>
  )
}

/* ============ 6. Scanner Screen ============ */
export function Scan({ go, back, toast }) {
  const [busy, setBusy] = useState(false)
  const [flash, setFlash] = useState(false)
  const [manualOpen, setManualOpen] = useState(false)
  const [manualCode, setManualCode] = useState('')
  const fileInputRef = useRef(null)

  const handleCapture = () => {
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      go('result', false, true)
    }, 1800)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      toast(`Loaded image: ${file.name}`)
      setBusy(true)
      setTimeout(() => {
        setBusy(false)
        go('result', false, true)
      }, 1500)
    }
  }

  const handleManualSubmit = () => {
    if (!manualCode.trim()) {
      toast('Please enter a batch code')
      return
    }
    toast(`Verifying batch ${manualCode}...`)
    setManualOpen(false)
    go('result', false, true)
  }

  const glassBtn = {
    width: 44,
    height: 44,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.18)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  return (
    <Screen dark>
      <div className="body" style={{ display: 'flex', flexDirection: 'column', padding: '0 20px 34px' }}>
        <div className="row between" style={{ marginTop: 6, height: 44 }}>
          <button style={glassBtn} onClick={back} aria-label="Back">
            <Back onClick={back} />
          </button>
          <span style={{ fontWeight: 700, fontSize: 16 }}>Scan RP Lines</span>
          <button
            style={{ ...glassBtn, background: flash ? 'var(--orange)' : glassBtn.background }}
            onClick={() => {
              setFlash(!flash)
              toast(flash ? 'Flashlight off' : 'Flashlight on')
            }}
            aria-label="Toggle Flashlight"
          >
            <Zap size={20} fill={flash ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30 }}>
          <div className="scan-frame">
            <i className="c tl" /><i className="c tr" /><i className="c bl" /><i className="c br" />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Blister />
            </div>
            <div className="scanline" />
          </div>

          {busy ? (
            <div style={{ textAlign: 'center' }}>
              <div className="spin" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: 15, fontWeight: 700 }}>Detecting calibration anchor…</div>
              <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>Decoding 4 RP Lines &amp; verifying registry</div>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 15, fontWeight: 600, maxWidth: 240, lineHeight: 1.4 }}>
                Position the RP Lines pattern inside the frame
              </p>
              <p style={{ fontSize: 12, opacity: 0.65, marginTop: 4 }}>
                Red · Green · Orange · Yellow lines
              </p>
            </div>
          )}
        </div>

        {/* Bottom controls: Gallery upload, Shutter capture, Manual entry */}
        <div className="row between" style={{ padding: '0 8px' }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <button
            style={{ ...glassBtn, borderRadius: 16, width: 50, height: 50 }}
            onClick={() => fileInputRef.current?.click()}
            aria-label="Upload from gallery"
          >
            <ImageIcon size={22} />
          </button>

          <button
            className="shutter"
            onClick={handleCapture}
            disabled={busy}
            aria-label="Capture pattern"
          >
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M8 12h8" />
            </svg>
          </button>

          <button
            style={{ ...glassBtn, borderRadius: 16, width: 50, height: 50 }}
            onClick={() => setManualOpen(true)}
            aria-label="Manual batch code fallback"
          >
            <Pencil size={21} />
          </button>
        </div>
      </div>

      {/* Manual Entry Modal */}
      {manualOpen && (
        <div className="drawer-backdrop" onClick={() => setManualOpen(false)}>
          <div className="drawer-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, marginBottom: 6 }}>Manual Code Fallback</h3>
            <p className="sub" style={{ fontSize: 13, marginBottom: 16 }}>
              If the RP Lines are distorted or foil is crushed, type the batch code printed on the blister.
            </p>
            <div className="field">
              <label>Batch Number</label>
              <div className="input">
                <input
                  placeholder="e.g. BH-9723A"
                  value={manualCode}
                  onChange={e => setManualCode(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <div className="row gap12" style={{ marginTop: 18 }}>
              <button className="btn light sm" style={{ flex: 1 }} onClick={() => setManualOpen(false)}>Cancel</button>
              <button className="btn sm" style={{ flex: 1 }} onClick={handleManualSubmit}>Verify</button>
            </div>
          </div>
        </div>
      )}
    </Screen>
  )
}

/* ============ 7. Scan Result Screen ============ */
export function Result({ go, back, toast }) {
  const [saved, setSaved] = useState(false)

  const Row = ({ icon, k, v }) => (
    <div className="row gap12" style={{ padding: '10px 4px', borderBottom: '1px solid rgba(255,255,255,0.4)' }}>
      <span style={{ color: 'var(--orange)', width: 24, display: 'flex' }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div className="small" style={{ fontSize: 11.5 }}>{k}</div>
        <div style={{ fontWeight: 800, fontSize: 14.5 }}>{v}</div>
      </div>
    </div>
  )

  return (
    <Screen>
      <div className="body" style={{ display: 'flex', flexDirection: 'column', paddingBottom: 26 }}>
        <div className="row gap12" style={{ height: 40, marginTop: 4 }}>
          <Back onClick={back} />
          <span style={{ fontWeight: 800, fontSize: 16 }}>Scan Result</span>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <div style={{
            width: 86,
            height: 86,
            borderRadius: '50%',
            margin: '0 auto',
            background: 'radial-gradient(circle, #E9F7E7, #D6F0D3)',
            border: '2px solid #fff',
            boxShadow: '0 10px 26px rgba(70,170,90,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#3FB05A'
          }}>
            <Check size={46} strokeWidth={3.4} />
          </div>
          <h1 style={{ fontSize: 28, marginTop: 16 }}>Verified Authentic</h1>
          <p style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>Paracetamol 650</p>
          <div style={{ marginTop: 6 }}>
            <Chip kind="green">Active Record · 340 Days Remaining</Chip>
          </div>
        </div>

        <div className="glass" style={{ marginTop: 24, padding: '10px 18px' }}>
          <Row icon={<Grid2x2 size={20} />} k="Medicine ID & Batch" v="MED-2024-KM01 · B204-P-12" />
          <Row icon={<Calendar size={20} />} k="Manufacturing Date" v="15 Oct 2024" />
          <Row icon={<Calendar size={20} />} k="Expiry Date" v="10 Dec 2027" />
          <Row icon={<Building2 size={20} />} k="Manufacturer" v="Cipla Ltd. (Verified)" />
          <Row icon={<Shield size={20} />} k="Pattern Encoding" v="RP Lines v0.3 · 4-Color Matrix" />
        </div>

        <div style={{ flex: 1, minHeight: 20 }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            className="btn"
            onClick={() => {
              setSaved(true)
              toast('Saved to My Medicines!')
              go('medicines')
            }}
          >
            {saved ? '✓ Saved' : 'Save to My Medicines'} <ArrowRight size={19} />
          </button>
          <button className="btn light sm" onClick={() => go('scan')}>
            Scan Another Medicine
          </button>
        </div>

        <p className="small" style={{ textAlign: 'center', marginTop: 14, fontSize: 11, lineHeight: 1.4, opacity: 0.8 }}>
          A registered pattern match verifies that the encoded record is authentic in the registry, but does not independently substitute laboratory chemical analysis.
        </p>
      </div>
    </Screen>
  )
}

/* ============ 8. My Medicines ============ */
const MEDS = {
  Current: [
    ['Paracetamol 650', '1 tablet · 08:00 AM', 'Active', 'green'],
    ['Metformin 500', '1 tablet · 08:00 PM', 'Active', 'green'],
    ['Cartid Duo 10', '10 mg / 100mg · 1 tablet', 'Active', 'green'],
  ],
  Upcoming: [
    ['Vitamin D3 60k', '1 capsule · Every Sunday', 'Starts 18 Nov', 'blue'],
    ['Amoxicillin 500', '1 capsule · Thrice a day', 'Starts 22 Nov', 'blue'],
  ],
  Completed: [
    ['Azithromycin 250', '1 tablet · Once a day', 'Completed', 'green'],
    ['Pantocid 40', '1 tablet · Before breakfast', 'Discontinued', 'amber'],
  ],
}

export function Medicines({ go }) {
  const [tab, setTab] = useState('Current')
  return (
    <Screen>
      <div className="body pad-nav">
        <h2 style={{ marginTop: 10, fontSize: 22 }}>My Medicines</h2>
        <div className="tabs" style={{ marginTop: 16 }}>
          {Object.keys(MEDS).map(t => (
            <button
              key={t}
              className={'tab' + (tab === t ? ' on' : '')}
              onClick={() => setTab(t)}
            >
              {t === 'Current' ? 'Currently Taking' : t}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {MEDS[tab].map(([n, d, c, k]) => (
            <MedRow
              key={n}
              name={n}
              dose={d}
              chip={c}
              kind={k}
              onClick={() => go('result')}
            />
          ))}
        </div>
      </div>
      <CustomerNav active="medicines" go={go} />
    </Screen>
  )
}

/* ============ 9. Inventory Screen ============ */
export function Inventory({ go, items = [] }) {
  const [q, setQ] = useState('')
  const [f, setF] = useState('All')

  const list = items.filter(i =>
    (f === 'All' ||
      (f === 'Active' && i.s === 'green') ||
      (f === 'Near expiry' && i.s === 'orange') ||
      (f === 'Recalled' && i.s === 'indigo') ||
      (f === 'Expired' && i.s === 'red')) &&
    (i.name + ' ' + i.batch).toLowerCase().includes(q.toLowerCase())
  )

  const dotColors = {
    green: '#35B552',
    indigo: '#4A55D8',
    orange: '#FF8A1F',
    red: '#E0382F',
    gray: '#B5ADA8'
  }

  return (
    <Screen>
      <div className="body pad-nav">
        <h2 style={{ marginTop: 10, fontSize: 22 }}>Inventory</h2>

        {/* Search */}
        <label className="input search" style={{ marginTop: 16 }}>
          <Search size={19} />
          <input
            placeholder="Search all batches or medicines..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </label>

        {/* Filter chips */}
        <div className="tabs" style={{ marginTop: 14 }}>
          {['All', 'Active', 'Near expiry', 'Recalled', 'Expired'].map(t => (
            <button
              key={t}
              className={'tab' + (f === t ? ' on' : '')}
              onClick={() => setF(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Stats header */}
        <div className="row gap12" style={{ marginTop: 14 }}>
          <div className="glass" style={{ flex: 1, padding: '12px 14px' }}>
            <div style={{ fontSize: 20, fontWeight: 800 }}>12,200</div>
            <div className="small">Total units</div>
          </div>
          <div className="glass" style={{ flex: 1, padding: '12px 14px' }}>
            <div style={{ fontSize: 20, fontWeight: 800 }}>22 Days</div>
            <div className="small">Median shelf life</div>
          </div>
        </div>

        {/* Batch cards */}
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {list.map((i, idx) => (
            <button
              key={idx}
              className="glass tile"
              onClick={() => go('foil')}
              style={{ position: 'relative' }}
            >
              <span className="ico-tile" style={{ background: 'transparent', border: 0 }}>
                <PillIcon size={30} />
              </span>
              <span style={{ flex: 1 }}>
                <div className="t1" style={{ fontSize: 15 }}>{i.name}</div>
                <div className="t2">Batch: {i.batch}</div>
                <div className="t2" style={{ marginTop: 2 }}>{i.qty}</div>
              </span>
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: dotColors[i.s] || '#35B552',
                  boxShadow: `0 0 0 5px ${(dotColors[i.s] || '#35B552')}28`
                }}
              />
            </button>
          ))}
          {!list.length && (
            <p className="sub" style={{ textAlign: 'center', marginTop: 30 }}>
              No matching batches found in inventory.
            </p>
          )}
        </div>
      </div>
      <PharmaNav active="inventory" go={go} />
    </Screen>
  )
}

/* ============ 10. New Batch Entry Form ============ */
const fmt = d => d ? new Date(d + 'T00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

function DateField({ label, value, onChange, error }) {
  return (
    <div className="field" style={{ flex: 1 }}>
      <label>{label} *</label>
      <div className={`input ${error ? 'invalid' : ''}`} style={{ position: 'relative', fontSize: 14 }}>
        <span>{fmt(value) || 'Select date'}</span>
        <Calendar size={16} />
        <input
          type="date"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
        />
      </div>
      {error && <div className="err">{error}</div>}
    </div>
  )
}

export function NewBatch({ go, back, form, setForm, addEntry, toast }) {
  const [errors, setErrors] = useState({})
  const set = k => e => {
    setForm({ ...form, [k]: e.target.value })
    if (errors[k]) setErrors({ ...errors, [k]: null })
  }

  const validateAndSubmit = () => {
    const errs = {}
    if (!form.name?.trim()) errs.name = 'Required'
    if (!form.batch?.trim()) errs.batch = 'Required'
    if (!form.mfg) errs.mfg = 'Required'
    if (!form.exp) errs.exp = 'Required'

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      toast('Please fill all required fields')
      return
    }

    addEntry()
    toast(`Registered batch ${form.batch} with RP Lines!`)
    go('foil')
  }

  return (
    <Screen>
      <div className="body pad-nav">
        <Back onClick={back} />
        <h2 style={{ marginTop: 4, fontSize: 22 }}>New batch entry</h2>
        <div style={{ marginTop: 18 }}>
          <div className="field">
            <label>Medicine name *</label>
            <div className={`input ${errors.name ? 'invalid' : ''}`}>
              <input
                value={form.name}
                onChange={set('name')}
                placeholder="e.g. Paracetamol 650"
              />
            </div>
            {errors.name && <div className="err">{errors.name}</div>}
          </div>

          <div className="field">
            <label>Strength</label>
            <div className="input">
              <input
                value={form.strength}
                onChange={set('strength')}
                placeholder="e.g. 650 mg"
              />
            </div>
          </div>

          <div className="field">
            <label>Manufacturer *</label>
            <div className="input">
              <select value={form.mfr} onChange={set('mfr')}>
                <option>Cipla Ltd.</option>
                <option>Sun Pharma</option>
                <option>Dr. Reddy's</option>
                <option>Lupin</option>
              </select>
              <ChevronDown size={16} />
            </div>
          </div>

          <div className="field">
            <label>Manufacturer batch number *</label>
            <div className={`input ${errors.batch ? 'invalid' : ''}`}>
              <input
                value={form.batch}
                onChange={set('batch')}
                placeholder="e.g. B204-P-12"
              />
            </div>
            {errors.batch && <div className="err">{errors.batch}</div>}
          </div>

          <div className="row gap12">
            <DateField
              label="Manufactured on"
              value={form.mfg}
              onChange={v => {
                setForm({ ...form, mfg: v })
                if (errors.mfg) setErrors({ ...errors, mfg: null })
              }}
              error={errors.mfg}
            />
            <DateField
              label="Expires on"
              value={form.exp}
              onChange={v => {
                setForm({ ...form, exp: v })
                if (errors.exp) setErrors({ ...errors, exp: null })
              }}
              error={errors.exp}
            />
          </div>

          <div className="row gap12">
            <div className="field" style={{ flex: 1.2 }}>
              <label>Available quantity</label>
              <div className="input">
                <input
                  value={form.qty}
                  onChange={set('qty')}
                  inputMode="numeric"
                  placeholder="10,000"
                />
              </div>
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label>Unit *</label>
              <div className="input">
                <select value={form.unit} onChange={set('unit')}>
                  <option>Tablets</option>
                  <option>Capsules</option>
                  <option>Strips</option>
                  <option>Vials</option>
                </select>
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {/* RP Lines Live Pattern Preview */}
          <div className="glass" style={{ marginTop: 10, padding: '12px 14px' }}>
            <div className="small" style={{ fontWeight: 700, marginBottom: 8, color: 'var(--ink)' }}>
              Assigned RP Lines Pattern Preview
            </div>
            <svg viewBox="0 0 200 45" width="100%" height="45">
              <rect width="100%" height="100%" rx="8" fill="#F4EDE8" />
              <PatternDots x={25} y={8} seed={14} rows={3} gap={10} r={3} />
              <PatternDots x={110} y={8} seed={19} rows={3} gap={10} r={3} />
            </svg>
          </div>
        </div>

        <button
          className="btn"
          style={{ marginTop: 18 }}
          onClick={validateAndSubmit}
        >
          Add entry <ArrowRight size={19} />
        </button>
      </div>
      <PharmaNav active="batch" go={go} />
    </Screen>
  )
}

/* ============ 11. Foil artwork preview ============ */
export function Foil({ go, back, form, toast }) {
  const [w, setW] = useState('180 mm')
  const [r, setR] = useState('70 mm')
  const [z, setZ] = useState('Fit')

  const legend = [
    ['#E5322D', 'Calibration dot'],
    ['#3FA34D', 'Red: Batch ID code'],
    ['#F28C1E', 'Green: Expiry code'],
    ['#3B4FD0', 'Blue: Verification pattern']
  ]

  const exportSvg = () => {
    const widthVal = parseInt(w) || 180
    const heightVal = parseInt(r) || 70
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${widthVal * 4} ${heightVal * 4}" width="${widthVal}mm" height="${heightVal}mm">
  <rect width="100%" height="100%" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2"/>
  <text x="20" y="30" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#102A43">Striply Foil Artwork · ${form.mfr || 'Cipla Ltd.'}</text>
  <text x="20" y="48" font-family="Arial, sans-serif" font-size="11" fill="#64748B">Medicine: ${form.name} | Batch: ${form.batch} | Exp: ${form.exp}</text>
  <!-- 2x5 Pocket Matrix with RP Lines -->
  ${[0, 1].map(row => [0, 1, 2, 3, 4].map(col => `
    <g transform="translate(${25 + col * 135}, ${70 + row * 110})">
      <rect width="120" height="95" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
      <!-- Calibration Anchor -->
      <circle cx="20" cy="20" r="4" fill="#3B4FD0"/>
      <!-- RP Lines -->
      <line x1="35" y1="20" x2="105" y2="20" stroke="#E5322D" stroke-width="3" stroke-linecap="round"/>
      <line x1="35" y1="35" x2="105" y2="35" stroke="#3FA34D" stroke-width="3" stroke-linecap="round"/>
      <line x1="35" y1="50" x2="105" y2="50" stroke="#F28C1E" stroke-width="3" stroke-linecap="round"/>
      <line x1="35" y1="65" x2="105" y2="65" stroke="#F4C20D" stroke-width="3" stroke-linecap="round"/>
      <text x="20" y="84" font-family="Arial, sans-serif" font-size="8" fill="#475569">${form.batch}</text>
    </g>
  `).join('')).join('')}
</svg>`

    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `striply-foil-${form.batch}.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast('Artwork SVG exported successfully!')
  }

  return (
    <Screen>
      <div className="body pad-nav" style={{ paddingBottom: 30 }}>
        <Back onClick={back} />
        <h2 style={{ marginTop: 4, fontSize: 22 }}>Foil artwork preview</h2>
        <div className="small" style={{ marginTop: 2, fontSize: 13, color: 'var(--ink)' }}>
          Cipla Ltd. · 10 pockets (2x5) · Batch: {form.batch}
        </div>

        {/* Blister 2x5 interactive foil visualizer */}
        <div className="glass" style={{ marginTop: 14, padding: '14px 12px 10px', transform: z === '200%' ? 'scale(1.05)' : undefined }}>
          <FoilThumb seeds={z === 'Fit' ? [3, 7, 11, 5] : z === '100%' ? [4, 8, 12, 6] : [9, 2, 13, 1]} />
        </div>

        <h3 style={{ marginTop: 20, fontSize: 15 }}>Blister configuration</h3>
        <div className="row gap12" style={{ marginTop: 10 }}>
          <div className="field" style={{ flex: 1, marginBottom: 0 }}>
            <label style={{ fontSize: 11.5 }}>Foil width</label>
            <div className="input" style={{ height: 40 }}>
              <select value={w} onChange={e => setW(e.target.value)}>
                {['120 mm', '150 mm', '180 mm'].map(o => <option key={o}>{o}</option>)}
              </select>
              <ChevronDown size={15} />
            </div>
          </div>
          <div className="field" style={{ flex: 1, marginBottom: 0 }}>
            <label style={{ fontSize: 11.5 }}>Height</label>
            <div className="input" style={{ height: 40 }}>
              <select value={r} onChange={e => setR(e.target.value)}>
                {['60 mm', '70 mm', '90 mm'].map(o => <option key={o}>{o}</option>)}
              </select>
              <ChevronDown size={15} />
            </div>
          </div>
        </div>

        <div className="tabs" style={{ marginTop: 12 }}>
          {['Fit', '100%', '200%'].map(t => (
            <button
              key={t}
              className={'tab seg' + (z === t ? ' on' : '')}
              onClick={() => setZ(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 7 }}>
          <div className="small" style={{ fontWeight: 800, color: 'var(--ink)', marginBottom: 2 }}>Legend</div>
          {legend.map(([c, t]) => (
            <div key={t} className="row gap12" style={{ fontSize: 12.5 }}>
              <i style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
              {t}
            </div>
          ))}
        </div>

        <div className="row gap12" style={{ marginTop: 22 }}>
          <button className="btn light sm" style={{ flex: 1 }} onClick={() => go('batch', true)}>
            &lt; Back to entries
          </button>
          <button className="btn sm" style={{ flex: 1 }} onClick={exportSvg}>
            Export artwork
          </button>
        </div>
      </div>
      <PharmaNav active="batch" go={go} />
    </Screen>
  )
}

/* ============ 12. Organization / Manufacturer Overview ============ */
export function Org({ go, toast }) {
  const Stat = ({ n, t }) => (
    <div className="glass" style={{ flex: 1, padding: '16px 14px' }}>
      <div style={{ fontSize: 24, fontWeight: 800 }}>{n}</div>
      <div className="small" style={{ fontSize: 12, marginTop: 2 }}>{t}</div>
    </div>
  )

  const Item = ({ icon, t, right, onClick }) => (
    <button className="glass tile" style={{ padding: '13px 16px' }} onClick={onClick}>
      <span style={{ color: 'var(--orange)', display: 'flex' }}>{icon}</span>
      <span style={{ flex: 1, fontWeight: 700, fontSize: 14 }}>{t}</span>
      {right || <ChevronRight size={17} />}
    </button>
  )

  return (
    <Screen>
      <div className="body pad-nav">
        <div className="row between" style={{ marginTop: 14 }}>
          <div className="row gap12">
            <span className="ico-tile" style={{ width: 48, height: 48, borderRadius: 16, background: 'var(--orange-soft)' }}>
              <Building2 size={24} />
            </span>
            <div>
              <h2 style={{ fontSize: 20 }}>Cipla Ltd.</h2>
              <div style={{ marginTop: 2 }}>
                <Chip kind="trust">
                  <span style={{ width: 6, height: 6, borderRadius: 9, background: '#5BAA45' }} />
                  Verified Manufacturer
                </Chip>
              </div>
            </div>
          </div>
        </div>

        <h3 style={{ marginTop: 22, fontSize: 14 }}>Activity overview</h3>
        <div className="row gap12" style={{ marginTop: 10 }}>
          <Stat n="4" t="Registered batches" />
          <Stat n="4" t="Active patterns" />
        </div>
        <div className="row gap12" style={{ marginTop: 10 }}>
          <Stat n="1" t="Near expiry" />
          <Stat n="1" t="Recalled" />
        </div>

        <h3 style={{ marginTop: 22, fontSize: 14 }}>Quick actions</h3>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Item icon={<Boxes size={20} />} t="Register new batch" onClick={() => go('batch')} />
          <Item icon={<Package size={20} />} t="Browse batch records" onClick={() => go('inventory')} />
          <Item icon={<AlertTriangle size={20} />} t="Inventory & recalls" onClick={() => go('alerts')} />
        </div>

        {/* Needs attention alert card */}
        <div className="glass tile" style={{ marginTop: 18, borderLeft: '4px solid var(--red)' }}>
          <AlertTriangle size={24} color="var(--red)" />
          <span style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14 }}>Needs attention this week</div>
            <div className="small">Pantocid 40 · Batch B170 · Reported for recall</div>
          </span>
          <Chip kind="red">Recall</Chip>
        </div>

        <button
          className="btn light"
          style={{ marginTop: 22, height: 50 }}
          onClick={() => {
            toast('Signed out')
            go('welcome', false, false, true)
          }}
        >
          Sign out
        </button>
      </div>
      <PharmaNav active="org" go={go} />
    </Screen>
  )
}

/* ============ 13. Preferences ============ */
export function Preferences({ go, back, toast }) {
  const [p, setP] = useState({ push: true, expiry: true, offline: false, dark: false })

  const T = ({ icon, t, k }) => (
    <div className="row gap12" style={{ padding: '14px 4px', borderBottom: '1px solid rgba(255,255,255,0.4)' }}>
      <span style={{ display: 'flex' }}>{icon}</span>
      <span style={{ flex: 1, fontWeight: 700, fontSize: 14 }}>{t}</span>
      <Toggle
        on={p[k]}
        onChange={v => {
          setP({ ...p, [k]: v })
          toast(`${t}: ${v ? 'Enabled' : 'Disabled'}`)
        }}
      />
    </div>
  )

  const L = ({ icon, t, onClick }) => (
    <button
      className="row gap12"
      style={{ padding: '14px 4px', width: '100%', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.4)' }}
      onClick={onClick}
    >
      <span style={{ display: 'flex' }}>{icon}</span>
      <span style={{ flex: 1, fontWeight: 700, fontSize: 14 }}>{t}</span>
      <ChevronRight size={17} />
    </button>
  )

  return (
    <Screen>
      <div className="body" style={{ paddingBottom: 30 }}>
        <Back onClick={back} />
        <h2 style={{ marginTop: 4, fontSize: 22 }}>Preferences</h2>
        <div className="glass" style={{ marginTop: 20, padding: '4px 16px' }}>
          <T icon={<Bell size={20} />} t="Push notifications" k="push" />
          <T icon={<AlertTriangle size={20} />} t="Expiry alerts" k="expiry" />
          <T icon={<Wifi size={20} />} t="Offline calibration cache" k="offline" />
        </div>

        <div className="row between" style={{ marginTop: 22, padding: '0 4px', fontSize: 13 }}>
          <span>Last cloud synchronization</span>
          <span className="small" style={{ fontSize: 12 }}>2 min ago</span>
        </div>

        <div className="glass" style={{ marginTop: 14, padding: '4px 16px' }}>
          <L icon={<User size={20} />} t="Edit profile" onClick={() => toast('Profile editor opened')} />
          <L icon={<HelpCircle size={20} />} t="Help & support" onClick={() => toast('Support portal: support@striply.com')} />
          <L icon={<FileText size={20} />} t="Terms & privacy" onClick={() => toast('Displaying Striply Privacy Agreement v1.0')} />
        </div>
      </div>
    </Screen>
  )
}

/* ============ 14. Alerts Screen ============ */
export function Alerts({ go, role, toast }) {
  const [tab, setTab] = useState('All')
  const data = [
    { c: 'risk', icon: <Hourglass size={24} color="#FF7A0D" />, t: 'Near Expiry', n: 'Amoxycillin 250 (Batch B191)', d: 'Expires in 18 days', dc: 'var(--amber)' },
    { c: 'risk', icon: <XCircle size={26} color="#E0382F" />, t: 'Expired Medicine', n: 'Pantocid 40 (Batch B170)', d: 'Expired 14 days ago', dc: 'var(--red)' },
    { c: 'risk', icon: <AlertTriangle size={24} color="#E0382F" />, t: 'Batch Recall Notice', n: 'Ubent-D 100/500 (Batch UB-4491)', d: 'Manufacturer recall issued', dc: 'var(--red)' },
    { c: 'note', icon: <Bell size={22} color="#FF7A0D" />, t: 'Dose Reminder', n: 'Paracetamol 650', d: 'Take 1 tablet at 08:00 PM', dc: 'var(--muted)' },
    { c: 'note', icon: <Shield size={22} color="#FF7A0D" />, t: 'Offline Sync Complete', n: 'Calibration cache updated', d: '2 min ago', dc: 'var(--muted)' },
  ].filter(a => tab === 'All' || (tab === 'At Risk' && a.c === 'risk') || (tab === 'Notes' && a.c === 'note'))

  return (
    <Screen>
      <div className="body pad-nav">
        <div className="row gap8" style={{ marginTop: 10 }}>
          <Bell size={24} strokeWidth={2} />
          <h2 style={{ fontSize: 22 }}>Alerts</h2>
        </div>
        <div className="tabs" style={{ marginTop: 16 }}>
          {['All', 'At Risk', 'Notes'].map(t => (
            <button
              key={t}
              className={'tab' + (tab === t ? ' on' : '')}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {data.map((a, i) => (
            <button
              key={i}
              className="glass tile"
              style={{ padding: '16px 14px' }}
              onClick={() => toast(`Alert: ${a.t} · ${a.n}`)}
            >
              <span style={{ display: 'flex', width: 32, justifyContent: 'center' }}>{a.icon}</span>
              <span style={{ flex: 1 }}>
                <div className="t1" style={{ fontSize: 14.5 }}>{a.t}</div>
                <div className="t2" style={{ fontSize: 12.5, color: 'var(--ink)' }}>{a.n}</div>
                <div className="t2" style={{ fontSize: 12, color: a.dc, fontWeight: 700 }}>{a.d}</div>
              </span>
              <ChevronRight size={17} />
            </button>
          ))}
        </div>
      </div>
      {role === 'pharmacy' ? <PharmaNav active="alerts" go={go} /> : <CustomerNav active="alerts" go={go} />}
    </Screen>
  )
}

/* ============ 15. Profile Screen ============ */
export function Profile({ go, role, user, toast, onOpenDev }) {
  const initials = user.split(' ').map(s => s[0]).join('')
  const Row = ({ icon, t, sub, onClick }) => (
    <button className="glass tile" style={{ padding: '14px 18px' }} onClick={onClick}>
      <span style={{ display: 'flex' }}>{icon}</span>
      <span style={{ flex: 1 }}>
        <div className="t1" style={{ fontSize: 14.5 }}>{t}</div>
        {sub && <div className="t2">{sub}</div>}
      </span>
      <ChevronRight size={17} />
    </button>
  )

  return (
    <Screen>
      <div className="body pad-nav">
        <div className="row between" style={{ marginTop: 10 }}>
          <h2 style={{ fontSize: 22 }}>My Profile</h2>
          <button
            onClick={onOpenDev}
            className="small"
            style={{ fontWeight: 700, color: 'var(--orange)', padding: 4 }}
            aria-label="Developer panel"
          >
            Dev tools
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <div className="avatar" style={{ margin: '0 auto' }}>{initials}</div>
          <h2 style={{ marginTop: 12 }}>{user}</h2>
          <div className="small" style={{ fontSize: 13.5, marginTop: 2 }}>
            {role === 'pharmacy' ? 'Verified Pharmacy Operator' : 'Customer Account'}
          </div>
        </div>

        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {role === 'pharmacy' && (
            <Row icon={<Building2 size={20} />} t="My Organization" sub="Cipla Ltd." onClick={() => go('org')} />
          )}
          <Row icon={<Settings size={20} />} t="Preferences" onClick={() => go('prefs')} />
          <Row icon={<Shield size={20} />} t="Help & Support" onClick={() => toast('Help & Support: help@striply.com')} />
          <Row icon={<FileText size={20} />} t="Terms & Privacy" onClick={() => toast('Terms & Privacy agreement loaded')} />
        </div>

        <button
          className="btn light"
          style={{ marginTop: 22, height: 50 }}
          onClick={() => {
            toast('Logged out')
            go('welcome', false, false, true)
          }}
        >
          Sign out
        </button>
      </div>
      {role === 'pharmacy' ? <PharmaNav active="" go={go} /> : <CustomerNav active="profile" go={go} />}
    </Screen>
  )
}

