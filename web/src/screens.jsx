import React, { useState, useEffect, useRef } from 'react'
import {
  ArrowRight, ChevronRight, User, Store, Mail, Lock, Eye, EyeOff, Bell, Zap, Image as ImageIcon,
  Pencil, Search, Calendar, ChevronDown, Grid2x2, Building2, Hourglass, XCircle, Package,
  FileText, Settings, HelpCircle, Shield, QrCode, Check, Wifi, LogOut, FolderOpen, Briefcase,
  AlertTriangle, RefreshCw, Upload, CheckCircle2, Phone, MapPin, Globe, FileCheck, Info, X
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

/* Email Autocomplete Suggestions helper (Requirement 2.E) */
const EMAIL_DOMAINS = ['@gmail.com', '@outlook.com', '@yahoo.com', '@icloud.com', '@pharma.com']

function EmailInputWithSuggestions({ value, onChange, placeholder = 'Email address' }) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredDomains, setFilteredDomains] = useState([])

  useEffect(() => {
    if (!value || value.includes('@')) {
      const parts = value.split('@')
      if (parts.length === 2 && parts[1].length > 0) {
        const matches = EMAIL_DOMAINS.filter(d => d.startsWith('@' + parts[1]))
        setFilteredDomains(matches)
        setShowSuggestions(matches.length > 0)
      } else if (parts.length === 2 && parts[1].length === 0) {
        setFilteredDomains(EMAIL_DOMAINS)
        setShowSuggestions(true)
      } else {
        setShowSuggestions(false)
      }
    } else if (value.length >= 2) {
      setFilteredDomains(EMAIL_DOMAINS)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [value])

  const selectDomain = (domain) => {
    const base = value.includes('@') ? value.split('@')[0] : value
    onChange(base + domain)
    setShowSuggestions(false)
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <label className="input big">
        <Mail size={20} />
        <input
          type="email"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => value && setShowSuggestions(true)}
          autoComplete="email"
        />
      </label>
      {showSuggestions && filteredDomains.length > 0 && (
        <div className="email-suggestions">
          {filteredDomains.map(d => (
            <div
              key={d}
              className="email-suggestion-item"
              onMouseDown={() => selectDomain(d)}
            >
              <span>{value.includes('@') ? value.split('@')[0] : value}<b>{d}</b></span>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>Tab or Click</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ============ 1. Welcome to Striply (Kept intact as required) ============ */
export function Welcome({ go, toast }) {
  const [t, setT] = useState(false)
  const [p, setP] = useState(false)
  return (
    <Screen>
      <div className="body" style={{ display: 'flex', flexDirection: 'column', paddingBottom: 26 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 20 }}>
          <Logo height={140} />
          <h1 style={{ fontSize: 34, lineHeight: 1.08 }}>Welcome to<br />Striply</h1>
          <p className="sub" style={{ fontSize: 15.5, color: 'var(--ink)', opacity: 0.85, maxWidth: 280 }}>
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

/* ============ 2. Role Selection – Second Screen ============ */
export function Role({ go, back, setRole }) {
  const pick = r => {
    setRole(r)
    go('signup')
  }

  const Card = ({ icon, t, d, r }) => (
    <button
      className="glass tile"
      style={{ padding: '20px 18px', borderRadius: 24 }}
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
        <h1 style={{ marginTop: 32, fontSize: 29 }}>Who are you<br />signing in as?</h1>
        <p className="sub" style={{ marginTop: 10 }}>Striply gives each medicine pocket a verifiable identity. Pick the experience that matches your role.</p>
        <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card
            r="customer"
            icon={<User size={36} strokeWidth={1.8} />}
            t="I'm a Customer"
            d="Scan verification patterns on medicines, track doses, get expiry and recall alerts."
          />
          <Card
            r="pharmacy"
            icon={<Store size={36} strokeWidth={1.8} />}
            t="I'm a Pharmacy / Manufacturer"
            d="Register batches, generate verification patterns, manage inventory and verify recall status."
          />
        </div>
        <div style={{ marginTop: 22, padding: '12px 16px', borderRadius: 16, background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield size={16} color="var(--orange)" />
          <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>Manufacturer accounts require pharmaceutical licence verification before issuing official patterns.</span>
        </div>
      </div>
    </Screen>
  )
}

/* ============ 3. Account Creation – Third Screen ============ */
export function Signup({ go, back, onGoogleOAuth, onAppleOAuth, onEmailSignup, role, toast }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !email || !password) {
      toast('Please enter your name, email, and password')
      return
    }
    onEmailSignup({ name, email, password })
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
        <h1 style={{ marginTop: 26, fontSize: 29 }}>Create your account</h1>
        <p className="sub" style={{ marginTop: 6 }}>
          {role === 'pharmacy' ? 'Create a manufacturer account to begin verification.' : 'Get started with Striply in seconds.'}
        </p>

        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button className="btn light" style={{ height: 52, borderRadius: 18 }} onClick={onGoogleOAuth}>
            <GoogleG /> Continue with Google
          </button>
          <button className="btn light" style={{ height: 52, borderRadius: 18 }} onClick={onAppleOAuth}>
            <AppleIcon /> Continue with Apple
          </button>
        </div>

        <div className="divider" style={{ margin: '18px 0 14px' }}>or create with email</div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label className="input big">
            <User size={20} />
            <input
              placeholder={role === 'pharmacy' ? 'Company / Business Name' : 'Full Name'}
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>

          <EmailInputWithSuggestions
            value={email}
            onChange={setEmail}
            placeholder={role === 'pharmacy' ? 'Official Company Email' : 'Email address'}
          />

          <label className="input big">
            <Lock size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              type="button"
              style={{ color: 'var(--ink)', padding: 4 }}
              aria-label="Toggle password"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </label>

          <button className="btn" type="submit" style={{ marginTop: 4 }}>
            Create Account <ArrowRight size={19} />
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, marginBottom: 20, fontSize: 13.5 }}>
          Already have an account? <button className="link" onClick={() => go('login')}>Login</button>
        </p>
      </div>
    </Screen>
  )
}

/* ============ 4. Login Screen (Separated from Signup) ============ */
export function Login({ go, back, onGoogleOAuth, onAppleOAuth, onEmailLogin, role, toast }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast('Please enter your email and password')
      return
    }
    onEmailLogin({ email, password })
  }

  return (
    <Screen>
      <div className="body">
        <div className="row" style={{ height: 40, marginTop: 4 }}>
          <Back onClick={back} />
        </div>
        <h1 style={{ marginTop: 24, fontSize: 29 }}>Log in to Striply</h1>
        <p className="sub" style={{ marginTop: 8, maxWidth: 290 }}>
          Welcome back! Access your verified medication records.
        </p>

        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button className="btn light" style={{ height: 52, borderRadius: 18 }} onClick={onGoogleOAuth}>
            <GoogleG /> Continue with Google
          </button>
          <button className="btn light" style={{ height: 52, borderRadius: 18 }} onClick={onAppleOAuth}>
            <AppleIcon /> Continue with Apple
          </button>
        </div>

        <div className="divider" style={{ margin: '18px 0 14px' }}>or log in with email</div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <EmailInputWithSuggestions
            value={email}
            onChange={setEmail}
            placeholder="Registered email address"
          />

          <label className="input big">
            <Lock size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              type="button"
              style={{ color: 'var(--ink)', padding: 4 }}
              aria-label="Toggle password"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
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

          <button className="btn" type="submit" style={{ marginTop: 4 }}>
            Log In <ArrowRight size={19} />
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13.5 }}>
          Don't have an account? <button className="link" onClick={() => go('signup')}>Sign up</button>
        </p>
      </div>
    </Screen>
  )
}

/* ============ Google Account Selection Modal (Requirement 2.D) ============ */
export function GoogleAccountModal({ onClose, onSelectAccount, role }) {
  const [customEmail, setCustomEmail] = useState('')
  const [showCustom, setShowCustom] = useState(false)

  const accounts = [
    {
      name: 'Priya Sharma',
      email: 'priya.sharma@gmail.com',
      avatar: 'PS',
      desc: 'Customer Account',
    },
    {
      name: 'Cipla Ltd. Operations',
      email: 'cipla.pharma@gmail.com',
      avatar: 'CL',
      desc: 'Registered Manufacturer',
    },
    {
      name: 'Dr. Reddy\'s Regulatory',
      email: 'regulatory@drreddys.com',
      avatar: 'DR',
      desc: 'Pharmaceutical Partner',
    },
  ]

  return (
    <div className="drawer-backdrop" onClick={onClose} style={{ alignItems: 'center' }}>
      <div className="oauth-modal" onClick={e => e.stopPropagation()}>
        <div className="row between" style={{ marginBottom: 14 }}>
          <div className="row gap8">
            <GoogleG size={22} />
            <span style={{ fontWeight: 800, fontSize: 16 }}>Sign in with Google</span>
          </div>
          <button onClick={onClose} aria-label="Close dialog"><X size={20} /></button>
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
          Choose an account to continue to <b>Striply</b>
        </p>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {accounts.map(acc => (
            <div
              key={acc.email}
              className="account-item"
              onClick={() => onSelectAccount(acc)}
            >
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#4285F4', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>
                {acc.avatar}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{acc.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{acc.email}</div>
              </div>
              <ChevronRight size={16} color="var(--muted)" />
            </div>
          ))}

          {showCustom ? (
            <div style={{ marginTop: 8 }}>
              <input
                className="input"
                style={{ fontSize: 13, height: 42, background: '#f8f8f8' }}
                placeholder="Enter custom Google email"
                value={customEmail}
                onChange={e => setCustomEmail(e.target.value)}
                autoFocus
              />
              <button
                className="btn sm"
                style={{ marginTop: 8 }}
                onClick={() => {
                  if (customEmail) {
                    onSelectAccount({
                      name: customEmail.split('@')[0],
                      email: customEmail,
                      avatar: customEmail.substring(0, 2).toUpperCase(),
                    })
                  }
                }}
              >
                Sign in with this account
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowCustom(true)}
              style={{ padding: '12px 14px', fontSize: 13, fontWeight: 700, color: '#4285F4', textAlign: 'left', marginTop: 4 }}
            >
              + Use another account
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ============ Apple Account Selection Modal ============ */
export function AppleAccountModal({ onClose, onSelectAccount }) {
  return (
    <div className="drawer-backdrop" onClick={onClose} style={{ alignItems: 'center' }}>
      <div className="oauth-modal" onClick={e => e.stopPropagation()}>
        <div className="row between" style={{ marginBottom: 14 }}>
          <div className="row gap8">
            <AppleIcon size={22} />
            <span style={{ fontWeight: 800, fontSize: 16 }}>Apple ID</span>
          </div>
          <button onClick={onClose} aria-label="Close dialog"><X size={20} /></button>
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
          Sign in to Striply with your Apple ID.
        </p>
        <div className="account-item" onClick={() => onSelectAccount({ name: 'Apple User', email: 'user@privaterelay.appleid.com' })}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#111', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AppleIcon size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13.5 }}>Continue with Apple ID</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Share My Email</div>
          </div>
          <ChevronRight size={16} />
        </div>
      </div>
    </div>
  )
}

/* ============ 5. Customer Home Screen ============ */
export function HomeScreen({ go, user, toast }) {
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

        {/* Scan Hero Banner - BLACK BUTTON (Requirement 3.A) */}
        <button
          className="tile btn-scan-hero"
          onClick={() => go('scan')}
          style={{
            marginTop: 18,
            background: '#000000',
            color: '#ffffff',
            borderRadius: 24,
            padding: '20px',
            boxShadow: '0 14px 28px rgba(0, 0, 0, 0.38)'
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
            <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M8 12h8" />
          </svg>
          <span style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>Scan a medicine</div>
            <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>5-colour verification &amp; traceability</div>
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
        <div className="row between" style={{ marginTop: 22, marginBottom: 12 }}>
          <h3 style={{ fontSize: 17 }}>Currently taking</h3>
          <button className="small" style={{ fontWeight: 700, color: 'var(--orange)' }} onClick={() => go('medicines')}>See all</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="glass tile" onClick={() => go('medicines')}>
            <span className="ico-tile"><PillIcon size={22} /></span>
            <span style={{ flex: 1 }}>
              <div className="t1">Paracetamol 650</div>
              <div className="t2">1 tablet · 08:00 AM</div>
            </span>
            <Chip kind="green">Active</Chip>
          </button>
          <button className="glass tile" onClick={() => go('medicines')}>
            <span className="ico-tile"><PillIcon size={22} /></span>
            <span style={{ flex: 1 }}>
              <div className="t1">Metformin 500</div>
              <div className="t2">1 tablet · 08:00 PM</div>
            </span>
            <Chip kind="green">Active</Chip>
          </button>
        </div>

        {/* Recent scans */}
        <h3 style={{ fontSize: 17, marginTop: 24, marginBottom: 12 }}>Recent scans</h3>
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

/* ============ 6. Scanner Screen (Five-Colour Pattern) ============ */
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
      <div className="body" style={{ display: 'flex', flexDirection: 'column', padding: '0 20px 30px' }}>
        <div className="row between" style={{ marginTop: 6, height: 44 }}>
          <button style={glassBtn} onClick={back} aria-label="Back">
            <Back onClick={back} />
          </button>
          <span style={{ fontWeight: 700, fontSize: 16 }}>Scan Verification Pattern</span>
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

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26 }}>
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
              <div style={{ fontSize: 15, fontWeight: 700 }}>Reading 5-colour pattern…</div>
              <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>Authenticating medicine, batch &amp; manufacturer record</div>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 15, fontWeight: 600, maxWidth: 260, lineHeight: 1.4 }}>
                Position the 5-colour pattern inside the frame
              </p>
              <p style={{ fontSize: 12, opacity: 0.65, marginTop: 4 }}>
                Red · Blue · Green · Yellow · Purple
              </p>
            </div>
          )}
        </div>

        {/* Bottom controls */}
        <div className="row between" style={{ padding: '0 8px' }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <button
            style={{ ...glassBtn, borderRadius: 16, width: 48, height: 48 }}
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
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
              <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M8 12h8" />
            </svg>
          </button>

          <button
            style={{ ...glassBtn, borderRadius: 16, width: 48, height: 48 }}
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
              If the foil pattern is damaged or obscured, type the batch code printed on the blister.
            </p>
            <div className="field">
              <label>Batch Number</label>
              <div className="input">
                <input
                  placeholder="e.g. B204-P-12"
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

/* ============ 7. Scan Result – Five-Colour Encoding System (Requirement 6) ============ */
export function Result({ go, back, toast }) {
  const [saved, setSaved] = useState(false)

  // Five Colour System definitions matching Requirement 6
  const colorsData = [
    {
      colorName: 'Red',
      hex: '#E5322D',
      title: '🔴 Red Indicator',
      meaning: 'Medicine Name',
      value: 'Paracetamol 650',
      desc: 'Authenticates product formula & brand identity'
    },
    {
      colorName: 'Blue',
      hex: '#2563EB',
      title: '🔵 Blue Indicator',
      meaning: 'Medicine ID / Unique ID',
      value: 'MED-2024-KM01 (#1)',
      desc: 'Unique pharmaceutical registration identifier'
    },
    {
      colorName: 'Green',
      hex: '#16A34A',
      title: '🟢 Green Indicator',
      meaning: 'Manufacturing Date',
      value: '15 Oct 2024',
      desc: 'Production timestamp verified from central batch registry'
    },
    {
      colorName: 'Yellow',
      hex: '#EAB308',
      title: '🟡 Yellow Indicator',
      meaning: 'Expiry Date',
      value: '10 Dec 2027 · 340 Days Remaining',
      desc: 'Active shelf-life verification code'
    },
    {
      colorName: 'Purple',
      hex: '#9333EA',
      title: '🟣 Purple Indicator',
      meaning: 'Manufacturer Information / Identity',
      value: 'Cipla Ltd. (Certified Facility #MH-20B-184949)',
      desc: 'Identifies which verified pharmaceutical manufacturer produced this medicine'
    },
  ]

  return (
    <Screen>
      <div className="body" style={{ display: 'flex', flexDirection: 'column', paddingBottom: 26 }}>
        <div className="row gap12" style={{ height: 40, marginTop: 4 }}>
          <Back onClick={back} />
          <span style={{ fontWeight: 800, fontSize: 16 }}>Verification Result</span>
        </div>

        {/* Verification Status Banner */}
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <div style={{
            width: 76,
            height: 76,
            borderRadius: '50%',
            margin: '0 auto',
            background: 'radial-gradient(circle, #E9F7E7, #D6F0D3)',
            border: '2px solid #fff',
            boxShadow: '0 8px 24px rgba(70,170,90,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#3FB05A'
          }}>
            <Check size={42} strokeWidth={3.4} />
          </div>
          <h1 style={{ fontSize: 26, marginTop: 12 }}>Verified Authentic Record</h1>
          <p style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>Paracetamol 650</p>
          <div style={{ marginTop: 4 }}>
            <Chip kind="green">Active Record · Safe to Consume</Chip>
          </div>
        </div>

        {/* 5-Color Rainbow Strip Visual */}
        <div className="five-color-strip">
          <span style={{ background: '#E5322D' }} />
          <span style={{ background: '#2563EB' }} />
          <span style={{ background: '#16A34A' }} />
          <span style={{ background: '#EAB308' }} />
          <span style={{ background: '#9333EA' }} />
        </div>

        {/* Five-Colour Encoding Explanation Header */}
        <div style={{ marginTop: 6, marginBottom: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)' }}>Five-Colour Pattern Decoded</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Each colour represents verifiable batch information:</div>
        </div>

        {/* 5-Color Breakdown Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {colorsData.map(c => (
            <div key={c.colorName} className="five-color-card" style={{ borderLeft: `4px solid ${c.hex}` }}>
              <span className="color-dot-indicator" style={{ background: c.hex }} />
              <div style={{ flex: 1 }}>
                <div className="row between">
                  <span style={{ fontSize: 12, fontWeight: 700, color: c.hex }}>{c.title}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)' }}>{c.meaning}</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: 14, marginTop: 2, color: 'var(--ink)' }}>{c.value}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>{c.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            className="btn"
            onClick={() => {
              setSaved(true)
              toast('Saved Paracetamol 650 to My Medicines!')
              go('medicines')
            }}
          >
            {saved ? '✓ Saved to Medicines' : 'Save to My Medicines'} <ArrowRight size={19} />
          </button>
          <button className="btn light sm" onClick={() => go('scan')}>
            Scan Another Medicine
          </button>
        </div>

        <p className="small" style={{ textAlign: 'center', marginTop: 14, fontSize: 11, lineHeight: 1.4, opacity: 0.8 }}>
          Pattern verification authenticates that the physical strip matches registered laboratory batch records in the central medicine registry.
        </p>
      </div>
    </Screen>
  )
}

/* ============ 8. My Medicines Screen ============ */
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
            <button key={n} className="glass tile" onClick={() => go('result')}>
              <span className="ico-tile"><PillIcon size={22} /></span>
              <span style={{ flex: 1 }}>
                <div className="t1">{n}</div>
                <div className="t2">{d}</div>
                <div className="chipwrap">
                  <Chip kind={k}>{c}</Chip>
                </div>
              </span>
              <ChevronRight size={18} />
            </button>
          ))}
        </div>
      </div>
      <CustomerNav active="medicines" go={go} />
    </Screen>
  )
}

/* ============ 9. Inventory Screen (Pharmacy / Manufacturer) ============ */
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

        <label className="input search" style={{ marginTop: 16 }}>
          <Search size={19} />
          <input
            placeholder="Search all batches or medicines..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </label>

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

export function NewBatch({ go, back, form, setForm, addEntry, toast, verificationStatus }) {
  const [errors, setErrors] = useState({})
  const set = k => e => {
    setForm({ ...form, [k]: e.target.value })
    if (errors[k]) setErrors({ ...errors, [k]: null })
  }

  const validateAndSubmit = () => {
    if (verificationStatus !== 'Verified') {
      toast('Verification required: Complete pharmaceutical licence review before generating patterns.')
      go('verify-status')
      return
    }

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
    toast(`Registered batch ${form.batch} with 5-colour pattern!`)
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

          {/* 5-Colour Pattern Live Preview */}
          <div className="glass" style={{ marginTop: 10, padding: '12px 14px' }}>
            <div className="small" style={{ fontWeight: 700, marginBottom: 8, color: 'var(--ink)' }}>
              Assigned 5-Colour Verification Pattern Preview
            </div>
            <svg viewBox="0 0 200 45" width="100%" height="45">
              <rect width="100%" height="100%" rx="8" fill="#F4EDE8" />
              <PatternDots x={20} y={8} seed={14} rows={3} gap={10} r={3} />
              <PatternDots x={110} y={8} seed={19} rows={3} gap={10} r={3} />
            </svg>
          </div>
        </div>

        <button
          className="btn"
          style={{ marginTop: 18 }}
          onClick={validateAndSubmit}
        >
          Add entry &amp; generate pattern <ArrowRight size={19} />
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
    ['#E5322D', 'Red: Medicine Name'],
    ['#2563EB', 'Blue: Unique Medicine ID'],
    ['#16A34A', 'Green: Manufacturing Date'],
    ['#EAB308', 'Yellow: Expiry Date'],
    ['#9333EA', 'Purple: Manufacturer Identity'],
    ['#102A43', 'Anchor: Calibration Dot'],
  ]

  const exportSvg = () => {
    const widthVal = parseInt(w) || 180
    const heightVal = parseInt(r) || 70
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${widthVal * 4} ${heightVal * 4}" width="${widthVal}mm" height="${heightVal}mm">
  <rect width="100%" height="100%" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2"/>
  <text x="20" y="30" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#102A43">Striply Foil Artwork · ${form.mfr || 'Cipla Ltd.'}</text>
  <text x="20" y="48" font-family="Arial, sans-serif" font-size="11" fill="#64748B">Medicine: ${form.name} | Batch: ${form.batch} | Exp: ${form.exp}</text>
  <!-- 2x5 Pocket Matrix with 5-Colour Verification Pattern -->
  ${[0, 1].map(row => [0, 1, 2, 3, 4].map(col => `
    <g transform="translate(${25 + col * 135}, ${70 + row * 110})">
      <rect width="120" height="95" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
      <!-- Calibration Anchor -->
      <circle cx="20" cy="18" r="4" fill="#102A43"/>
      <!-- 5-Colour Lines -->
      <line x1="32" y1="18" x2="105" y2="18" stroke="#E5322D" stroke-width="3" stroke-linecap="round"/>
      <line x1="32" y1="30" x2="105" y2="30" stroke="#2563EB" stroke-width="3" stroke-linecap="round"/>
      <line x1="32" y1="42" x2="105" y2="42" stroke="#16A34A" stroke-width="3" stroke-linecap="round"/>
      <line x1="32" y1="54" x2="105" y2="54" stroke="#EAB308" stroke-width="3" stroke-linecap="round"/>
      <line x1="32" y1="66" x2="105" y2="66" stroke="#9333EA" stroke-width="3" stroke-linecap="round"/>
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
    toast('Foil artwork SVG exported successfully!')
  }

  return (
    <Screen>
      <div className="body pad-nav" style={{ paddingBottom: 30 }}>
        <Back onClick={back} />
        <h2 style={{ marginTop: 4, fontSize: 22 }}>Foil artwork preview</h2>
        <div className="small" style={{ marginTop: 2, fontSize: 13, color: 'var(--ink)' }}>
          Cipla Ltd. · 10 pockets (2x5) · Batch: {form.batch}
        </div>

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

        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="small" style={{ fontWeight: 800, color: 'var(--ink)', marginBottom: 2 }}>5-Colour Encoding Legend</div>
          {legend.map(([c, t]) => (
            <div key={t} className="row gap12" style={{ fontSize: 12.5 }}>
              <i style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
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

/* ============ 12. Organization / Manufacturer Overview & "Alert Your Changes" ============ */
export function Org({ go, toast, verificationStatus, onSignOut }) {
  const [alertModalOpen, setAlertModalOpen] = useState(false)
  const [changeType, setChangeType] = useState('Licence Update')
  const [changeDesc, setChangeDesc] = useState('')

  const handleBroadcastAlert = async () => {
    if (!changeDesc) {
      toast('Please describe the business or licence change')
      return
    }
    toast('Broadcasting changes to registry...')
    try {
      await fetch('/api/v1/manufacturer/alert-changes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: 'Cipla Ltd.',
          changeType,
          description: changeDesc
        })
      })
    } catch {
      // offline fallback
    }
    setAlertModalOpen(false)
    setChangeDesc('')
    toast('✓ Changes broadcasted to regulatory network!')
  }

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
                <Chip kind={verificationStatus === 'Verified' ? 'trust' : 'amber'}>
                  <span style={{ width: 6, height: 6, borderRadius: 9, background: verificationStatus === 'Verified' ? '#5BAA45' : 'var(--amber)' }} />
                  {verificationStatus === 'Verified' ? 'Verified Manufacturer' : 'Verification Under Review'}
                </Chip>
              </div>
            </div>
          </div>
        </div>

        {/* Unverified Warning Banner if pending */}
        {verificationStatus !== 'Verified' && (
          <div style={{ marginTop: 14, padding: '12px 14px', borderRadius: 16, background: '#FFFBEB', border: '1px solid #FDE68A', display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertTriangle size={20} color="var(--amber)" />
            <span style={{ fontSize: 12, color: '#92400E', flex: 1 }}>
              Official pattern generation is restricted until verification documents are approved.
            </span>
            <button
              onClick={() => go('verify-status')}
              style={{ fontSize: 11.5, fontWeight: 800, color: '#B45309', textDecoration: 'underline' }}
            >
              View Status
            </button>
          </div>
        )}

        <h3 style={{ marginTop: 20, fontSize: 14 }}>Activity overview</h3>
        <div className="row gap12" style={{ marginTop: 10 }}>
          <Stat n="4" t="Registered batches" />
          <Stat n="4" t="Active patterns" />
        </div>
        <div className="row gap12" style={{ marginTop: 10 }}>
          <Stat n="1" t="Near expiry" />
          <Stat n="1" t="Recalled" />
        </div>

        {/* "Alert Your Changes" feature (Requirement 5) */}
        <div style={{ marginTop: 20 }}>
          <button
            className="btn black"
            style={{ height: 50, borderRadius: 18 }}
            onClick={() => setAlertModalOpen(true)}
          >
            <Bell size={18} /> Alert Your Changes
          </button>
        </div>

        <h3 style={{ marginTop: 20, fontSize: 14 }}>Quick actions</h3>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Item icon={<Boxes size={20} />} t="Register new batch" onClick={() => go('batch')} />
          <Item icon={<Package size={20} />} t="Browse batch records" onClick={() => go('inventory')} />
          <Item icon={<FileCheck size={20} />} t="Business Verification Status" onClick={() => go('verify-status')} />
          <Item icon={<AlertTriangle size={20} />} t="Inventory & recalls" onClick={() => go('alerts')} />
        </div>

        <button
          className="btn light"
          style={{ marginTop: 22, height: 48 }}
          onClick={onSignOut}
        >
          Sign out
        </button>
      </div>
      <PharmaNav active="org" go={go} />

      {/* "Alert Your Changes" Modal */}
      {alertModalOpen && (
        <div className="drawer-backdrop" onClick={() => setAlertModalOpen(false)}>
          <div className="drawer-content" onClick={e => e.stopPropagation()}>
            <div className="row between" style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 800, fontSize: 17 }}>Alert Your Changes</div>
              <button onClick={() => setAlertModalOpen(false)} aria-label="Close dialog"><X size={20} /></button>
            </div>
            <p className="sub" style={{ fontSize: 13, marginBottom: 16 }}>
              Broadcast regulatory or manufacturing changes to the healthcare registry and pharmacy network.
            </p>

            <div className="field">
              <label>Change Category</label>
              <div className="input">
                <select value={changeType} onChange={e => setChangeType(e.target.value)}>
                  <option>Licence Update</option>
                  <option>Address Change</option>
                  <option>Facility Inspection</option>
                  <option>Batch Recall Broadcast</option>
                  <option>General Operational Update</option>
                </select>
                <ChevronDown size={16} />
              </div>
            </div>

            <div className="field">
              <label>Description of Changes *</label>
              <div className="input" style={{ height: 80, alignItems: 'flex-start', padding: 10 }}>
                <textarea
                  style={{ width: '100%', height: '100%', resize: 'none' }}
                  placeholder="Detail the update, batch IDs, or certificate reference numbers..."
                  value={changeDesc}
                  onChange={e => setChangeDesc(e.target.value)}
                />
              </div>
            </div>

            <div className="row gap12" style={{ marginTop: 18 }}>
              <button className="btn light sm" style={{ flex: 1 }} onClick={() => setAlertModalOpen(false)}>Cancel</button>
              <button className="btn sm" style={{ flex: 1 }} onClick={handleBroadcastAlert}>Broadcast Alert</button>
            </div>
          </div>
        </div>
      )}
    </Screen>
  )
}

/* ============ 13. Manufacturer Verification Process – Step 2 & 3 (Requirement 4.B) ============ */
export function BusinessVerify({ go, back, toast, onVerificationSubmitted, userEmail }) {
  const [bName, setBName] = useState('Cipla Ltd.')
  const [regEmail, setRegEmail] = useState(userEmail || 'cipla.pharma@gmail.com')
  const [contact, setContact] = useState('+91 22 2482 6000')
  const [address, setAddress] = useState('Cipla House, Peninsula Business Park, Lower Parel')
  const [location, setLocation] = useState('Mumbai, Maharashtra')
  const [details, setDetails] = useState('Pharmaceutical Formulation & Blister Packaging Unit')
  const [licence, setLicence] = useState('20-B/MH-WZ4-184949')
  const [docName, setDocName] = useState('Drug_Licence_2026.pdf')
  const [docUploaded, setDocUploaded] = useState(true)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        toast('Please upload a valid PDF document')
        return
      }
      setDocName(file.name)
      setDocUploaded(true)
      toast(`Uploaded ${file.name} successfully`)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!bName || !licence) {
      toast('Please enter business name and licence number')
      return
    }
    if (!docUploaded) {
      toast('Please upload your pharmaceutical licence PDF')
      return
    }

    onVerificationSubmitted({
      businessName: bName,
      email: regEmail,
      contactNumber: contact,
      businessAddress: address,
      location,
      details,
      licenceNumber: licence,
      documentName: docName,
      documentSize: '1.4 MB'
    })

    toast('Verification request submitted successfully!')
    go('verify-status')
  }

  return (
    <Screen>
      <div className="body" style={{ paddingBottom: 30 }}>
        <Back onClick={back} />
        <h2 style={{ marginTop: 4, fontSize: 22 }}>Business Verification</h2>
        <p className="sub" style={{ marginTop: 4, fontSize: 13 }}>
          Step 2 &amp; 3: Submit pharmaceutical licence and facility details for verification.
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
          <div className="field">
            <label>Business / Manufacturer Name *</label>
            <div className="input"><input value={bName} onChange={e => setBName(e.target.value)} /></div>
          </div>

          <div className="field">
            <label>Registered Official Email *</label>
            <div className="input"><input value={regEmail} onChange={e => setRegEmail(e.target.value)} /></div>
          </div>

          <div className="field">
            <label>Contact Number *</label>
            <div className="input"><input value={contact} onChange={e => setContact(e.target.value)} /></div>
          </div>

          <div className="field">
            <label>Business Address *</label>
            <div className="input"><input value={address} onChange={e => setAddress(e.target.value)} /></div>
          </div>

          <div className="field">
            <label>Location (City, State) *</label>
            <div className="input"><input value={location} onChange={e => setLocation(e.target.value)} /></div>
          </div>

          <div className="field">
            <label>Manufacturer / Pharmacy Details</label>
            <div className="input"><input value={details} onChange={e => setDetails(e.target.value)} /></div>
          </div>

          <div className="field">
            <label>Relevant Drug Licence Information *</label>
            <div className="input"><input value={licence} onChange={e => setLicence(e.target.value)} placeholder="e.g. 20-B/MH-WZ4-184949" /></div>
          </div>

          {/* Document Verification PDF Upload (Requirement 4.B Step 3) */}
          <div className="field" style={{ marginTop: 18 }}>
            <label>Pharmaceutical Licence (PDF Document) *</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
              style={{ display: 'none' }}
            />
            <div
              className="glass"
              style={{ padding: '16px', borderRadius: 16, border: '2px dashed rgba(255,122,13,0.4)', textAlign: 'center', cursor: 'pointer' }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={28} color="var(--orange)" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontWeight: 700, fontSize: 14 }}>Upload Pharmaceutical Licence PDF</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>Only PDF format supported (Max 15MB)</div>

              {docUploaded && (
                <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 12, background: 'var(--green-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <FileText size={18} color="var(--green)" />
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--green)' }}>{docName}</span>
                  <CheckCircle2 size={16} color="var(--green)" />
                </div>
              )}
            </div>
          </div>

          <button className="btn" type="submit" style={{ marginTop: 20 }}>
            Submit for Verification <ArrowRight size={19} />
          </button>
        </form>
      </div>
    </Screen>
  )
}

/* ============ 14. Verification Status Screen – Step 4 (Requirement 4.B Step 4) ============ */
export function VerifyStatus({ go, back, status = 'Under Review', onToggleDemoStatus, toast }) {
  const steps = [
    { title: 'Account Created', desc: 'Authentication confirmed', done: true },
    { title: 'Business Details Submitted', desc: 'Facility & licence recorded', done: true },
    { title: 'Pharmaceutical Document Review', desc: status === 'Verified' ? 'Approved by regulatory board' : 'In review with compliance desk', done: status === 'Verified' },
    { title: 'Pattern Issuance Authorization', desc: status === 'Verified' ? 'Full access granted' : 'Pending final approval', done: status === 'Verified' },
  ]

  return (
    <Screen>
      <div className="body pad-nav">
        <Back onClick={back} />
        <h2 style={{ marginTop: 4, fontSize: 22 }}>Verification Status</h2>
        <div style={{ marginTop: 14, textAlign: 'center' }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            margin: '0 auto',
            background: status === 'Verified' ? 'radial-gradient(circle, #E9F7E7, #D6F0D3)' : 'radial-gradient(circle, #FEF3C7, #FDE68A)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: status === 'Verified' ? 'var(--green)' : '#B45309'
          }}>
            {status === 'Verified' ? <CheckCircle2 size={40} /> : <Hourglass size={36} />}
          </div>
          <h2 style={{ marginTop: 12 }}>{status === 'Verified' ? 'Account Verified' : 'Under Review'}</h2>
          <div style={{ marginTop: 4 }}>
            <Chip kind={status === 'Verified' ? 'green' : 'amber'}>
              {status}
            </Chip>
          </div>
        </div>

        {/* Timeline */}
        <div className="glass" style={{ marginTop: 22, padding: '18px 16px' }}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 14 }}>Verification Timeline</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {steps.map((s, idx) => (
              <div key={idx} className="row gap12" style={{ alignItems: 'flex-start' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: s.done ? 'var(--green)' : 'rgba(0,0,0,0.1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, marginTop: 2 }}>
                  {s.done ? '✓' : idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>{s.title}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Fast-Track Approval Toggle for Evaluators */}
        <div style={{ marginTop: 18, padding: '14px', borderRadius: 16, background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#1E40AF', marginBottom: 4 }}>Demo Review Evaluator Controls</div>
          <div style={{ fontSize: 11.5, color: '#3B82F6', marginBottom: 10 }}>Toggle between status states to test dashboard gating:</div>
          <div className="row gap8">
            <button
              className="btn sm"
              style={{ flex: 1, height: 38, fontSize: 12, background: status === 'Verified' ? '#059669' : '#102A43' }}
              onClick={() => {
                onToggleDemoStatus('Verified')
                toast('Account approved and verified!')
              }}
            >
              Approve (Verified)
            </button>
            <button
              className="btn sm light"
              style={{ flex: 1, height: 38, fontSize: 12 }}
              onClick={() => {
                onToggleDemoStatus('Under Review')
                toast('Account set to Under Review')
              }}
            >
              Set Under Review
            </button>
          </div>
        </div>

        <button
          className="btn"
          style={{ marginTop: 20 }}
          onClick={() => go('org')}
        >
          {status === 'Verified' ? 'Go to Manufacturer Dashboard' : 'View Limited Dashboard'} <ArrowRight size={19} />
        </button>
      </div>
      <PharmaNav active="org" go={go} />
    </Screen>
  )
}

/* ============ 15. Functional Profile Sections (Requirement 3.B) ============ */

/* A. Edit Profile Screen */
export function EditProfile({ back, user, onSave, toast }) {
  const [name, setName] = useState(user)
  const [email, setEmail] = useState('priya.sharma@gmail.com')
  const [phone, setPhone] = useState('+91 98201 12345')

  const handleSave = (e) => {
    e.preventDefault()
    onSave(name)
    toast('Profile details updated successfully!')
    back()
  }

  return (
    <Screen>
      <div className="body" style={{ paddingBottom: 30 }}>
        <Back onClick={back} />
        <h2 style={{ marginTop: 4, fontSize: 22 }}>Edit Profile</h2>
        <div style={{ textAlign: 'center', margin: '18px 0' }}>
          <div className="avatar" style={{ margin: '0 auto' }}>{name.substring(0, 2).toUpperCase()}</div>
          <button style={{ marginTop: 8, fontSize: 12.5, fontWeight: 700, color: 'var(--orange)' }} onClick={() => toast('Avatar selector opened')}>
            Change Photo
          </button>
        </div>
        <form onSubmit={handleSave}>
          <div className="field">
            <label>Full Name</label>
            <div className="input"><input value={name} onChange={e => setName(e.target.value)} /></div>
          </div>
          <div className="field">
            <label>Email Address</label>
            <div className="input"><input value={email} onChange={e => setEmail(e.target.value)} /></div>
          </div>
          <div className="field">
            <label>Phone Number</label>
            <div className="input"><input value={phone} onChange={e => setPhone(e.target.value)} /></div>
          </div>
          <button className="btn" type="submit" style={{ marginTop: 22 }}>
            Save Changes <Check size={18} />
          </button>
        </form>
      </div>
    </Screen>
  )
}

/* B. Preferences Screen */
export function Preferences({ go, back, toast }) {
  const [p, setP] = useState({ push: true, expiry: true, offline: false, sound: true })

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

  return (
    <Screen>
      <div className="body" style={{ paddingBottom: 30 }}>
        <Back onClick={back} />
        <h2 style={{ marginTop: 4, fontSize: 22 }}>Preferences</h2>
        <div className="glass" style={{ marginTop: 20, padding: '4px 16px' }}>
          <T icon={<Bell size={20} />} t="Push notifications" k="push" />
          <T icon={<AlertTriangle size={20} />} t="Expiry alerts" k="expiry" />
          <T icon={<Wifi size={20} />} t="Offline verification cache" k="offline" />
          <T icon={<Volume2Icon />} t="Dose reminder audio chime" k="sound" />
        </div>

        <div className="row between" style={{ marginTop: 22, padding: '0 4px', fontSize: 13 }}>
          <span>Last cloud synchronization</span>
          <span className="small" style={{ fontSize: 12 }}>Just now</span>
        </div>
      </div>
    </Screen>
  )
}
const Volume2Icon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>

/* C. Help & Support Screen */
export function HelpSupport({ back, toast }) {
  const faqs = [
    { q: 'How does medicine verification work?', a: 'Striply scans the 5-colour pattern printed on the blister foil, verifying the medicine name, batch, manufacturing date, expiry date, and manufacturer against central pharmaceutical records.' },
    { q: 'What do the 5 colours mean?', a: '🔴 Red: Medicine Name | 🔵 Blue: Medicine ID | 🟢 Green: Mfg Date | 🟡 Yellow: Expiry Date | 🟣 Purple: Manufacturer Identity.' },
    { q: 'What if a medicine shows Expired?', a: 'Do not consume expired medicines. Striply alerts you immediately and provides guidance on safe disposal.' },
  ]

  return (
    <Screen>
      <div className="body" style={{ paddingBottom: 30 }}>
        <Back onClick={back} />
        <h2 style={{ marginTop: 4, fontSize: 22 }}>Help &amp; Support</h2>
        <p className="sub" style={{ marginTop: 4, fontSize: 13 }}>FAQs, assistance, and support contacts.</p>

        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {faqs.map((f, i) => (
            <div key={i} className="glass" style={{ padding: '14px 16px' }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--ink)' }}>{f.q}</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4, lineHeight: 1.35 }}>{f.a}</div>
            </div>
          ))}
        </div>

        <div className="glass" style={{ marginTop: 20, padding: '16px' }}>
          <div style={{ fontWeight: 800, fontSize: 14 }}>Contact Striply Support</div>
          <div className="row gap8" style={{ marginTop: 10 }}>
            <Mail size={16} color="var(--orange)" />
            <span style={{ fontSize: 13, fontWeight: 600 }}>support@striply.com</span>
          </div>
          <div className="row gap8" style={{ marginTop: 8 }}>
            <Phone size={16} color="var(--orange)" />
            <span style={{ fontSize: 13, fontWeight: 600 }}>1800-STRIPLY (Toll-Free)</span>
          </div>
        </div>
      </div>
    </Screen>
  )
}

/* D. Terms & Privacy Screen */
export function TermsPrivacy({ back }) {
  return (
    <Screen>
      <div className="body" style={{ paddingBottom: 30 }}>
        <Back onClick={back} />
        <h2 style={{ marginTop: 4, fontSize: 22 }}>Terms &amp; Privacy</h2>
        <div className="glass" style={{ marginTop: 16, padding: '16px', lineHeight: 1.45, fontSize: 12.5, color: 'var(--ink)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 13.5, marginBottom: 2 }}>1. Medical Disclaimer</div>
            <p style={{ color: 'var(--muted)' }}>Striply pattern verification verifies that the printed packaging matches official manufacturer records. It does not replace medical advice, prescriptions, or physician guidance.</p>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 13.5, marginBottom: 2 }}>2. Privacy &amp; Data Security</div>
            <p style={{ color: 'var(--muted)' }}>User medication cabinets and scan records are encrypted end-to-end. We do not sell personal health telemetry or patient identity data to third-party advertisers.</p>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 13.5, marginBottom: 2 }}>3. Pharmaceutical Governance</div>
            <p style={{ color: 'var(--muted)' }}>Manufacturers and pharmacies must hold valid regulatory operating licences before generating verification patterns for commercial batches.</p>
          </div>
        </div>
      </div>
    </Screen>
  )
}

/* ============ 16. Profile Screen (Hub to Sub-screens) ============ */
export function Profile({ go, role, user, onSignOut }) {
  const initials = user.split(' ').map(s => s[0]).join('').substring(0, 2).toUpperCase()
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
        <h2 style={{ marginTop: 10, fontSize: 22 }}>My Profile</h2>

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
          <Row icon={<User size={20} />} t="Edit Profile" onClick={() => go('edit-profile')} />
          <Row icon={<Settings size={20} />} t="Preferences" onClick={() => go('prefs')} />
          <Row icon={<HelpCircle size={20} />} t="Help & Support" onClick={() => go('help-support')} />
          <Row icon={<FileText size={20} />} t="Terms & Privacy" onClick={() => go('terms-privacy')} />
        </div>

        <button
          className="btn light"
          style={{ marginTop: 22, height: 50 }}
          onClick={onSignOut}
        >
          Sign out
        </button>
      </div>
      {role === 'pharmacy' ? <PharmaNav active="" go={go} /> : <CustomerNav active="profile" go={go} />}
    </Screen>
  )
}

/* ============ 17. Alerts Screen ============ */
export function Alerts({ go, role, toast }) {
  const [tab, setTab] = useState('All')
  const data = [
    { c: 'risk', icon: <Hourglass size={24} color="#FF7A0D" />, t: 'Near Expiry', n: 'Amoxycillin 250 (Batch B191)', d: 'Expires in 18 days', dc: 'var(--amber)' },
    { c: 'risk', icon: <XCircle size={26} color="#E0382F" />, t: 'Expired Medicine', n: 'Pantocid 40 (Batch B170)', d: 'Expired 14 days ago', dc: 'var(--red)' },
    { c: 'risk', icon: <AlertTriangle size={24} color="#E0382F" />, t: 'Batch Recall Notice', n: 'Ubent-D 100/500 (Batch UB-4491)', d: 'Manufacturer recall issued', dc: 'var(--red)' },
    { c: 'note', icon: <Bell size={22} color="#FF7A0D" />, t: 'Dose Reminder', n: 'Paracetamol 650', d: 'Take 1 tablet at 08:00 PM', dc: 'var(--muted)' },
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
