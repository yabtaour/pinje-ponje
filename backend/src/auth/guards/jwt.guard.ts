import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthService } from "../jwt.service";

@Injectable()
export class JWTGuard implements CanActivate {
    constructor (
			private readonly jwtService: JwtAuthService,
			private readonly prisma: PrismaService
		) {}

	async canActivate(context: ExecutionContext) {
    	const request = context.switchToHttp().getRequest();
    	const headers = request.headers;
      	const token = headers.authorization;
      	if (!token) {
			throw new Error("No token detected");
    	}
		try {
			const decodedToken = await this.jwtService.verifyToken(token, context);
			if (!decodedToken || !decodedToken.sub) {
				console.log("Invalid Token");
				return false;
			}
			context.switchToHttp().getRequest().user = decodedToken;
			return true;
		} catch (error) {
			throw error;
		}
	}
}
