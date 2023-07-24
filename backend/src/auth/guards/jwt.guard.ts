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
						console.log("No token detected");
            return false;
        }

				this.jwtService.verifyToken(token)
				.then((verifiedToken) => {
					if (verifiedToken) {
						console.log('Token is valid:', verifiedToken);
						return true;
					} else {
						console.log('Couldnt verify token');
						return false;
					}
				})
				// .catch ((error) => {
				// 	console.log(error.message);
				// })
        // // console.log(headers);
        // // console.log(headers.authorization);
        // return true;
    }
}