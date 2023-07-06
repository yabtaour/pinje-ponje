import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { UserModule } from './user/user.module';
import { UsersService } from './user/user.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [AppController],
  providers: [AuthService, UsersService, AppService],
})
export class AppModule {}
