import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../config/supabase.js';

export async function createMedicinePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.id;
    const { medicine_code, batch_code, dosage_instruction, condition_tag, duration_days, reminder_times } = req.body;

    if (!userId || !medicine_code || !batch_code || !dosage_instruction) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Missing required plan fields' },
      });
      return;
    }

    // 1. Insert medicine plan
    const { data: plan, error: planError } = await supabaseAdmin
      .from('medicine_plans')
      .insert({
        user_id: userId,
        medicine_code,
        batch_code,
        dosage_instruction,
        condition_tag: condition_tag || 'General Treatment',
        duration_days: duration_days || 5,
      })
      .select()
      .single();

    if (planError) throw planError;

    // 2. Insert schedule reminders (e.g. 08:00 AM, 08:00 PM)
    const reminders = (reminder_times || ['08:00:00', '20:00:00']).map((time: string, idx: number) => ({
      plan_id: plan.id,
      reminder_time: time,
      label: idx === 0 ? 'Morning' : 'Evening',
      is_enabled: true,
    }));

    await supabaseAdmin.from('medicine_reminders').insert(reminders);

    // 3. Queue WhatsApp Plan Confirmation
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('phone_number, whatsapp_enabled')
      .eq('id', userId)
      .single();

    if (profile?.whatsapp_enabled && profile.phone_number) {
      await supabaseAdmin.from('whatsapp_queue').insert({
        recipient_phone: profile.phone_number,
        message_type: 'PLAN_CONFIRMATION',
        payload: {
          plan_id: plan.id,
          dosage: dosage_instruction,
          duration: `${duration_days || 5} days`,
          reminders: reminders.map((r: { label: string; reminder_time: string }) => `${r.label} at ${r.reminder_time}`).join(', '),
        },
      });
    }

    res.status(201).json({
      success: true,
      data: { plan, reminders },
    });
  } catch (err) {
    next(err);
  }
}

export async function getUserPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.id;
    const { data, error } = await supabaseAdmin
      .from('medicine_plans')
      .select('*, medicine_reminders(*), medicines(brand_name, generic_name, strength), batches(batch_number_str, expiry_date)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

