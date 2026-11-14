# Striply — Living Session Continuity & Handover (HANDOVER.md)

> **Purpose:** Living record of project status read at the start of every session. Maintains memory across context windows, preventing session amnesia.

---

## 1. Project Snapshot

* **Project Name:** Striply *(Every Strip. Every Dose. Less Waste.)*
* **Active Remote Repository:** `https://github.com/hargun1212k/Striply-MediScan.git` (branch: `main`)
* **Core Product:** Dual-persona platform for Consumers (pill verification, adherence, dose planner) and Pharmacies / Manufacturers (batch registration, 5-colour verification pattern issuance, FEFO inventory, expiry insights, batch recall alerts).
* **Recognition Tech:** Five-Colour Verification Pattern System:
  - 🔴 **Red**: Medicine Name
  - 🔵 **Blue**: Unique Medicine ID
  - 🟢 **Green**: Manufacturing Date
  - 🟡 **Yellow**: Expiry Date
  - 🟣 **Purple**: Manufacturer Information & Facility Identity
  - Anchor: Calibration Dot
* **Frontend Architecture:** Modern, mobile-first Vite 5 + React 18 Single-Page Application (SPA) displayed cleanly in preview without artificial phone hardware bezels (`.app-canvas`).
* **Visual Identity & Theme:**
  - Modern Frosted Glassmorphism (`backdrop-filter: blur(18px)`)
  - Primary Orange Accent: `#FF7A0D` / `#FF9A3C`
  - Solid Black Scan Action: `#000000`
  - Warm Off-White Canvas: `#F7E9E2`
  - Typography: Plus Jakarta Sans Variable (`@fontsource-variable/plus-jakarta-sans`)

---

## 2. Status Board

### What's Done
- [x] Initialized Git repository and connected remote `https://github.com/hargun1212k/Striply-MediScan.git`.
- [x] Implemented App Improvements, Bug Fixes & Feature Requirements:
  - **Removed Artificial Phone Frame**: Removed fixed 390x860, 44px border radius, 10px+12px black hardware borders, and fake dynamic island. Replaced with clean, responsive `.app-canvas` preview container.
  - **Initial Opening Flow**: App opens strictly to "Welcome to Striply" with mascot logo, terms agreement, and continue action.
  - **Role Selection (Second Screen)**: "Who are you signing in as?" with Customer and Pharmacy / Manufacturer options.
  - **Account Creation (Third Screen)**: Two progress steps only (Role Selection -> Create Account), updating dynamically.
  - **Google & Apple OAuth**: Authentic Google account selector modal with selectable accounts (`priya.sharma@gmail.com`, `cipla.pharma@gmail.com`, or custom input), eliminating blank screen errors for manufacturers.
  - **Email Autocomplete Suggestions**: Dynamic dropdown displaying common email domains (`@gmail.com`, `@outlook.com`, `@yahoo.com`, `@icloud.com`, `@pharma.com`).
  - **Separated Sign Up & Login**: Dedicated screens with clean cross-navigation.
  - **Sign-Out Navigation**: Clears session, displays animated loading spinner ("Signing out securely..."), and redirects directly to "Who are you signing in as?" (`role`).
  - **Customer Black Scan Button**: Main scan hero button changed to pure black (`#000000`).
  - **Functional Customer Profile**: Fully wired sub-screens for Edit Profile, Preferences, Help & Support, and Terms & Privacy.
  - **Pharmacy / Manufacturer Onboarding & Verification**: Business details form, pharmaceutical licence PDF upload with status indicators, and verification status tracking (Pending, Under Review, Verified).
  - **Manufacturer "Alert Your Changes" Feature**: Broadcast action & modal to announce licence updates, facility changes, or batch recalls.
  - **Five-Colour Medicine Verification System**: Decoded verification result prominently displays and explains all 5 colours (Red: Medicine Name, Blue: Medicine ID, Green: Mfg Date, Yellow: Expiry Date, Purple: Manufacturer Identity).
  - **Eradication of "RP Lines"**: 100% removed from user-facing screens, code comments, and HTML titles.
- [x] Verified `cmd /c "npm --prefix web run build"` succeeds with zero errors (`dist/index.html 327 kB`).
- [x] Verified `cmd /c "npm --prefix backend run build"` compiles cleanly with TypeScript (`tsc`).
- [x] Backend Express routes for `/api/v1/auth` and `/api/v1/manufacturer` added and verified.

---

## 3. Verification Commands

```bash
# Frontend production singlefile build
cmd /c "npm --prefix web run build"

# Backend TypeScript build
cmd /c "npm --prefix backend run build"

# Run Frontend Dev Server
cmd /c "npm --prefix web run dev"

# Run Backend Dev Server
cmd /c "npm --prefix backend run dev"
```
