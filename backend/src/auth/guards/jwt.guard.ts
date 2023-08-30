import { ExecutionContext, Injectable } from "@nestjs/common";
import { CanActivate } from "@nestjs/common";
// import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { JwtAuthService } from "../jwt.service";
import { PrismaService } from "src/prisma/prisma.service";
import { decode } from "punycode";

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
				console.log("No token detected");
          return Promise.resolve(false);
      	}
			try {
				const decodedToken = await this.jwtService.verifyToken(token, context);
				console.log("decodedToken: ", decodedToken.sub);
				if (!decodedToken || !decodedToken.sub) {
					console.log("No decodedToken");
					return false;
				}
			context.switchToHttp().getRequest().user = decodedToken;
			return decodedToken;
			} catch (error) {
				return false;
			}
		}
}
