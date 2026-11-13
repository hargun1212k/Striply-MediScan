import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../config/supabase.js';

export async function getStoreInventory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const orgId = req.user?.org_id;
    if (!orgId) {
      res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'User is not affiliated with a pharmacy organization' },
      });
      return;
    }

    const { data, error } = await supabaseAdmin
      .from('inventory_items')
      .select('*, medicines(brand_name, generic_name, strength), batches(batch_number_str, expiry_date, is_recalled)')
      .eq('org_id', orgId)
      .order('days_to_expiry', { ascending: true });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * FEFO (First Expiry, First Out) Dispatch Query
 * Resolves which batch of a requested medicine must be dispensed first to minimize expiration waste.
 */
export async function getFefoBatchToDispense(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const orgId = req.user?.org_id;
    const medicineCode = Number(req.query.medicine_code);
    const requestedQty = Number(req.query.quantity) || 1;

    if (!orgId || !medicineCode) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_REQUEST', message: 'org_id and medicine_code are required' },
      });
      return;
    }

    // Call PostgreSQL stored function for FEFO resolution
    const { data, error } = await supabaseAdmin.rpc('get_fefo_batch_for_dispensing', {
      p_org_id: orgId,
      p_medicine_code: medicineCode,
      p_requested_qty: requestedQty,
    });

    if (error) throw error;

    if (!data || data.length === 0) {
      res.status(404).json({
        success: false,
        error: { code: 'STOCKOUT', message: 'No un-recalled inventory available for this medicine' },
      });
      return;
    }

    res.json({
      success: true,
      data: {
        fefo_batch: data[0],
        rule_applied: 'First Expiry, First Out (FEFO)',
      },
    });
  } catch (err) {
    next(err);
  }
}

