import { Request, Response, NextFunction } from 'express';
import { PatternsService, FoilArtworkConfig, DEFAULT_FOIL_CONFIG } from './patterns.service.js';
import { BatchesService, StriplyBatchRecord } from '../batches/batches.service.js';

export async function generatePatternForBatch(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const striplyBatchId = String(req.params.striplyBatchId);
    const batch = await BatchesService.getBatchByStriplyId(striplyBatchId);

    if (!batch) {
      res.status(404).json({
        success: false,
        error: { code: 'BATCH_NOT_FOUND', message: `Batch ${striplyBatchId} not found` },
      });
      return;
    }

    const pattern = PatternsService.generatePattern(batch);
    res.json({ success: true, data: pattern });
  } catch (err) {
    next(err);
  }
}

export async function generateBlisterFoilArtwork(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { batch_ids, config } = req.body;

    let batches: StriplyBatchRecord[] = [];
    if (Array.isArray(batch_ids) && batch_ids.length > 0) {
      for (const id of batch_ids) {
        const b = await BatchesService.getBatchByStriplyId(id);
        if (b) batches.push(b);
      }
    }

    // If no specific batch IDs provided, load demo batches
    if (batches.length === 0) {
      const b1 = await BatchesService.getBatchByStriplyId('ST-000001');
      const b2 = await BatchesService.getBatchByStriplyId('ST-000002');
      if (b1) batches.push(b1);
      if (b2) batches.push(b2);
    }

    const foilConfig: FoilArtworkConfig = { ...DEFAULT_FOIL_CONFIG, ...(config || {}) };
    const artwork = PatternsService.generateBlisterFoilArtwork(batches, foilConfig);

    res.json({
      success: true,
      config: foilConfig,
      data: artwork,
    });
  } catch (err) {
    next(err);
  }
}
