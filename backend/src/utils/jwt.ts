import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import type { UserRole } from '../types/user-role.js';

type AccessTokenPayload = {
  sub: string;
  email: string;
  role: UserRole;
};

export const signAccessToken = (payload: AccessTokenPayload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '7d'
  });
};
