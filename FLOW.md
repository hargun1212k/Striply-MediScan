# Striply — Application Navigation & Screen Flow (FLOW.md)

> **Updated Screen Flow & Architecture (5-Colour System & Business Verification)**

---

```mermaid
graph TD
  Welcome["1. Welcome to Striply<br/>(Mascot, Terms & Privacy Agreement)"] -->|Continue| Role["2. Who are you signing in as?<br/>(2-Step: Step 1 Role Selection)"]

  Role -->|I'm a Customer| CustSignup["3. Create Account (Customer)<br/>(Step 2 of 2: Google, Apple, Email Autocomplete)"]
  Role -->|I'm a Pharmacy / Manufacturer| PharmaSignup["3. Create Account (Manufacturer)<br/>(Step 2 of 2: Google, Apple, Email Autocomplete)"]

  CustSignup -->|Already have account? Login| CustLogin["4. Customer Login<br/>(Email + Password + OAuth)"]
  PharmaSignup -->|Already have account? Login| PharmaLogin["4. Manufacturer Login<br/>(Email + Password + OAuth)"]

  CustSignup -->|Auth Success| CustHome["5. Customer Home<br/>(Black Scan Button, Dose Check-in, Recent Scans)"]
  CustLogin -->|Auth Success| CustHome

  PharmaSignup -->|Auth Success| BizVerify["13. Business Verification<br/>(Company info, Licence #, PDF Document Upload)"]
  PharmaLogin -->|Auth Success| VerifyStatus["14. Verification Status<br/>(Timeline: Pending / Under Review / Verified)"]
  BizVerify -->|Submit Request| VerifyStatus
  VerifyStatus -->|Approved / Full Access| PharmaOrg["12. Manufacturer Dashboard<br/>(Alert Your Changes, Batches, Inventory)"]

  subgraph CustomerExperience["Customer Experience"]
    CustHome -->|Black Scan Hero / Nav| Scanner["6. Pattern Scanner<br/>(Viewfinder, Laser Scanline, Flash, Gallery, Manual)"]
    Scanner -->|Shutter / File| ResultScreen["7. Verification Result<br/>(Five-Colour Decoding System Explanation)"]
    ResultScreen -->|Save to Meds| MedsScreen["8. My Medicines<br/>(Currently Taking, Upcoming, Completed)"]
    CustHome -->|Nav / See All| MedsScreen
    CustHome -->|Nav| CustAlerts["17. Alerts<br/>(Near Expiry, Recall, Dose Reminders)"]
    CustHome -->|Nav| CustProfile["16. Profile Hub<br/>(Edit Profile, Preferences, Help, Terms, Sign Out)"]
    CustProfile -->|Edit Profile| EditProf["15A. Edit Profile"]
    CustProfile -->|Preferences| Prefs["15B. Preferences"]
    CustProfile -->|Help & Support| HelpSupp["15C. Help & Support"]
    CustProfile -->|Terms & Privacy| TermsPriv["15D. Terms & Privacy"]
  end

  subgraph PharmacyExperience["Pharmacy & Manufacturer Experience"]
    PharmaOrg -->|Nav / Stock| InventoryScreen["9. Inventory<br/>(Search, Filter Tabs, Stock Cards)"]
    PharmaOrg -->|Nav / Register| NewBatchScreen["10. New Batch Entry<br/>(Gated to Verified, 5-Color Pattern Preview)"]
    NewBatchScreen -->|Add Entry| FoilScreen["11. Foil Artwork Preview<br/>(2x5 Blister Grid, Config, SVG Export)"]
    InventoryScreen -->|Click Batch| FoilScreen
    PharmaOrg -->|Alert Your Changes| AlertModal["Broadcast Regulatory / Licence Changes"]
    PharmaOrg -->|Nav| PharmaAlerts["17. Alerts & Recalls"]
  end

  CustProfile -->|Sign Out| SignOutLoading["Signing Out Animation"] -->|Redirect| Role
  PharmaOrg -->|Sign Out| SignOutLoading -->|Redirect| Role
```

---

## Screen Directory & Handlers

| Key | Screen Title | Navigation & Trigger | Destination / Actions |
|---|---|---|---|
| `'welcome'` | Welcome to Striply | Initial app open | Check T&C & Privacy -> `'role'` |
| `'role'` | Who are you signing in as? | Continue from Welcome / Post Sign-out | Customer or Manufacturer -> `'signup'` |
| `'signup'` | Create your account | Step 2 of 2 indicator | Google/Apple Modal, Email autocomplete, Submit -> Customer Home or Business Verification |
| `'login'` | Log in to Striply | From Signup link | OAuth or Email/Password -> Customer Home or Status |
| `'home'` | Customer Home | Primary hub | Black scan button -> `'scan'`, Dose toggle, Recent scans |
| `'scan'` | Scan Verification Pattern | Dark optical HUD | Flash toggle, Gallery file upload, Shutter capture, Manual fallback -> `'result'` |
| `'result'` | Verification Result | Decoded result | 5-colour encoding cards (Red, Blue, Green, Yellow, Purple), Save to cabinet |
| `'medicines'` | My Medicines | Nav item | Tabs: Currently Taking, Upcoming, Completed |
| `'inventory'` | Inventory | Pharma Nav | Real-time search, category filters, batch cards -> `'foil'` |
| `'batch'` | New Batch Entry | Pharma Nav | Validated inputs, 5-color live pattern generator -> `'foil'` |
| `'foil'` | Foil Artwork Preview | From Batch/Inventory | 2x5 blister layout, repeat configuration, Export SVG download |
| `'org'` | Manufacturer Overview | Pharma Home | Metric tiles, "Alert Your Changes" broadcasting modal, Quick actions |
| `'business-verify'` | Business Verification | Manufacturer Onboarding | Company details, Drug licence #, PDF licence file upload |
| `'verify-status'` | Verification Status | Post-verification | Timeline (Pending, Under Review, Verified), Evaluator demo toggle |
| `'edit-profile'` | Edit Profile | Profile link | Full Name, Email, Phone, Avatar change & save |
| `'prefs'` | Preferences | Profile link | Push, Expiry alerts, Offline cache, Audio chimes |
| `'help-support'` | Help & Support | Profile link | FAQs, Support Email, 24/7 Helpline |
| `'terms-privacy'` | Terms & Privacy | Profile link | Terms of Service, Medical & Traceability Disclaimer |
| `'alerts'` | Alerts | Nav item | All, At Risk, Notes tabs |
| `'profile'` | My Profile Hub | Nav item | User info, Links to 4 sub-screens, Sign out -> `'role'` |
