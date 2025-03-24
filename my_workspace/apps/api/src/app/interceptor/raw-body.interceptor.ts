import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RawBodyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    // Multer puts parsed fields in request.body
    console.log('Raw Request Body (before validation):', JSON.stringify(request.body, null, 2));
    return next.handle();
  }
}
