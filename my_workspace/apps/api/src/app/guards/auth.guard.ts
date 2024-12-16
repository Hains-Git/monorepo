import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class GlobalAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(context: ExecutionContext) {
    console.log('GlobalAuthGuard:canActivate');
    const request = context.switchToHttp().getRequest();
    const url = request.url;
    const authorization = request.headers.authorization;
    const [type, token] = authorization?.split(' ') || [];

    if (type === 'Bearer' && token) {
      this.authService.validateUser(
        // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU0OCwiY2xpZW50SWQiOiJjbGllbnRJZCIsImlhdCI6MTczMzkyNzUyNCwiZXhwIjoxNzMzOTMxMTI0fQ.T-Fxa3VLQetsLhqQV43I1RWQqMaK5kwK2jn4FBNBKV4'
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU0OCwiY2xpZW50SWQiOiJjbGllbnRJZCIsImlhdCI6MTczMzkyODQwNCwiZXhwIjoxNzMzOTMyMDA0fQ.YIkQsyWuMW5y7FQu3VKZT5q6E6x86A4o500gsFDAhQ8'
      );
      // this.authService.validateUser(token);
      // return true;
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
