import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../config/supabase.js';

export async function listMedicines(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { data, error } = await supabaseAdmin
      .from('medicines')
      .select('medicine_code, brand_name, generic_name, dosage_form, strength, manufacturer, usage_instructions')
      .order('medicine_code', { ascending: true });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getMedicineByCode(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const code = Number(req.params.code);
    const { data, error } = await supabaseAdmin
      .from('medicines')
      .select('*, batches(*)')
      .eq('medicine_code', code)
      .single();

    if (error || !data) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Medicine code ${code} not registered in master catalog` },
      });
      return;
    }
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

