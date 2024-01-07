import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtAuthService } from "../jwt.service";
import { PrismaService } from "src/prisma/prisma.service";
import { config } from 'dotenv';

config()

const VERIFICATION = process.env.VERIFICATION;

@Injectable()
export class JWTGuard implements CanActivate {
    constructor (
			private readonly jwtService: JwtAuthService,
			private readonly prismaService: PrismaService
		) {}

	async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
	const response = context.switchToHttp().getResponse();
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
		const user = this.prismaService.user.findUnique({
			where: {
				id: decodedToken.sub
			}
		});
		if (!user)
			throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);
		if ((await user).twoFactor === true) {
			if ((await user).isVerified === false) {
				response.redirect(VERIFICATION);
			}
		}
		return true;
	}
}
