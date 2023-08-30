import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { last } from 'rxjs';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
