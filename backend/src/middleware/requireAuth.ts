import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin, createScopedClient } from '../config/supabase.js';

export interface AuthenticatedUser {
  id: string;
  email?: string;
  role: 'consumer' | 'pharmacist' | 'admin';
  org_id?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      supabase?: ReturnType<typeof createScopedClient>;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Missing or malformed Authorization header' },
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
      res.status(401).json({
        success: false,
        error: { code: 'TOKEN_INVALID', message: 'Invalid or expired session token' },
      });
      return;
    }

    // Fetch user profile role and organization ID
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role, org_id')
      .eq('id', user.id)
      .single();

    req.user = {
      id: user.id,
      email: user.email,
      role: profile?.role || 'consumer',
      org_id: profile?.org_id,
    };

    req.supabase = createScopedClient(token);
    next();
  } catch (err) {
    next(err);
  }
}

