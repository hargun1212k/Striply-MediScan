"""
Striply 4-Colour Custom Visual Encoding Generator
Specification:
- Red Channel: Medicine Identity (Medicine Name / Medicine ID)
- Blue Channel: Batch Identity (Manufacturer Batch Number / Striply Batch ID)
- Green Channel: Manufacturing Date
- Yellow Channel: Expiry Date
Composition is retrieved securely from database via Medicine ID, not encoded in a separate color.
"""

import argparse
from PIL import Image, ImageDraw

# Standard 4-Colour Calibration Palette (RGB)
PALETTE_MAP = {
    "white_marker": (255, 255, 255),
    "dark_marker": (23, 59, 112),
    "red_channel": (239, 68, 68),     # Medicine Identity
    "blue_channel": (37, 99, 235),    # Batch Identity (Striply Batch ID)
    "green_channel": (16, 185, 129),  # Manufacturing Date
    "yellow_channel": (245, 158, 11), # Expiry Date
}

def generate_striply_4color_code(
    med_id: int,
    batch_num: int,
    mfg_year: int,
    exp_year: int,
    output_path: str = "striply_code.png",
    width: int = 360,
    height: int = 120
) -> str:
    """
    Renders a canonical 360x120px 4-colour machine-readable micro-pattern for blister lidding foil.
    """
    img = Image.new("RGB", (width, height), color=(10, 17, 40))
    draw = ImageDraw.Draw(img)

    # 1. Left Alignment Markers (Orientation & Perspective Detection)
    draw.rectangle([8, 10, 28, 110], fill=PALETTE_MAP["white_marker"])
    draw.rectangle([32, 10, 40, 110], fill=PALETTE_MAP["dark_marker"])

    # 2. Right Alignment Markers
    draw.rectangle([320, 10, 328, 110], fill=PALETTE_MAP["dark_marker"])
    draw.rectangle([332, 10, 352, 110], fill=PALETTE_MAP["white_marker"])

    # 3. Red Channel: Medicine Identity (x: 50 to 110)
    red_count = 2 + (med_id % 4)
    red_step = 60 / red_count
    for i in range(red_count):
        stripe_w = 4 + ((med_id + i) % 6)
        x_pos = int(50 + i * red_step)
        draw.rectangle([x_pos, 15, x_pos + stripe_w, 105], fill=PALETTE_MAP["red_channel"])

    # 4. Blue Channel: Batch Identity (x: 118 to 193)
    binary_str = bin(batch_num)[2:].zfill(8)
    blue_step = 75 / 8
    for i, bit in enumerate(binary_str):
        x_pos = int(118 + i * blue_step)
        h = 90 if bit == '1' else 45
        y = 15 if bit == '1' else 37
        draw.rectangle([x_pos, y, x_pos + 5, y + h], fill=PALETTE_MAP["blue_channel"])

    # 5. Green Channel: Manufacturing Date (x: 200 to 255)
    green_count = 3 + (mfg_year % 4)
    green_step = 55 / green_count
    for i in range(green_count):
        x_pos = int(200 + i * green_step)
        draw.rectangle([x_pos, 20, x_pos + 4, 100], fill=PALETTE_MAP["green_channel"])

    # 6. Yellow Channel: Expiry Date (x: 262 to 312)
    yellow_count = 3 + (exp_year % 3)
    yellow_step = 50 / yellow_count
    for i in range(yellow_count):
        x_pos = int(262 + i * yellow_step)
        draw.rectangle([x_pos, 20, x_pos + 4, 100], fill=PALETTE_MAP["yellow_channel"])

    img.save(output_path, "PNG")
    print(f"✅ Generated 4-Colour Striply Pattern: {output_path} (Med: {med_id}, Batch: {batch_num})")
    return output_path

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate Striply 4-Colour Micro-Pattern")
    parser.add_argument("--med", type=int, default=1, help="Medicine ID")
    parser.add_argument("--batch", type=int, default=1, help="Striply Batch sequence number")
    parser.add_argument("--mfg", type=int, default=2026, help="Manufacturing year")
    parser.add_argument("--exp", type=int, default=2027, help="Expiry year")
    parser.add_argument("--out", type=str, default="striply_4color_pattern.png", help="Output file path")
    args = parser.parse_args()

    generate_striply_4color_code(args.med, args.batch, args.mfg, args.exp, args.out)
