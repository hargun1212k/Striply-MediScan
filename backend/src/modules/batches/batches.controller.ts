import { Request, Response, NextFunction } from 'express';
import { BatchesService, BatchRegistrationInput } from './batches.service.js';

export async function registerBatch(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input: BatchRegistrationInput = req.body;

    if (!input.medicine_name || !input.manufacturer_batch_number || !input.expiry_date) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'medicine_name, manufacturer_batch_number, and expiry_date are required' },
      });
      return;
    }

    const batch = await BatchesService.registerBatch(input);
    res.status(201).json({ success: true, data: batch });
  } catch (err) {
    next(err);
  }
}

export async function registerMultipleBatches(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const entries: BatchRegistrationInput[] = req.body.entries;

    if (!Array.isArray(entries) || entries.length === 0) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'entries array is required and must not be empty' },
      });
      return;
    }

    const batches = await BatchesService.registerMultipleBatches(entries);
    res.status(201).json({
      success: true,
      count: batches.length,
      data: batches,
    });
  } catch (err) {
    next(err);
  }
}

export async function getBatchByStriplyId(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const striplyBatchId = String(req.params.striplyBatchId);
    const batch = await BatchesService.getBatchByStriplyId(striplyBatchId);

    if (!batch) {
      res.status(404).json({
        success: false,
        error: { code: 'BATCH_NOT_FOUND', message: `No registered batch found for ID: ${striplyBatchId}` },
      });
      return;
    }

    res.json({ success: true, data: batch });
  } catch (err) {
    next(err);
  }
}

export async function updateExistingBatchStock(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const striplyBatchId = String(req.params.striplyBatchId);
    const { added_quantity } = req.body;

    const qty = Number(added_quantity);
    if (isNaN(qty) || qty <= 0) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_QUANTITY', message: 'added_quantity must be a positive number' },
      });
      return;
    }

    const result = await BatchesService.updateExistingBatchStock(striplyBatchId, qty);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
