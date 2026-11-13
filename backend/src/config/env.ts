import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5000'),
  SUPABASE_URL: z.string().url().default('https://example.supabase.co'),
  SUPABASE_ANON_KEY: z.string().min(1).default('dummy_anon_key_for_dev'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).default('dummy_service_key_for_dev'),
  CORS_ORIGINS: z.string().default('http://localhost:3000,http://localhost:5173'),
  WHATSAPP_ENABLED: z.string().transform((v) => v === 'true').default('true'),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

