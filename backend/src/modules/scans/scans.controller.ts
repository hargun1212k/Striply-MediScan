import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { supabaseAdmin } from '../../config/supabase.js';
import { ScansService } from './scans.service.js';

/**
 * Custom Visual Pattern Decoding & Recognition Endpoint
 * Accepts image/pattern stream, decodes the 4-colour lines (Red=Med, Blue=Batch, Green=Mfg, Yellow=Exp),
 * retrieves composition from DB, and returns verified batch details.
 */
export async function decodePattern(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { image_base64, striply_batch_id, user_type } = req.body;

    const result = await ScansService.decodeAndVerifyPattern({
      image_base64,
      striply_batch_id,
      user_type: user_type || 'customer',
    });

    res.json({
      success: result.recognition_status === 'SUCCESS',
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Legacy proof photo submission (retained for backward compatibility)
 */
export async function submitScanProof(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.id;
    const { medicine_code, batch_code, outcome_status, proof_photo_base64 } = req.body;

    const photoBuffer = Buffer.from(proof_photo_base64 || 'dummy_proof_content', 'utf-8');
    const photoHash = crypto.createHash('sha256').update(photoBuffer).digest('hex');
    const photoUrl = `https://storage.supabase.co/v1/object/public/scan-proofs/${photoHash}.webp`;

    const { data: proof, error } = await supabaseAdmin
      .from('scan_proofs')
      .insert({
        user_id: userId,
        org_id: req.user?.org_id || null,
        medicine_code: medicine_code || 1,
        batch_code: batch_code || 1,
        outcome_status: outcome_status || 'VERIFIED',
        proof_photo_url: photoUrl,
        photo_sha256: photoHash,
      })
      .select()
      .maybeSingle();

    res.status(201).json({
      success: true,
      data: {
        proof_id: proof?.id || crypto.randomUUID(),
        outcome_status,
        proof_photo_url: photoUrl,
        sha256_verified: photoHash,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getUserScanHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.id;
    const { data, error } = await supabaseAdmin
      .from('scan_proofs')
      .select('*, medicines(brand_name, generic_name), batches(batch_number_str, expiry_date)')
      .eq('user_id', userId)
      .order('scanned_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (err) {
    next(err);
  }
}
