// types/express/index.d.ts

import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        // add more user properties if needed, e.g. email, role, etc.
      };
    }
  }
}
