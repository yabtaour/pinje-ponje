import { HttpException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-42";
import { config } from 'dotenv';
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";
import { JwtAuthService } from "./jwt.service";
import { VerifiedCallback } from "passport-jwt";

config(); // This loads the .env file

const uid = process.env.UID;
const sid = process.env.SECRET;

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
    constructor(
      private readonly jwtService: JwtAuthService,
      private readonly authService: AuthService,
    ){
        super({
            clientID: uid,
            clientSecret: sid,
            callbackURL: "http://localhost:3000/auth/api",
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any, 
        done: VerifiedCallback
    ) {
      const newUser = {
        intraid: Number(profile.id),
        email: profile._json.email,
        Hashpassword: null,
        username: profile.username,
      };
      const user = await this.authService.userCreateOrNot(newUser, "42");
      const token = await this.jwtService.generateToken(String(user.id));
      return done(null, {user, token});
    }
}

//  INTRAID: id / _json.email / username