import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { config } from 'dotenv';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { JwtAuthService } from './jwt.service';

config();

const guid = process.env.GUID;
const gsid = process.env.GSECRET;
const gcback = process.env.GCALLBACK;

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly jwtService: JwtAuthService,
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {
        super({
        clientID: guid,
        clientSecret: gsid,
        callbackURL: gcback,
        scope: ['email', 'profile'],
        });
    }
    
    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<void> {
        const data = new Date().valueOf();
        const newUsername = profile.given_name + data.toString();
        const newUser = {
            email: profile.email,
            Hashpassword: null,
            googleId: profile.id,
            username: newUsername,
            profile: {},
        };
        const user = await this.authService.userCreateOrNot(newUser, "google");
        const token = await this.jwtService.generateToken(String(user.id));
        return done(null, { user, token });
    }
}