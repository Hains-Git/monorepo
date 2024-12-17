import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-oauth2';
import { AuthService } from '../auth.service';

@Injectable()
export class OAuth2Strategy extends PassportStrategy(Strategy, 'oauth2') {
  constructor(private readonly authService: AuthService) {
    console.log('OAuth2Strategy:constructor');
    super({
      authorizationURL: 'http://localhost:3020/api/oauth/authorize',
      tokenURL: 'http://localhost:3020/api/oauth/token',
      clientID: process.env.DIENSTPLANER_CLIENT_ID,
      clientSecret: 'client_secrect',
      callbackURL: 'http://localhost:3020/api/oauth/callback'
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const user = {
      access_token: accessToken,
      refresh_token: refreshToken,
      profile: profile
    };
    console.log('user', user);
    return done(null, user);
  }
}
