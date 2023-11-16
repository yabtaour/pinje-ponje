import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtAuthService } from "../jwt.service";

@Injectable()
export class JWTGuard implements CanActivate {
    constructor (
			private readonly jwtService: JwtAuthService,
		) {}

	async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    const token = headers.authorization;
    if (!token)
			throw new HttpException("Token not found", HttpStatus.UNAUTHORIZED);
		const decodedToken = await this.jwtService.verifyToken(token, context);
		if (!decodedToken || !decodedToken.sub)
		{
			throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);
		}
		context.switchToHttp().getRequest().user = decodedToken;
		return true;
	}
}
