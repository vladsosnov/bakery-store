import type { UserRole } from '@src/types/user-role';

export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phoneNumber: string;
  address: {
    zip: string;
    street: string;
    city: string;
  };
};
