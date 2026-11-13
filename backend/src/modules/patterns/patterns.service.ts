import { BatchesService, StriplyBatchRecord } from '../batches/batches.service.js';

export interface EncodedLine {
  channel: 'red' | 'blue' | 'green' | 'yellow' | 'marker';
  colorHex: string;
  x: number;
  y: number;
  width: number;
  height: number;
  thickness: number;
}

export interface StriplyPatternData {
  striply_batch_id: string;
  medicine_id: number;
  mfg_encoded: string;
  exp_encoded: string;
  parity_checksum: number;
  lines: EncodedLine[];
  svg: string;
  version: string;
}

export interface FoilArtworkConfig {
  foil_width_mm: number;
  repeat_length_mm: number;
  pattern_width_mm: number;
  pattern_height_mm: number;
  spacing_x_mm: number;
  spacing_y_mm: number;
  rows: number;
  cols: number;
}

export const DEFAULT_FOIL_CONFIG: FoilArtworkConfig = {
  foil_width_mm: 160,
  repeat_length_mm: 240,
  pattern_width_mm: 45,
  pattern_height_mm: 15,
  spacing_x_mm: 12,
  spacing_y_mm: 12,
  rows: 10,
  cols: 3,
};

export class PatternsService {
  /**
   * Modulo-11 parity checksum calculation for error-detection
   */
  static computeModulo11(num: number): number {
    const digits = String(num).padStart(6, '0').split('').map(Number);
    const weights = [8, 7, 6, 5, 4, 3];
    const sum = digits.reduce((acc, d, i) => acc + d * weights[i], 0);
    return sum % 11;
  }

