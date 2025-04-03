import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe, BadRequestException, HttpStatus } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FileUploadModule } from '../_modules/file-upload/file-upload.module';

@Module({
  imports: [FileUploadModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: false,
        disableErrorMessages: false,
        exceptionFactory: (validationErrors) => {
          // Collect all error messages from nested children
          const messages = validationErrors.flatMap((error) => {
            if (error.children?.length) {
              return error.children.map((child) => {
                const constraintKey = Object.keys(child.constraints)[0];
                return child.constraints[constraintKey];
              });
            }
            const constraintKey = Object.keys(error.constraints || {})[0];
            return error.constraints ? [error.constraints[constraintKey]] : [];
          });

          console.log('Validation Errors:', JSON.stringify(validationErrors, null, 2));

          return new BadRequestException({
            error: 'Bad Request',
            message: messages, // Array of all error messages
            statusCode: HttpStatus.BAD_REQUEST
          });
        }
      })
    }
  ]
})
export class UserModule {}
