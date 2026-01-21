import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Async Handler Wrapper
 * Eliminates try-catch boilerplate in async route handlers
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
