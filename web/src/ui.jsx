import React from 'react'
import {
  Signal, Wifi, BatteryFull, Home, Pill, Bell, User, Package, Boxes, FileText,
  ScanLine, Check, ChevronLeft
} from 'lucide-react'

/* ---------------- Logo (orange pill in scan frame) ---------------- */
export function Logo({ height = 110, frame = true }) {
  const w = (height * 455) / 570
  return (
    <svg width={w} height={height} viewBox="540 215 455 570" fill="none" aria-label="Striply">
      <path d="M615 400a151 151 0 0 1 302 0v205a151 151 0 0 1-302 0Z" fill="#FF7F0A" />
      <circle cx="706" cy="438" r="38" fill="#fff" />
      <circle cx="826" cy="438" r="38" fill="#fff" />
      <circle cx="706" cy="438" r="27" fill="#2A1A10" />
      <circle cx="826" cy="438" r="27" fill="#2A1A10" />
      <circle cx="716" cy="426" r="7" fill="#fff" />
      <circle cx="816" cy="426" r="7" fill="#fff" />
      <path d="M744 483q23 24 47 0" stroke="#2A1A10" strokeWidth="8" strokeLinecap="round" />
      {frame && (
        <g stroke="#FF7A1A" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round">
          <path d="M663 239h-52a40 40 0 0 0-40 40v38" />
          <path d="M871 239h52a40 40 0 0 1 40 40v38" />
          <path d="M663 759h-52a40 40 0 0 1-40-40v-38" />
          <path d="M871 759h52a40 40 0 0 0 40-40v-38" />
        </g>
      )}
    </svg>
  )
}

/* ---------------- Shell pieces ---------------- */
export function StatusBar({ dark }) {
  return (
    <div className="statusbar" style={{ color: dark ? '#fff' : 'var(--ink)' }}>
      <span>9:41</span>
      <span className="icons">
        <Signal size={15} strokeWidth={2.6} />
        <Wifi size={15} strokeWidth={2.6} />
        <BatteryFull size={19} strokeWidth={2.2} />
      </span>
    </div>
  )
}

export function Screen({ dark, children }) {
  return (
    <div className={'screen' + (dark ? ' dark' : '')}>
      <StatusBar dark={dark} />
      {children}
    </div>
  )
}

export const Back = ({ onClick }) => (
  <button className="back" onClick={onClick} aria-label="Back"><ChevronLeft size={24} strokeWidth={2.4} /></button>
)

/* 2-Step Progress Indicator (Requirement 2.C: Role Selection -> Create Account) */
export const Steps = ({ at = 0 }) => (
  <div className="steps-two" aria-label={`Step ${at + 1} of 2`}>
    {[0, 1].map(i => <i key={i} className={i === at ? 'on' : ''} />)}
  </div>
)

/* Pill icon */
export const PillIcon = ({ size = 22, color = 'currentColor', fill }) => (
  <Pill size={size} color={color} strokeWidth={2} fill={fill || 'none'} />
)

export function Chip({ kind = 'green', children, icon }) {
  return <span className={'chip ' + kind}>{icon}{children}</span>
}

export function Toggle({ on, onChange }) {
  return <button className={'toggle' + (on ? ' on' : '')} onClick={() => onChange(!on)} aria-pressed={on} />
}

export function Check_({ on, onChange }) {
  return (
    <button className={'check' + (on ? ' on' : '')} onClick={() => onChange(!on)} aria-pressed={on}>
      {on && <Check size={15} strokeWidth={3.4} />}
    </button>
  )
}

/* ---------------- Bottom navs ---------------- */
export function CustomerNav({ active, go, labels = true }) {
  const items = [
    ['home', Home, 'Home'],
    ['medicines', Pill, 'Medicines'],
    ['scan', null, 'Scan'],
    ['alerts', Bell, 'Alerts'],
    ['profile', User, 'Profile'],
  ]
  return (
    <div className={'nav' + (labels ? ' lab' : '')}>
      {items.map(([k, Icon, text]) =>
        k === 'scan' ? (
          <button key={k} className="center" onClick={() => go('scan')} aria-label="Scan Medicine">
            <ScanLine size={24} strokeWidth={2.4} />
          </button>
        ) : (
          <button key={k} className={'item' + (active === k ? ' on' : '') + (labels ? '' : ' dotted')} onClick={() => go(k, true)}>
            <Icon size={22} strokeWidth={2} fill={active === k && labels ? 'currentColor' : 'none'} />
            {labels && <span>{text}</span>}
          </button>
        )
      )}
    </div>
  )
}

