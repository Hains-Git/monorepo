import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Request, Response } from 'express';

@Injectable()
export class GlobalAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    console.log('GlobalAuthGuard:canActivate');
    const request = context.switchToHttp().getRequest() as Request;
    const url = request.url;
    const authorization = request.headers.authorization;
    const [type, bearerToken] = authorization?.split(' ') || [];
    const { accessToken } = request.body;
    const { access_token } = request.query;

    const token = bearerToken || accessToken || access_token;

    if ((type === 'Bearer' && token) || accessToken || access_token) {
      const haveAccess = await this.authService.validateUser(token);
      if (!haveAccess) {
        return false;
      }
      return true;
    }

    // if (!url.startsWith('/api/oauth/')) {
    //   rec_uril = request?.originalUrl;
    // } else {
    //   request.url = url + `&original_redirect_uri=${rec_uril}`;
    // }

    // Allow access to login, register, and authorize routes
    if (
      url.startsWith('/api/oauth/login') ||
      url.startsWith('/api/oauth/register') ||
      url.startsWith('/api/oauth/authorize') ||
      url.startsWith('/api/oauth/token')
    ) {
      return true;
    }

    return false;
  }
}
