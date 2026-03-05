import type { Request, Response, NextFunction } from 'express';

import { AuthError } from '../services/auth.service.js';
import { verifyAccessToken } from '../utils/jwt.js';

const extractBearerToken = (authorizationHeader?: string) => {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
};

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const token = extractBearerToken(req.header('authorization'));

  if (!token) {
    throw new AuthError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  try {
    const payload = verifyAccessToken(token);

    req.auth = {
      userId: payload.sub,
      email: payload.email,
      role: payload.role
    };

    next();
  } catch {
    throw new AuthError('Unauthorized', 401, 'UNAUTHORIZED');
  }
};