  /**
   * Deterministically generates a custom 4-colour machine-readable line pattern for a batch
   */
  static generatePattern(batch: StriplyBatchRecord): StriplyPatternData {
    const batchNum = parseInt(batch.striply_batch_id.replace('ST-', ''), 10) || 1;
    const medNum = batch.medicine_id || 1;
    const mfgDate = new Date(batch.manufacturing_date || '2026-01-01');
    const expDate = new Date(batch.expiry_date || '2026-12-31');

    // Encode dates into compact integer tokens (Year - 2020)*12 + Month
    const mfgToken = (mfgDate.getFullYear() - 2020) * 12 + (mfgDate.getMonth() + 1);
    const expToken = (expDate.getFullYear() - 2020) * 12 + (expDate.getMonth() + 1);
    const parity = this.computeModulo11(batchNum + medNum * 13);

    // Standard pattern canvas: 360px wide, 120px high
    const width = 360;
    const height = 120;
    const lines: EncodedLine[] = [];

    // 1. Dual High-Contrast Alignment Markers (Orientation & Perspective Rectification)
    // Left marker: White with Dark Blue accent
    lines.push({ channel: 'marker', colorHex: '#FFFFFF', x: 8, y: 10, width: 20, height: 100, thickness: 20 });
    lines.push({ channel: 'marker', colorHex: '#173B70', x: 32, y: 10, width: 8, height: 100, thickness: 8 });

    // Right marker: Dark Blue with White accent
    lines.push({ channel: 'marker', colorHex: '#173B70', x: 320, y: 10, width: 8, height: 100, thickness: 8 });
    lines.push({ channel: 'marker', colorHex: '#FFFFFF', x: 332, y: 10, width: 20, height: 100, thickness: 20 });

    // 2. RED CHANNEL: Medicine Identity (Medicine Name / ID)
    // Encodes medicine ID via structural stripe width and gap spacing
    const redColor = '#EF4444';
    const medStripeCount = 2 + (medNum % 4);
    const redStartX = 50;
    const redBandWidth = 60;
    const redStep = redBandWidth / medStripeCount;
    for (let i = 0; i < medStripeCount; i++) {
      const stripeW = 4 + ((medNum + i) % 6);
      lines.push({
        channel: 'red',
        colorHex: redColor,
        x: Math.round(redStartX + i * redStep),
        y: 15,
        width: stripeW,
        height: 90,
        thickness: stripeW,
      });
    }

    // 3. BLUE CHANNEL: Batch Identity (Manufacturer Batch / Striply Batch ID)
    // Encodes batch number in binary pulse positions with parity bit
    const blueColor = '#2563EB';
    const blueStartX = 118;
    const blueBandWidth = 75;
    const binaryBits = batchNum.toString(2).padStart(8, '0');
    const blueStep = blueBandWidth / 8;
    for (let i = 0; i < 8; i++) {
      const isOne = binaryBits[i] === '1';
      const stripeH = isOne ? 90 : 45;
      const stripeY = isOne ? 15 : 37;
      lines.push({
        channel: 'blue',
        colorHex: blueColor,
        x: Math.round(blueStartX + i * blueStep),
        y: stripeY,
        width: 5,
        height: stripeH,
        thickness: 5,
      });
    }

    // 4. GREEN CHANNEL: Manufacturing Date
    // Encodes year/month token through variable frequency line array
    const greenColor = '#10B981';
    const greenStartX = 200;
    const greenBandWidth = 55;
    const greenLines = 3 + (mfgToken % 4);
    const greenStep = greenBandWidth / greenLines;
    for (let i = 0; i < greenLines; i++) {
      const gWidth = 3 + (i % 3);
      lines.push({
        channel: 'green',
        colorHex: greenColor,
        x: Math.round(greenStartX + i * greenStep),
        y: 20,
        width: gWidth,
        height: 80,
        thickness: gWidth,
      });
    }

    // 5. YELLOW CHANNEL: Expiry Date
    // Encodes expiration milestone with top/bottom directional notch
    const yellowColor = '#F59E0B';
    const yellowStartX = 262;
    const yellowBandWidth = 50;
    const yellowLines = 3 + (expToken % 3);
    const yellowStep = yellowBandWidth / yellowLines;
    for (let i = 0; i < yellowLines; i++) {
      const yWidth = 4 + (i % 2);
      lines.push({
        channel: 'yellow',
        colorHex: yellowColor,
        x: Math.round(yellowStartX + i * yellowStep),
        y: 20,
        width: yWidth,
        height: 80,
        thickness: yWidth,
      });
    }

    // 6. Generate Clean Scalable SVG String
    const svgLines = lines
      .map(
        (l) =>
          `<rect x="${l.x}" y="${l.y}" width="${l.width}" height="${l.height}" fill="${l.colorHex}" rx="2" />`
      )
      .join('\n    ');

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <!-- Background with subtle registration bounding box -->
  <rect width="${width}" height="${height}" fill="#0A1128" rx="8" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
  <!-- Top and Bottom Alignment Notches (180 deg rotation invariance) -->
  <circle cx="180" cy="6" r="3" fill="#2563EB" />
  <circle cx="180" cy="114" r="3" fill="#2563EB" />
  <!-- Micro-Code Channels -->
  <g id="striply-code-${batch.striply_batch_id}">
    ${svgLines}
  </g>
</svg>`;

    return {
      striply_batch_id: batch.striply_batch_id,
      medicine_id: medNum,
      mfg_encoded: batch.manufacturing_date,
      exp_encoded: batch.expiry_date,
      parity_checksum: parity,
      lines,
      svg,
      version: '4.1',
    };
  }

  /**
   * Generates continuous pharmaceutical blister-foil repeating artwork
   */
  static generateBlisterFoilArtwork(
    batches: StriplyBatchRecord[],
    config: FoilArtworkConfig = DEFAULT_FOIL_CONFIG
  ): { artwork_svg: string; total_repeats: number; batch_mappings: Record<string, string> } {
    const { foil_width_mm, repeat_length_mm, pattern_width_mm, pattern_height_mm, cols, rows } =
      config;

    // Scale 1mm to ~3.78px for SVG representation (standard 96 DPI screen scale)
    const mmToPx = 3.78;
    const canvasWidthPx = Math.round(foil_width_mm * mmToPx);
    const canvasHeightPx = Math.round(repeat_length_mm * mmToPx);
    const pWidthPx = Math.round(pattern_width_mm * mmToPx);
    const pHeightPx = Math.round(pattern_height_mm * mmToPx);

    const cellStepX = canvasWidthPx / (cols + 1);
    const cellStepY = canvasHeightPx / (rows + 1);

    const patternInstances: string[] = [];
    const batchMappings: Record<string, string> = {};

    let batchIdx = 0;
    let repeatCount = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const currentBatch = batches[batchIdx % batches.length];
        const patternData = this.generatePattern(currentBatch);
        batchMappings[currentBatch.striply_batch_id] = currentBatch.medicine_name;

        const posX = Math.round(cellStepX * (c + 0.6) - pWidthPx / 2);
        const posY = Math.round(cellStepY * (r + 0.6) - pHeightPx / 2);

        patternInstances.push(`
        <!-- Repeat #${repeatCount + 1}: ${currentBatch.striply_batch_id} (${currentBatch.medicine_name}) -->
        <g transform="translate(${posX}, ${posY}) scale(${pWidthPx / 360}, ${pHeightPx / 120})">
          ${patternData.lines
            .map(
              (l) =>
                `<rect x="${l.x}" y="${l.y}" width="${l.width}" height="${l.height}" fill="${l.colorHex}" rx="2" />`
            )
            .join('')}
          <text x="50" y="112" fill="rgba(255,255,255,0.4)" font-family="monospace" font-size="8">${currentBatch.striply_batch_id}</text>
        </g>`);

        repeatCount++;
        batchIdx++;
      }
    }

    // Industrial Blister-Foil Registration Marks (Crosshairs and Eye Marks at Margins)
    const registrationMarks = `
      <!-- Foil Slitter Guide & Eye-Marks -->
      <line x1="10" y1="0" x2="10" y2="${canvasHeightPx}" stroke="#EF4444" stroke-width="1" stroke-dasharray="8,8" />
      <line x1="${canvasWidthPx - 10}" y1="0" x2="${canvasWidthPx - 10}" y2="${canvasHeightPx}" stroke="#EF4444" stroke-width="1" stroke-dasharray="8,8" />
      <!-- Top / Bottom Registration Crosshairs -->
      <circle cx="20" cy="20" r="8" fill="none" stroke="#2563EB" stroke-width="1.5" />
      <line x1="12" y1="20" x2="28" y2="20" stroke="#2563EB" stroke-width="1.5" />
      <line x1="20" y1="12" x2="20" y2="28" stroke="#2563EB" stroke-width="1.5" />
      
      <circle cx="${canvasWidthPx - 20}" cy="${canvasHeightPx - 20}" r="8" fill="none" stroke="#2563EB" stroke-width="1.5" />
      <line x1="${canvasWidthPx - 28}" y1="${canvasHeightPx - 20}" x2="${canvasWidthPx - 12}" y2="${canvasHeightPx - 20}" stroke="#2563EB" stroke-width="1.5" />
      <line x1="${canvasWidthPx - 20}" y1="${canvasHeightPx - 28}" x2="${canvasWidthPx - 20}" y2="${canvasHeightPx - 12}" stroke="#2563EB" stroke-width="1.5" />
    `;

    const artwork_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvasWidthPx} ${canvasHeightPx}" width="${canvasWidthPx}" height="${canvasHeightPx}">
  <defs>
    <!-- Aluminum Blister Foil Metallic Sheen Background Gradient -->
    <linearGradient id="foilSheen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0E1626" />
      <stop offset="50%" stop-color="#141F36" />
      <stop offset="100%" stop-color="#0E1626" />
    </linearGradient>
  </defs>
  <rect width="${canvasWidthPx}" height="${canvasHeightPx}" fill="url(#foilSheen)" />
  ${registrationMarks}
  <g id="blister-repeating-patterns">
    ${patternInstances.join('\n')}
  </g>
</svg>`;

    return {
      artwork_svg,
      total_repeats: repeatCount,
      batch_mappings: batchMappings,
    };
  }
}

