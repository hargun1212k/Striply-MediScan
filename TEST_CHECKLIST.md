# Striply — Verification Test Checklist (TEST_CHECKLIST.md)

> **Concrete Verification Tasks:** Actual commands, expected outputs, and UI interactions required to mark changes as done.

---

## 1. Automated Build & Type Verification

| Test Step | Command | Expected Output | Status |
|---|---|---|---|
| Frontend Vite & React SPA Build | `cmd /c "npm --prefix web run build"` | `dist/index.html` bundled (~300 kB), exit code 0 | **VERIFIED (Exit code 0)** |
| Backend TypeScript Build | `cmd /c "npm --prefix backend run build"` | Output compiled to `dist/`, zero errors, exit code 0 | **VERIFIED (Exit code 0)** |
| Remote Git Sync | `git push origin main` | Pushed cleanly to `Striply-MediScan.git` | **READY** |

---

## 2. Interactive Screen Verification Checklist

- [x] **1. Welcome Screen (`Welcome`):**
  - Mascot logo with orange pill and cartoon eyes inside corner alignment brackets.
  - Interactive Terms & Conditions checkbox.
  - Interactive Privacy Policy checkbox.
  - "Continue" button blocked with toast until both terms are checked.
- [x] **2. Role Selection Screen (`Role`):**
  - "Who are you signing in as?"
  - Option A: "I'm a Customer" (Scan RP Lines on your medicine, track doses).
  - Option B: "I'm a Pharmacy / Manufacturer" (Register batches, generate patterns).
  - Verification badge notice at bottom.
- [x] **3. Sign Up Screen (`Signup`):**
  - "Continue with Google" triggers sign-in toast and transitions to authenticated view.
  - "Continue with Apple" triggers sign-in toast and transitions to authenticated view.
  - "Sign up with Email" navigates to email login flow.
- [x] **4. Login Screen (`Login`):**
  - Controlled Email and Password inputs.
  - Password visibility toggle (`Eye` / `EyeOff`).
  - "Forgot password?" triggers reset link toast.
  - Google and Apple round OAuth buttons.
  - Submit form validates non-empty inputs and navigates to role home.
- [x] **5. Customer Home Screen (`HomeScreen`):**
  - Greeting "Good morning, Priya Sharma".
  - Notification bell and profile icons in top row.
  - Deep Navy hero tile: "Scan a medicine — With calibration and verification" with camera icon.
  - Quick dose check-in button ("Metformin 500 — Scheduled for 08:00 AM") with toggleable "✓ Taken" chip.
  - Currently taking section with status chips ("Paracetamol 650", "Metformin 500").
  - Recent scans with status chips: Verified (green), Near Expiry (amber), Expired (red).
- [x] **6. Scanner Viewfinder Screen (`Scan`):**
  - Dark HUD with back button, flashlight toggle (lighting up and toast confirmation).
  - Optical scanning reticle with animated laser scanline.
  - Center blister illustration with RP Lines pattern.
  - Gallery button triggers file upload dialog for local images.
  - Center Shutter button triggers decoding spinner and transitions to Result.
  - Pencil button opens Manual Batch Code Fallback dialog.
- [x] **7. Scan Result Screen (`Result`):**
  - Green circular glow with checkmark: "Verified Authentic".
  - Medicine details: Paracetamol 650, Batch B204-P-12, Mfg/Exp dates, Cipla Ltd.
  - "Save to My Medicines" button adds medication and navigates to Medicines tab.
  - "Scan Another Medicine" button returns to scanner.
- [x] **8. My Medicines Screen (`Medicines`):**
  - Segmented tabs: Currently Taking, Upcoming, Completed.
  - Medicine cards with dosage schedules and status badges.
- [x] **9. Pharmacy Inventory Screen (`Inventory`):**
  - Real-time search bar filtering across all batches and medicine names.
  - Category tabs: All, Active, Near expiry, Recalled, Expired.
  - Stock summary cards: 12,200 Total units, 22 Days median shelf life.
  - Interactive batch cards navigating to Foil preview.
- [x] **10. New Batch Entry Form (`NewBatch`):**
  - Validated input fields: Medicine name, Strength, Manufacturer, Batch number, Mfg date, Exp date, Quantity, Unit.
  - Inline error highlights ("Required") if mandatory fields are missing.
  - Real-time RP Lines pattern preview box updating with color dots.
  - "Add entry" saves to inventory and backend API `/api/v1/batches/register`.
- [x] **11. Foil Artwork Preview Screen (`Foil`):**
  - Visualizer showing 2x5 blister pocket matrix with RP Lines on each pocket.
  - Repeat configuration controls: Foil width (120mm, 150mm, 180mm), Height (60mm, 70mm, 90mm).
  - Zoom controls: Fit, 100%, 200%.
  - 4-color legend with calibration dot.
  - **Export artwork** button downloads real vector SVG `striply-foil-[batch].svg`.
- [x] **12. Organization Overview (`Org`):**
  - Header: "Cipla Ltd. Verified Manufacturer".
  - Metric cards: 4 Registered batches, 4 Active patterns, 1 Near expiry, 1 Recalled.
  - Quick action tiles: Register new batch, Browse batch records, Inventory & recalls.
  - Recall alert card: "Needs attention this week: Pantocid 40".
- [x] **13. Preferences Screen (`Preferences`):**
  - Toggles for Push notifications, Expiry alerts, Offline calibration cache.
  - Cloud sync timestamp indicator.
- [x] **14. Alerts Screen (`Alerts`):**
  - Filter tabs: All, At Risk, Notes.
  - Alerts for Near Expiry, Expired medicine, Batch Recall notice, Dose reminder.
- [x] **15. Profile Screen (`Profile`):**
  - Avatar initials ("PS" or "CL"), role badge.
  - Links to My Organization, Preferences, Help & Support.
  - Dev tools launcher button opening the Dev Panel modal drawer.
  - Sign out button returning to Welcome screen.
- [x] **16. Dev Panel Drawer (Screen 7 in Image 3):**
  - Reload application.
  - Jump to customer home / manufacturer overview.
  - Toggle 60fps performance monitor HUD.
  - Toggle slow network simulation.
