import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GlobalAuthGuard extends AuthGuard('oauth2') implements CanActivate {
  canActivate(context: ExecutionContext) {
    console.log('GlobalAuthGuard:canActivate');
    const request = context.switchToHttp().getRequest();
    const url = request.url;

    console.log('GlobalAuthGuard:url', url);

    // Allow access to login, register, and authorize routes
    if (
      url.startsWith('/api/oauth/login') ||
      url.startsWith('/api/oauth/register') ||
      url.startsWith('/api/oauth/authorize') ||
      url.startsWith('/api/oauth/token')
    ) {
      return true;
    }

    return super.canActivate(context) as boolean;
  }
}
