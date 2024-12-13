import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { OAuth2Strategy } from './strategies/oauth';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'oauth2' }),
    JwtModule.register({
      secret: 'somesecretcode',
      signOptions: {
        expiresIn: 3600
      }
    })
  ],
  providers: [AuthService, OAuth2Strategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
