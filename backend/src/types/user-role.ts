export const USER_ROLES = {
  customer: 'customer',
  moderator: 'moderator',
  admin: 'admin'
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
