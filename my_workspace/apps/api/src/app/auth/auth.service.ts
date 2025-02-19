import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { addMinutes, isAfter } from 'date-fns';
import { PrismaService } from '../prisma/prisma.service';

import {
  checkUserCredentials,
  createRefreshToken,
  createAccessToken,
  isAccessTokenInDb,
  getUserById
} from '@my-workspace/prisma_cruds';
import { users } from '@prisma/client';
import { newDate } from '@my-workspace/utils';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  async generateAuthorizationCode(userId: number, clientId: string): Promise<string> {
    const payload = { userId, clientId };
    const expiresAt = addMinutes(newDate(), 10); // Set expiration to 10 minutes from now

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

  async deleteAuthorizationCode(id: number) {
    await this.prisma.oauth_authorization_codes.delete({
      where: {
        id
      }
    });
  }

  async exchangeAuthorizationCode(code: string): Promise<{ accessToken: string; refreshToken: string; user: users }> {
    const authCode = await this.prisma.oauth_authorization_codes.findFirst({
      where: {
        code
      }
    });

    if (!authCode || isAfter(newDate(), authCode.expires_at)) {
      throw new UnauthorizedException('Invalid or expired authorization code.');
    }

    const userId = authCode.user_id;
    const clientId = authCode.client_id;
    const user = await getUserById(userId, { account_info: true });

    const accessToken = await this.generateAccessToken(userId, clientId);
    const refreshToken = await this.generateRefreshToken(userId, clientId);

    // Clean up: delete the authorization code
    await this.deleteAuthorizationCode(authCode.id);

    // Save the refresh token
    const decodedRefreshToken = this.jwtService.decode(refreshToken);
    const refreshExpiresAt = newDate(decodedRefreshToken.exp * 1000);
    const decodedAccessToken = this.jwtService.decode(accessToken);
    const accessExpiresAt = newDate(decodedAccessToken.exp * 1000);

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

    return { accessToken, refreshToken, user };
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const { userId, clientId } = this.jwtService.verify(refreshToken);

      const tokenRecord = await this.prisma.oauth_refresh_tokens.findUnique({
        where: { token: refreshToken }
      });

      const accessToken = await this.generateAccessToken(userId, clientId);

      await createAccessToken(
        userId,
        clientId,
        tokenRecord.id,
        accessToken,
        tokenRecord.scopes,
        tokenRecord.expires_at
      );

      return accessToken;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('refresh token expired');
      } else {
        throw new UnauthorizedException();
      }
    }
  }

  async validateUser(accessToken: string): Promise<any> {
    try {
      this.jwtService.verify(accessToken);
    } catch (error) {
      console.error('validateUser error', error, accessToken);
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('access token expired');
      } else {
        throw new UnauthorizedException();
      }
    }

    const accessTokenInDb = await isAccessTokenInDb(accessToken);

    if (!accessTokenInDb) {
      throw new UnauthorizedException();
    }

    return true;
  }

  async generateRefreshToken(userId: number, clientId: number | string): Promise<string> {
    const payload = { userId, clientId };
    return this.jwtService.sign(payload, { expiresIn: '7d' }); // Set expiration to 30 days
  }

  async generateAccessToken(userId: number, clientId: number | string): Promise<string> {
    const payload = { userId, clientId };
    return this.jwtService.sign(payload, { expiresIn: '4h' }); // Token valid for 4 hour
  }

  async checkCredentials(username: string, password: string) {
    return await checkUserCredentials(username, password);
  }
}
