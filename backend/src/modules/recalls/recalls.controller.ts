import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../config/supabase.js';

export async function getActiveRecalls(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { data, error } = await supabaseAdmin
      .from('batches')
      .select('*, medicines(brand_name, generic_name, manufacturer)')
      .eq('is_recalled', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function quarantineBatch(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const medicineCode = Number(req.params.medicineCode);
    const batchCode = Number(req.params.batchCode);

    // Update batch status to quarantined
    const { data, error } = await supabaseAdmin
      .from('batches')
      .update({ recall_status: 'quarantined' })
      .eq('medicine_code', medicineCode)
      .eq('batch_code', batchCode)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: {
        message: 'Batch successfully marked as quarantined and isolated from FEFO dispensing queue',
        batch: data,
      },
    });
  } catch (err) {
    next(err);
  }
}

