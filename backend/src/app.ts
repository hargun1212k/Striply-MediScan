import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

import medicinesRouter from './modules/medicines/medicines.routes.js';
import batchesRouter from './modules/batches/batches.routes.js';
import patternsRouter from './modules/patterns/patterns.routes.js';
import inventoryRouter from './modules/inventory/inventory.routes.js';
import plannerRouter from './modules/planner/planner.routes.js';
import scansRouter from './modules/scans/scans.routes.js';
import recallsRouter from './modules/recalls/recalls.routes.js';

export const app = express();

// 1. Security Headers
app.use(helmet());

// 2. CORS Allowlist
app.use(
  cors({
    origin: env.CORS_ORIGINS.split(','),
    credentials: true,
  })
);

// 3. Body Parsing
app.use(express.json({ limit: '10mb' })); // Support base64 proof photos
app.use(express.urlencoded({ extended: true }));

// 4. Request Logging in Development
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 5. Health & Liveness Checks (Unauthenticated)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'striply-backend', timestamp: new Date().toISOString() });
});

app.get('/ready', (_req, res) => {
  res.json({ status: 'ready', database: 'supabase-connected' });
});

// 6. Domain API Routes
app.use('/api/v1/medicines', medicinesRouter);
app.use('/api/v1/batches', batchesRouter);
app.use('/api/v1/patterns', patternsRouter);
app.use('/api/v1/inventory', inventoryRouter);
app.use('/api/v1/planner', plannerRouter);
app.use('/api/v1/scans', scansRouter);
app.use('/api/v1/recalls', recallsRouter);

// 7. Central Error Handler
app.use(errorHandler);

