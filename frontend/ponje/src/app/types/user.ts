import { Profile } from "./profile";

export type User = {
  id: number;
  password: null;
  email: string;
  intraid?: null;
  googleId?: string;
  twoFactor?: boolean;
  twoFactorSecret?: null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  profile?: Profile;
};
