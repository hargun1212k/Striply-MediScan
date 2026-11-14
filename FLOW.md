# Striply — Application Navigation & Screen Flow (FLOW.md)

> **Complete Screen Hierarchy & User Flow**

---

```mermaid
graph TD
  Welcome["1. Welcome Screen<br/>(Logo, Mascot, Terms & Privacy Check)"] -->|Continue| Role["2. Role Selection<br/>(Customer vs Pharmacy/Manufacturer)"]

  Role -->|I'm a Customer| SignupCust["3. Sign Up<br/>(Google / Apple / Email)"]
  Role -->|I'm a Pharmacy / Manufacturer| SignupPharma["3. Sign Up<br/>(Google / Apple / Email)"]

  SignupCust -->|Sign In Link| LoginCust["4. Login<br/>(Email + Password + OAuth)"]
  SignupPharma -->|Sign In Link| LoginPharma["4. Login<br/>(Email + Password + OAuth)"]

  SignupCust -->|Authenticate| CustHome["5. Customer Home<br/>(Hero Scan, Dose Check-in, Recent Scans)"]
  LoginCust -->|Authenticate| CustHome

  SignupPharma -->|Authenticate| PharmaOrg["12. Manufacturer Overview<br/>(Activity Stats, Quick Actions, Recall Alert)"]
  LoginPharma -->|Authenticate| PharmaOrg

  subgraph CustomerExperience["Customer Experience"]
    CustHome -->|Scan Banner / Center Nav| Scanner["6. Scanner Viewfinder<br/>(Alignment Box, Flash, Gallery, Manual Fallback)"]
    Scanner -->|Shutter / File| ResultScreen["7. Scan Result<br/>(Verified Authentic, Batch, Mfg/Exp)"]
    ResultScreen -->|Save to My Meds| MedsScreen["8. My Medicines<br/>(Currently Taking, Upcoming, Completed)"]
    CustHome -->|Nav / See All| MedsScreen
    CustHome -->|Nav| CustAlerts["14. Alerts<br/>(Near Expiry, Recall, Dose Reminders)"]
    CustHome -->|Nav| CustProfile["15. Profile & Settings<br/>(Avatar, Preferences, Dev Tools, Sign Out)"]
    CustProfile -->|Preferences| PrefsScreen["13. Preferences<br/>(Push, Expiry, Offline Cache Toggles)"]
  end

  subgraph PharmacyExperience["Pharmacy & Manufacturer Experience"]
    PharmaOrg -->|Nav / Browse| InventoryScreen["9. Inventory<br/>(Search, Filter Tabs, Stock Cards)"]
    PharmaOrg -->|Nav / Register| NewBatchScreen["10. New Batch Entry<br/>(Validated Form, RP Pattern Preview)"]
    NewBatchScreen -->|Add Entry| FoilScreen["11. Foil Artwork Preview<br/>(2x5 Blister Grid, Config, SVG Export)"]
    InventoryScreen -->|Click Batch| FoilScreen
    PharmaOrg -->|Nav| PharmaAlerts["14. Alerts / Records<br/>(Near Expiry, Expired, Recalls)"]
    PharmaOrg -->|Settings| CustProfile
  end

  CustProfile -->|Sign Out| Welcome
  PharmaOrg -->|Sign Out| Welcome
```

---

## Screen Transition Matrix

| # | Screen Name | Route / Key | Primary Actions & Handlers | Back Destination |
|---|---|---|---|---|
| 1 | Welcome | `'welcome'` | Check T&C, Check Privacy, `Continue -> Role` | None (Root) |
| 2 | Role Selection | `'role'` | Select Customer, Select Pharmacy -> `Signup` | `Welcome` |
| 3 | Sign Up | `'signup'` | Continue with Google, Continue with Apple, Email -> `Login` | `Role` |
| 4 | Log In | `'login'` | Email/Password entry, show/hide password, Forgot password, Google/Apple OAuth -> Finish to Role Home | `Signup` / `Role` |
| 5 | Customer Home | `'home'` | Scan medicine hero, Dose check-in, Recent scans, Customer Nav | Exit |
| 6 | Scanner HUD | `'scan'` | Viewfinder, Flash toggle, Gallery file upload, Shutter capture, Manual batch code modal -> `Result` | `Home` |
| 7 | Scan Result | `'result'` | Save to My Medicines -> `Medicines`, Scan Another -> `Scan` | `Scan` |
| 8 | My Medicines | `'medicines'` | Tabs (Currently Taking, Upcoming, Completed), View detail | `Home` |
| 9 | Inventory | `'inventory'` | Real-time search, Filter tabs, Select batch -> `Foil` | `Org` |
| 10 | New Batch Entry | `'batch'` | Form validation, Date pickers, RP Lines pattern preview, Add entry -> `Foil` | `Inventory` |
| 11 | Foil Artwork Preview | `'foil'` | Blister 2x5 grid, Foil width & repeat controls, Zoom (Fit/100%/200%), Export SVG artwork -> Download file | `NewBatch` / `Inventory` |
| 12 | Organization Overview | `'org'` | Metric cards, Quick action tiles, Recall alert, Pharma Nav | Exit |
| 13 | Preferences | `'prefs'` | Notification toggles, Expiry alerts toggle, Offline cache toggle | `Profile` |
| 14 | Alerts | `'alerts'` | Tabs (All, At Risk, Notes), Alert cards | Prior tab |
| 15 | Profile | `'profile'` | Account stats, Preferences link, Dev tools drawer launcher, Sign out | Prior tab |
