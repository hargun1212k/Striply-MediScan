# Striply — Verification Test Checklist (TEST_CHECKLIST.md)

> **Concrete Verification Tasks:** Actual commands, expected outputs, and UI interactions required to mark changes as done.

---

## 1. Automated Build & Type Verification

| Test Step | Command | Expected Output | Status |
|---|---|---|---|
| Frontend TypeScript & Next.js Build | `npm --prefix web run build` | Route tree rendered, zero type errors, exit code 0 | Pending verification |
| Backend TypeScript Build | `npm --prefix backend run build` | Output compiled to `dist/`, zero errors | Pending verification |
| Backend Health Probe | `curl http://localhost:5000/api/health` | `{"status":"ok","timestamp":"..."}` | Pending verification |

---

## 2. User Experience & Navigation Flow Checklist

- [ ] **Animated Splash Screen:**
  - Displays Striply wordmark and brand logo.
  - Shows smooth fade-in and scale-up animation.
  - Animated blue RP Lines recognition optical sweep.
  - Tagline: *"Smarter Medicine. Safer Tracking."*
  - Automatically transitions smoothly to Login / Sign Up screen.
- [ ] **Authentication Screen (First Interaction):**
  - Appears after splash screen (not role selection first!).
  - Has Login and Sign Up tabs.
  - Form validation for email and password.
  - Show/hide password toggle works.
  - "Forgot password" modal opens and accepts reset request.
  - Quick Demo fast-track buttons for Customer and Pharmacy.
- [ ] **Role Selection Screen (Post-Auth):**
  - Displays *"Who are you signing in as?"*
  - Option A: "I'm a Customer" with descriptive bullet points.
  - Option B: "I'm a Pharmacy / Manufacturer" with verification notice.
- [ ] **Customer Mobile Experience:**
  - 5-tab bottom navigation (Home, My Medicines, Scan, Alerts, Profile) with elevated central Scan button.
  - Customer Home: greeting *"Good morning Priya Sharma"*, Scan banner, Currently taking cards, Recent scans with status pills (Verified, Near Expiry, Expired).
  - My Medicines: 4 tabs (Currently Taking, Upcoming, Completed, Discontinued).
  - Live Camera Viewfinder: optical alignment frame, glare indicator, flashlight toggle, gallery photo upload, shutter trigger.
  - Scan Result states: Verified, Near Expiry, Expired, and Unverified. All states feature "Scan Another" and "Save to My Medicines".
  - Profile screen: notification toggles, WhatsApp alerts, terms, and sign out.
- [ ] **Pharmacy / Manufacturer Experience:**
  - Overview screen: *"Welcome back Cipla Ltd. (Verified Manufacturer)"*, 4 metric cards, Quick actions, "Needs attention this week" alert.
  - Inventory screen: search bar, category filters (All, Active, Near Expiry, Critical, Expired), batch summary cards.
  - Add Stock / New Batch Registration: validated form, editable Excel-style table (Add, Edit, Delete entries), live pattern preview, "Generate Patterns" button.
  - Foil Artwork Preview: repeat configuration (160mm width, 240mm repeat), zoom controls (Fit, 100%, 150%, 200%), legend of 4 encoded colors, calibration anchor.
- [ ] **New Printing Feature Workflow:**
  - "Print Artwork" button present on Foil Artwork Preview.
  - Print Settings Modal: foil width, repeat length, print scale, orientation, copies/repeats, layout preview, anchor and boundaries toggles.
  - Print Preview Modal: exact physical dimensions in mm, margins, eye-marks, registration lines, regulatory batch header, pharmaceutical disclaimer.
  - Export actions functional: Browser print (`@media print`), PDF download, SVG export.