export function PharmaNav({ active, go }) {
  const items = [
    ['org', Home, 'Home'],
    ['inventory', Package, 'Inventory'],
    ['batch', Boxes, 'Batches'],
    ['alerts', FileText, 'Alerts'],
  ]
  return (
    <div className="nav lab">
      {items.map(([k, Icon, text]) => (
        <button key={k} className={'item' + (active === k ? ' on' : '')} onClick={() => go(k, true)}>
          <Icon size={22} strokeWidth={2} fill={active === k && k !== 'batch' && k !== 'alerts' ? 'currentColor' : 'none'} />
          <span>{text}</span>
        </button>
      ))}
    </div>
  )
}

/* ---------------- Five-Colour Medicine Pattern System (Requirement 6) ---------------- */
/* 
  🔴 Red    -> Medicine Name
  🔵 Blue   -> Medicine ID / Unique Medicine Identification
  🟢 Green  -> Manufacturing Date
  🟡 Yellow -> Expiry Date
  🟣 Purple -> Manufacturer Information / Identity
*/
const FIVE_COLS = ['#E5322D', '#2563EB', '#16A34A', '#EAB308', '#9333EA']
const FIVE_SHADES = {
  '#E5322D': ['#E5322D', '#F87171'],
  '#2563EB': ['#2563EB', '#60A5FA'],
  '#16A34A': ['#16A34A', '#4ADE80'],
  '#EAB308': ['#EAB308', '#FDE047'],
  '#9333EA': ['#9333EA', '#C084FC'],
}

function rnd(seed) { let s = seed; return () => (s = (s * 9301 + 49297) % 233280) / 233280 }

export function PatternDots({ x = 0, y = 0, seed = 1, rows = 6, gap = 10, r = 3, withAnchor = true }) {
  const R = rnd(seed)
  const els = []
  FIVE_COLS.forEach((c, ci) => {
    for (let ri = 0; ri < rows; ri++) {
      const shade = FIVE_SHADES[c][R() > 0.5 ? 1 : 0]
      els.push(<circle key={ci + '-' + ri} cx={x + ci * gap} cy={y + ri * gap} r={r} fill={shade} />)
    }
  })
  if (withAnchor) {
    for (let i = 0; i < 5; i++) {
      els.push(<circle key={'a' + i} cx={x + i * gap} cy={y + rows * gap + 4} r={r} fill="#102A43" />)
    }
  }
  return <g>{els}</g>
}

export function FoilThumb({ seeds = [3, 7, 11, 5] }) {
  return (
    <svg viewBox="0 0 280 95" width="100%" style={{ display: 'block' }}>
      {seeds.map((s, i) => (
        <PatternDots key={i} x={18 + i * 68} y={8} seed={s} rows={6} gap={9} r={3} />
      ))}
    </svg>
  )
}

/* Realistic Blister strip with 5-color verification pattern */
export function Blister() {
  return (
    <svg viewBox="0 0 240 150" width="248" style={{ transform: 'rotate(-4deg)', filter: 'drop-shadow(0 10px 16px rgba(0,0,0,.45))' }}>
      <defs>
        <linearGradient id="foil" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#dcdde2" />
          <stop offset=".5" stopColor="#adb0b8" />
          <stop offset="1" stopColor="#c8cad0" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="232" height="142" rx="14" fill="url(#foil)" />
      <rect x="4" y="4" width="232" height="142" rx="14" fill="none" stroke="rgba(255,255,255,.6)" />
      {[0, 1, 2].map(i => (
        <g key={i}>
          <rect x={14 + i * 74} y="14" width="62" height="122" rx="14" fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.4)" />
          <PatternDots x={22 + i * 74} y={24} seed={i * 5 + 3} rows={6} gap={9} r={3} />
        </g>
      ))}
    </svg>
  )
}
