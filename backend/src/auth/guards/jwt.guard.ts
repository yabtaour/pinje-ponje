import { ExecutionContext, Injectable } from "@nestjs/common";
import { CanActivate } from "@nestjs/common";
// import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { JwtAuthService } from "../jwt.service";
import { PrismaService } from "src/prisma/prisma.service";
import { decode } from "punycode";
import { th } from "@faker-js/faker";

@Injectable()
export class JWTGuard implements CanActivate {
    constructor (
			private readonly jwtService: JwtAuthService,
			private readonly prisma: PrismaService
		) {}

	async canActivate(context: ExecutionContext) {
    	const request = context.switchToHttp().getRequest();
    	const headers = request.headers;
	  	// console.log("headers: ", headers);
      	const token = headers.authorization;
	  	console.log("token: ", token);
      	if (!token) {
			console.log("No token detected");
			throw new Error("No token detected");
			// return (false);
    	}
		try {
			console.log("trying to validate token");
			const decodedToken = await this.jwtService.verifyToken(token, context);
			console.log("decodedToken: ", decodedToken.sub);
			if (!decodedToken || !decodedToken.sub) {
				console.log("Invalid Token");
				return false;
			}
			context.switchToHttp().getRequest().user = decodedToken;
			console.log("token validated")
			console.log("decodedToken: ", decodedToken);
			return true;
		} catch (error) {
			// console.log("error: ", error);
			throw error;
		}
	}
}
