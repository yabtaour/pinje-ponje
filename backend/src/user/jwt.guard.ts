import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class SimpleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Check for a custom header or any other condition you want to validate
    const hasCustomHeader = request.headers['x-custom-header'] === 'my-secret-key';

    return hasCustomHeader; // Return true if the custom header exists, otherwise return false
  }
}
