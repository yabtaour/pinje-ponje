import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
// import { LocalStrategy } from './local.strategy';
import { FortyTwoStrategy } from './42.strategy';
// import passport from 'passport';
// import { AuthService } from './auth.service';
// import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: '42'}),
    // UserModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [/*AuthService, LocalStrategy*/ FortyTwoStrategy],
  exports: [/*AuthService*/],
})
export class AuthModule {}
