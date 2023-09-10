import { Module } from '@nestjs/common';
import { RoomController } from './rooms.controller';
import { RoomService } from './rooms.service';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthService } from 'src/auth/jwt.service';

@Module({
	imports: [AuthModule, UserModule],
	controllers: [RoomController],
	providers: [RoomService, JwtService, JwtAuthService],
})
export class RoomsModule {}
