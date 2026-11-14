# Striply — Verification Test Checklist (TEST_CHECKLIST.md)

> **Concrete Verification Tasks for App Improvements & 5-Colour Pattern System**

---

## 1. Automated Build & Type Verification

| Test Step | Command | Expected Output | Status |
|---|---|---|---|
| Frontend Vite & React SPA Build | `cmd /c "npm --prefix web run build"` | `dist/index.html` bundled (~327 kB), exit code 0 | **VERIFIED (Exit code 0)** |
| Backend TypeScript Build | `cmd /c "npm --prefix backend run build"` | Output compiled to `dist/`, zero errors, exit code 0 | **VERIFIED (Exit code 0)** |
| Remote Git Sync | `git push origin main` | Pushed cleanly to `Striply-MediScan.git` | **READY** |

---

## 2. Interactive Feature Verification Checklist

- [x] **1. App Preview & Layout (Requirement 1):**
  - Artificial phone bezel/border, thick hardware frame, and fake dynamic island completely removed.
  - Replaced with clean, modern `.app-canvas` responsive layout with subtle background contrast.
- [x] **2. Navigation & Authentication Flow (Requirement 2):**
  - **Initial Open**: Displays "Welcome to Striply" with mascot logo and agreement checks.
  - **Second Screen**: "Who are you signing in as?" with Customer and Pharmacy / Manufacturer options.
  - **Third Screen**: Create Account with **two progress steps only** (`Steps at={1}` out of 2).
  - **Google & Apple OAuth**: Actual Google account selection modal with selectable accounts (`priya.sharma@gmail.com`, `cipla.pharma@gmail.com`, or custom account) and Apple ID dialog.
  - **Email Suggestions**: Autocomplete dropdown displaying domains (`@gmail.com`, `@outlook.com`, `@yahoo.com`, `@icloud.com`, `@pharma.com`).
  - **Separate Sign Up & Login**: Distinct Create Account (`Signup`) and Login (`Login`) screens with mutual cross-navigation links.
  - **Sign-Out Flow**: Proper session cleanup, animated loading indicator ("Signing out securely..."), and redirection directly to "Who are you signing in as?" (`role`), never to Welcome screen.
- [x] **3. Customer Dashboard & Profile Fixes (Requirement 3):**
  - **Scan Medicine Hero Button**: Styled in solid **black** (`#000000`).
  - **Edit Profile Screen**: Functional editor for Full Name, Email, Phone Number, with photo change trigger and Save Changes confirmation.
  - **Preferences Screen**: Working toggles for Push notifications, Expiry alerts, Offline cache, and Audio chime.
  - **Help & Support Screen**: Comprehensive FAQs, Support Email, and Toll-Free Helpline.
  - **Terms & Privacy Screen**: Complete legal documentation, medical disclaimer, and compliance guidelines.
- [x] **4. Pharmacy / Manufacturer Onboarding & Verification (Requirement 4):**
  - **Google Auth for Manufacturer**: No blank screen. Authenticates cleanly and routes to Business Verification.
  - **Business Details Page (`business-verify`)**: Collects Business Name, Registered Email, Contact, Address, Location, Facility Details, and Drug Licence #.
  - **Pharmaceutical Licence PDF Upload**: Drag-and-drop / file selector supporting PDF files, displaying filename, size, and upload badge.
  - **Verification Status Page (`verify-status`)**: Shows timeline (Pending, Under Review, Verified), unverified feature gating banner, and instant Evaluator Demo Approval toggle.
- [x] **5. Manufacturer Dashboard & "Alert Your Changes" (Requirement 5):**
  - Prominent "Alert Your Changes" action button.
  - Broadcast modal to announce Licence Updates, Facility Inspections, Address Changes, or Batch Recalls with instant toast confirmation.
- [x] **6. Medicine Verification – Five-Colour Encoding System (Requirement 6):**
  - Result screen explains the **5-Colour System**:
    - 🔴 **Red**: Medicine Name (*Paracetamol 650*)
    - 🔵 **Blue**: Medicine ID (*MED-2024-KM01*)
    - 🟢 **Green**: Manufacturing Date (*15 Oct 2024*)
    - 🟡 **Yellow**: Expiry Date (*10 Dec 2027 · 340 Days Remaining*)
    - 🟣 **Purple**: Manufacturer Information (*Cipla Ltd. Licensed Facility*)
  - 5-color rainbow strip and individual color breakdown cards.
- [x] **7. Eradication of "RP Lines" (Requirement 7):**
  - Zero occurrences of "RP Lines" across all screens, headings, labels, comments, and HTML titles.
