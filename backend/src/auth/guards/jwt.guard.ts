import { ExecutionContext, Injectable } from "@nestjs/common";
import { CanActivate } from "@nestjs/common";
// import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { JwtAuthService } from "../jwt.service";

@Injectable()
export class JWTGuard implements CanActivate {
    constructor (private readonly jwtService: JwtAuthService) {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const headers = request.headers;
        const token = headers.authorization;
        if (!token) {
						console.log("No token detected");
            return Promise.resolve(false);
        }
				try {
					return await this.jwtService.verifyToken(token);
				} catch (error) {
					return false;
				}
		}
}