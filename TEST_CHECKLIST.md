# Striply — Verification Test Checklist (TEST_CHECKLIST.md)

> **Concrete Verification Tasks:** Actual commands, expected outputs, and UI interactions required to mark changes as done.

---

## 1. Automated Build & Type Verification

| Test Step | Command | Expected Output | Status |
|---|---|---|---|
| Frontend TypeScript & Next.js Build | `cmd /c "npm --prefix web run build"` | Route tree rendered, zero type errors, exit code 0 | **VERIFIED (Exit code 0)** |
| Backend TypeScript Build | `cmd /c "npm --prefix backend run build"` | Output compiled to `dist/`, zero errors | **VERIFIED (Exit code 0)** |
| Remote Git Sync | `git push origin main` | Pushed cleanly to `Striply-MediScan.git` | **VERIFIED** |

---

## 2. User Experience & Navigation Flow Checklist

- [x] **Animated Splash Screen:**
  - Displays Striply wordmark and brand logo.
  - Shows smooth fade-in and scale-up animation.
  - Animated blue RP Lines recognition optical sweep.
  - Tagline: *"Smarter Medicine. Safer Tracking."*
  - Automatically transitions smoothly to Login / Sign Up screen (or instant Skip via button).
- [x] **Authentication Screen (First Interaction):**
  - Appears after splash screen (strictly follows sequence: Splash -> Login -> Role Selection).
  - Has Login and Sign Up switcher tabs.
  - Form validation for email and password.
  - Show/hide password toggle works with `Eye` / `EyeOff` icons.
  - "Forgot password" modal opens and accepts reset request.
  - Quick Demo fast-track buttons for Customer and Pharmacy.
- [x] **Role Selection Screen (Post-Auth):**
  - Displays *"Who are you signing in as?"*
  - Option A: "I'm a Customer" with descriptive bullet points (Scan RP Lines, Track medicines, Receive expiry alerts).
  - Option B: "I'm a Pharmacy / Manufacturer" with verification notice.
- [x] **Customer Mobile Experience (Light Glassmorphic UI):**
  - 5-tab bottom navigation (Home, My Medicines, Scan, Alerts, Profile) with elevated central Scan button.
  - Customer Home: greeting *"Good morning Priya Sharma"*, Scan banner, Currently taking cards, Recent scans with status pills (Verified green, Near Expiry amber, Expired red).
  - My Medicines: 4 tabs (Currently Taking, Upcoming, Completed, Discontinued).
  - Live Camera Viewfinder: optical alignment frame, glare indicator, flashlight toggle, gallery photo upload, shutter trigger.
  - Scan Result states: Verified, Near Expiry, Expired, and Unverified. All states feature "Scan Another" and "Save to My Medicines".
  - Profile screen: notification toggles, WhatsApp alerts, terms, and sign out.
- [x] **Pharmacy / Manufacturer Experience:**
  - Overview screen: *"Welcome back Cipla Ltd. (Verified Manufacturer)"*, 4 metric cards, Quick actions, "Needs attention this week" alert.
  - Inventory screen: search bar, category filters (All, Active, Near Expiry, Critical, Expired), batch summary cards.
  - Add Stock / New Batch Registration: validated form, editable Excel-style table (Add, Edit, Delete entries), live pattern preview, "Generate Patterns" button.
  - Foil Artwork Preview: repeat configuration (160mm width, 240mm repeat), zoom controls (Fit, 100%, 150%, 200%), legend of 4 encoded colors, calibration anchor.
- [x] **New Printing Feature Workflow:**
  - "Print Artwork" button present on Foil Artwork Preview.
  - Step 4 Print Settings Modal: foil width (160mm default), repeat length (240mm default), print scale, orientation, copies/repeats, layout preview, anchor and boundaries toggles.
  - Step 5 Print Preview Modal: exact physical dimensions in mm, margins, eye-marks, registration lines, regulatory batch header, pharmaceutical disclaimer.
  - Export actions functional: Browser print (`@media print`), PDF download, SVG export.
