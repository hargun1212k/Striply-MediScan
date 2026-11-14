# Striply — Feature Specifications (FEATURE.md)

> **Feature Registry & Technical Implementation Details**

---

## 1. Unified Mobile App Shell (`phone`)
- **Viewport Dimensions:** 390px width × 860px height (iPhone 14 / modern flagship standard).
- **Desktop Adaptation:** Scaled automatically to fit screen via `Math.min(1, (window.innerWidth - 24) / 406, (window.innerHeight - 24) / 880)` with rounded container chassis (`44px` border radius) and dynamic island pill.
- **Mobile Native Adaptation:** Fullscreen `100dvh` without outer phone border on real mobile viewports.

---

## 2. Authentication & Onboarding
- **Terms & Conditions Acceptance:** Checkbox validation before proceeding.
- **Dual Persona Switch:** Dedicated routing for Customers and Pharmacy / Manufacturers.
- **OAuth Providers:** Google Sign-In and Apple Sign-In interactive buttons with instant user session setup.
- **Email Authentication:** Email and password credentials with password show/hide eye toggle and forgot password handler.

---

## 3. Customer Medication Management
- **Scan Hero Banner:** Dark navy `#102A43` CTA card directly opening scanner.
- **Quick Dose Check-in:** Real-time dose logging with toggleable status badge.
- **Recent Scans Feed:** Color-coded status badges for Verified (green), Near Expiry (amber), and Expired (red).
- **My Medicines Categorization:** Tabbed organization across Currently Taking, Upcoming, and Completed medications.

---

## 4. Recognition Pattern Lines (RP Lines) Scanner
- **HUD Reticle:** Corner alignment brackets and animated orange laser scanline.
- **Multi-Source Input:**
  - Live shutter capture.
  - Image file upload from disk/gallery.
  - Manual batch code fallback modal.
- **Decoder Pipeline:** Detects calibration anchor dot, decodes 4-color pattern (Red, Green, Orange/Blue, Yellow), queries backend registry, and returns verified pharmaceutical metadata.

---

## 5. Industrial Foil Artwork & Batch Management
- **Batch Registration:** Validated form fields (Medicine name, Strength, Manufacturer, Batch number, Manufacturing date, Expiry date, Quantity, Unit).
- **Real-Time Pattern Generator:** Generates unique color dot signatures based on batch entropy.
- **Blister Matrix Visualizer:** 2x5 pocket layout preview with configurable dimensions (width 120-180mm, repeat 60-90mm) and zoom factors (Fit, 100%, 200%).
- **SVG Artwork Export:** 1-click generation of print-ready vector SVG files containing pocket boundaries, RP lines, calibration dots, and regulatory metadata.

---

## 6. Developer & Diagnostic Tools
- **In-App Dev Panel:** Accessible from profile screen.
- **Fast Navigation:** Instant hot-jump between Customer Home, Manufacturer Overview, and Welcome screen.
- **Performance Monitor:** Real-time FPS, memory usage, and simulated network latency overlay.
- **Network Simulation:** Toggle between live network and high-latency simulation.
