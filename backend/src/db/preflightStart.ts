import dotenv from 'dotenv';
import { runStartupPreflight } from '../utils/startupPreflight.js';

// Runs first in `npm start`, before db:migrate. Opens no database connection.
dotenv.config();
const result = runStartupPreflight();
if (!result.ok) {
  console.error(`[startup] ${result.reason}`);
  process.exit(1);
}
console.log('[startup] Preflight passed.');
