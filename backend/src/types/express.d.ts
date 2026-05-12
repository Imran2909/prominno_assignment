import type { AuthPayload } from './roles.js';

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
      validatedQuery?: Record<string, unknown>;
    }
  }
}

export {};
