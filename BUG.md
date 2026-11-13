# Striply — Bug Root-Cause & Resolution Traces (BUG.md)

> **Purpose:** Full investigation and resolution traces for bugs and technical anomalies encountered during development.

---

## BUG-001: Specular Glare False Triggering on Wavy Aluminum Foil Cavities
* **Bug ID:** BUG-001
* **Severity:** High (Scanner UX Degradation)
* **Status:** Resolved & Pattern Fixed
* **Symptom:** Scanner repeatedly displayed *"Tilt phone to eliminate foil glare"* even when the 4 color bands were clearly visible and illuminated by ambient light.
* **Reproduction Steps:**
  1. Place sample blister strip under standard ceiling fluorescent lighting ($400\text{ lux}$).
  2. Hold phone at normal $90^\circ$ perpendicular angle at $12\text{cm}$ distance.
  3. Observe scanner continuously rejecting frame.
* **Root Cause Analysis (RCA):**
  * The blister cavity itself has curved, embossed bubble walls that reflect light hotspots.
  * The glare threshold was previously calculated across the entire camera viewfinder frame rather than strictly inside the detected quadrilateral boundary of the Striply code zone.
* **Fix Applied:**
  * Modified `src/cv/GlareDetector.ts` / `clpc_decoder.py`: Confined specular mask ($I \ge 245$) calculation exclusively to the warped $360 \times 120\text{px}$ code interior *after* perspective homography, ignoring ambient cavity reflections.
* **Regression Verification:**
  ```bash
  pytest tests/test_cv_core.py::test_glare_gate_roi_only -v
  # PASSED: 0 false glare rejections on embossed blister edges.
  ```

---

## BUG-002: Color Temperature Shift Under Warm Incandescent Light (2700K–3000K)
* **Bug ID:** BUG-002
* **Severity:** Critical (Potential Misclassification)
* **Status:** Resolved & Pattern Fixed
* **Symptom:** Yellow and Green data bands yielded ambiguous CIEDE2000 distances ($\Delta E_{00} \approx 10.5$) under warm residential bedside lamps, triggering `INVALID_CODE`.
* **Reproduction Steps:**
  1. Illuminate synthetic blister target using a $2700\text{K}$ warm halogen/LED bulb.
  2. Attempt decode using fixed D65 reference white.
* **Root Cause Analysis (RCA):**
  * Camera auto-white-balance (AWB) shifts the entire image toward yellow/red, compressing the distance between Yellow ($b^* \approx +75$) and Green ($a^* \approx -45, b^* \approx +50$).
* **Fix Applied:**
  * Implemented **Von Kries diagonal chromatic adaptation**:
    $$\begin{bmatrix} R' \\ G' \\ B' \end{bmatrix} = \begin{bmatrix} \frac{R_{\text{target}}}{R_{\text{white\_fiducial}}} & 0 & 0 \\ 0 & \frac{G_{\text{target}}}{G_{\text{white\_fiducial}}} & 0 \\ 0 & 0 & \frac{B_{\text{target}}}{B_{\text{white\_fiducial}}} \end{bmatrix} \begin{bmatrix} R \\ G \\ B \end{bmatrix}$$
  * Dynamically scales each color channel using the measured RGB of the printed Left White Fiducial bar before converting to CIE $L^*a^*b^*$.
* **Regression Verification:**
  ```bash
  pytest tests/test_cv_core.py::test_color_distance_2700k -v
  # PASSED: Clean separation margin maintained >= 14.2 Delta E00.
  ```

---

## BUG-003: Supabase RLS Policy Blocking Chemist Inventory Query for Sub-Account Staff
* **Bug ID:** BUG-003
* **Severity:** Medium (Access Control)
* **Status:** Resolved & Schema Updated
* **Symptom:** Pharmacy assistants logging into the Next.js portal received empty inventory tables (`[]`), while the pharmacy owner saw all stock.
* **Reproduction Steps:**
  1. Create pharmacy organization with owner user.
  2. Invite dispensary assistant under role `pharmacist` with same `org_id`.
  3. Assistant logs in and queries `/inventory`.
* **Root Cause Analysis (RCA):**
  * The RLS policy previously checked `auth.uid() = profiles.id` directly on the inventory table instead of joining through the helper function `get_auth_org_id()`.
* **Fix Applied:**
  * Replaced inline check with `org_id = public.get_auth_org_id()` in `TRD.md` RLS policy section.
  * Verified that any authenticated staff member sharing the organization's `org_id` correctly accesses the store's shared inventory ledger.
* **Regression Verification:**
  ```bash
  npx supabase test db tests/rls_org_isolation.sql
  # PASSED: Sub-accounts access shared org stock; cross-org isolation preserved.
  ```

