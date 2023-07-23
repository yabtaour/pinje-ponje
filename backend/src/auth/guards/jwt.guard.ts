import { ExecutionContext, Injectable } from "@nestjs/common";
import { CanActivate } from "@nestjs/common";
// import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { JwtAuthService } from "../jwt.service";

@Injectable()
export class JWTGuard implements CanActivate {
    constructor (private readonly jwtService: JwtAuthService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const headers = request.headers;
        const token = headers.authorization;

        if (!token) {
            return false;
        }

        try {
            const decodedToken = this.jwtService.verifyToken(token);
            console.log(decodedToken);
            // console.log(deco);
            return(true);
        } catch (err) {
            // console.log(err);
            return false
        }
        // console.log(headers);
        // console.log(headers.authorization);
        return true;
    }
}