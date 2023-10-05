import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
// import { LocalStrategy } from '../local.strategy'; // Adjust the import path

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {} // Use string 'local' here
