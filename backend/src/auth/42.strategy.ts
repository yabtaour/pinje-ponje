import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-42";
import { config } from 'dotenv';
import { JwtAuthService } from './jwt.service';

config(); // This loads the .env file

const uid = process.env.UID;
const sid = process.env.SECRET;

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
    constructor(private readonly jwtAuthService: JwtAuthService, private readonly userService: UserService) {
        super({
            clientID: uid,
            clientSecret: sid,
            callbackURL: "http://localhost:3000/auth/42/callback",
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void): Promise<void> {
      try {
        let user = null;
        

      } catch (error){
        done(error)
      }
    }
}