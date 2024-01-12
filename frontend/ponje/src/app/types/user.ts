import { Profile } from "./profile";

export type User = {
  friendOf: any;
  sentRequest: any;
  pendingRequest: any;
  id: number;
  username: String;
  password: String;
  email: String;
  intraid?: String;
  googleId?: String;
  twoFactor?: Boolean;
  twoFactorSecret?: String;
  status: String;
  winRate: number;
  accuracy: number;
  consitency: number;
  reflex: number;
  gamePoints: number;
  rank: number;
  level: number;
  experience: number;
  createdAt: Date;
  updatedAt: Date;
  profile: Profile;
};
