# Striply — Code Commenting & Engineering Guidelines (GUIDELINES.md)

> **Purpose:** Mandate explicit code commenting and design principles. Code shows *what* changed; comments explain *why* it exists, what calls into it, and what downstream logic assumes.

---

## 1. Core Commenting Philosophy: The "Why" Over the "What"

* **Bad Comment (Restating syntax):**
  ```python
  # Convert image to Lab
  img_lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
  ```
* **Good Comment (Explaining flow & non-obvious intent):**
  ```python
  # Convert from sensor BGR to CIE L*a*b* color space.
  # WHY: Ambient lighting in pharmacies shifts RGB values non-linearly. L*a*b* isolates
  # luminance (L) from chromaticity (a, b), enabling perceptual CIEDE2000 matching
  # that remains stable across warm fluorescent and daylight conditions.
  # CALLED BY: BandDemodulator.classify_segments()
  # ASSUMES: Input matrix has already been white-balanced via Von Kries adaptation.
  img_lab = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB)
  ```

---

## 2. Mandatory Rules for Specific Subsystems

### 2.1 Computer Vision & Image Processing
Every matrix transformation, thresholding heuristic, or color distance calculation **must** document:
1. **Mathematical Assumption:** The physical unit, color space, or coordinate system assumed.
2. **Tolerance Margin:** Why a specific constant was chosen (e.g., why $I \ge 245$, why aspect ratio $2.2 \dots 3.8$).
3. **Safety Fallback:** What happens if the boundary condition fails (must fail safe).

*Example:*
```typescript
/**
 * Evaluates specular glare saturation across the standardized canonical code buffer.
 * 
 * @param roiGrayscale - 360x120 8-bit single-channel grayscale canonical matrix.
 * @returns boolean - True if glare area exceeds 8% of the code interior.
 * 
 * WHY: Aluminum blister foil reflects harsh specular highlights that wash out chromatic data.
 * If >8% of pixels are saturated (>=245), CIEDE2000 classification will yield false digits.
 * We reject the frame early to prevent inaccurate drug identification.
 */
export function isSpecularGlareExcessive(roiGrayscale: cv.Mat): boolean {
  const SENSITIVITY_THRESHOLD = 245; // Pixel saturation floor for aluminum reflections
  const MAX_GLARE_RATIO = 0.08;      // Maximum tolerable corrupted area (8%)
  // ...
}
```

### 2.2 Supabase Database Schemas & RLS Policies
Every Row Level Security policy and trigger **must** document:
1. **Security Objective:** What threat vector or data breach this policy blocks.
2. **Role Scope:** Which authenticated role (`consumer`, `pharmacist`, `admin`) is targeted.
3. **Performance Impact:** Whether the check uses indexed foreign keys or subqueries.

*Example:*
```sql
-- POLICY: Pharmacists view only their store inventory
-- WHY: Multi-tenant safety. Prevents Pharmacy A from discovering Pharmacy B's stock,
-- pricing, or patient volume (anti-competitive and privacy violation).
-- IMPLEMENTATION: Uses get_auth_org_id() STABLE function to cache the organization ID
-- in the transaction context, avoiding repeated joins on public.profiles.
CREATE POLICY "Pharmacists view only their store inventory"
    ON public.inventory_items FOR SELECT
    USING (org_id = public.get_auth_org_id());
```

### 2.3 Checksum & Parity Verification Math
```python
def verify_modulo_11_checksum(d1: int, d2: int, d3: int, d4: int, expected_checksum: int) -> bool:
    """
    Computes weighted Modulo-11 parity across the 4 decoded Striply bands.
    Weights: [3, 5, 7, 11] - chosen as prime multipliers to catch 100% of single-digit
    transposition and substitution errors caused by localized foil ink scratches.
    """
    calculated = (d1 * 3 + d2 * 5 + d3 * 7 + d4 * 11) % 10
    return calculated == expected_checksum
```

---

## 3. Formatting & Code Style Standards

1. **TypeScript:** Strict mode enabled. No `any` types allowed without an explicit inline comment explaining why a generic cannot be inferred.
2. **Python:** PEP 8 compliance, explicit type annotations (`mypy --strict`).
3. **Database Migrations:** All DDL statements must be idempotent (`CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`).

