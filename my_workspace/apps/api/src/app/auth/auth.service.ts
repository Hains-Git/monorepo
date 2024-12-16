import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { addMinutes, addDays, isAfter } from 'date-fns';
import { PrismaService } from '../prisma/prisma.service';

import { checkUserCredentials, createRefreshToken, createAccessToken } from '@my-workspace/prisma_hains';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  async generateAuthorizationCode(userId: number, clientId: string): Promise<string> {
    const payload = { userId, clientId };
    const expiresAt = addMinutes(new Date(), 10); // Set expiration to 10 minutes from now

    const code = this.jwtService.sign(payload, {
      expiresIn: '10m' // Token valid for 10 minutes
    });

    await this.prisma.oauth_authorization_codes.create({
      data: {
        code,
        expires_at: expiresAt,
        user_id: userId,
        client_id: clientId
      }
    });

    return code;
  }

  async exchangeAuthorizationCode(code: string): Promise<{ accessToken: string; refreshToken: string }> {
    const authCode = await this.prisma.oauth_authorization_codes.findFirst({
      where: {
        code
      }
    });

    if (!authCode || isAfter(new Date(), authCode.expires_at)) {
      throw new UnauthorizedException('Invalid or expired authorization code.');
    }

    const userId = authCode.user_id;
    const clientId = authCode.client_id;

    const accessToken = await this.generateAccessToken(userId, clientId);
    const refreshToken = await this.generateRefreshToken(userId, clientId);

    // Clean up: delete the authorization code
    await this.prisma.oauth_authorization_codes.delete({
      where: {
        id: authCode.id
      }
    });

    // Save the refresh token
    const decodedRefreshToken = this.jwtService.decode(refreshToken);
    const refreshExpiresAt = new Date(decodedRefreshToken.exp * 1000);
    const decodedAccessToken = this.jwtService.decode(accessToken);
    const accessExpiresAt = new Date(decodedAccessToken.exp * 1000);

    const refreshTokenItem = await createRefreshToken(
      userId,
      clientId,
      refreshToken,
      decodedRefreshToken?.scopes,
      refreshExpiresAt
    );
    await createAccessToken(
      userId,
      clientId,
      refreshTokenItem.id,
      accessToken,
      decodedRefreshToken?.scopes,
      accessExpiresAt
    );

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const { userId, clientId } = this.jwtService.verify(refreshToken);

      const tokenRecord = await this.prisma.oauth_refresh_tokens.findUnique({
        where: { token: refreshToken }
      });

      // if (!tokenRecord || isAfter(new Date(), tokenRecord.expires_at)) {
      //   throw new UnauthorizedException('Invalid or expired refresh token.');
      // }

      // Generate new access token
      return await this.generateAccessToken(userId, clientId);
    } catch (error) {
      console.log('refreshAccessToken', error);
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }
  }

  async validateUser(accessToken: string): Promise<any> {
    console.log('service:validate', accessToken);
    const decoded = this.jwtService.decode(accessToken);
    const exp = decoded?.exp;
    const iat = decoded?.iat;
    console.log('decoded', decoded);
    console.log({
      iat: new Date(iat * 1000),
      exp: new Date(exp * 1000),
      now: new Date(),
      now_: new Date().getTimezoneOffset(),
      now__: Intl.DateTimeFormat().resolvedOptions().timeZone,
      nowH: new Date().getHours(),
      nowH2: new Date().getUTCHours(),
      now2: new Date().toUTCString(),
      now3: new Date().toLocaleString('en-US', { timeZone: 'Europe/Berlin' })
    });
    return true;
  }

  async generateRefreshToken(userId: number, clientId: number | string): Promise<string> {
    const payload = { userId, clientId };
    return this.jwtService.sign(payload, { expiresIn: '7d' }); // Set expiration to 30 days
  }

  async generateAccessToken(userId: number, clientId: number | string): Promise<string> {
    const payload = { userId, clientId };
    return this.jwtService.sign(payload, { expiresIn: '1h' }); // Token valid for 1 hour
  }

  async checkCredentials(username: string, password: string) {
    return await checkUserCredentials(username, password);
  }
}
