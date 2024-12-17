import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { addMinutes, addDays, isAfter } from 'date-fns';
import { PrismaService } from '../prisma/prisma.service';

import {
  checkUserCredentials,
  createRefreshToken,
  createAccessToken,
  isAccessTokenInDb,
  getUserById
} from '@my-workspace/prisma_hains';
import { users } from '@prisma/client';

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

    if (!authCode || isAfter(new Date(), authCode.expires_at)) {
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

    return { accessToken, refreshToken, user };
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const { userId, clientId } = this.jwtService.verify(refreshToken);

      const tokenRecord = await this.prisma.oauth_refresh_tokens.findUnique({
        where: { token: refreshToken }
      });

      if (!tokenRecord || isAfter(new Date(), tokenRecord.expires_at)) {
        throw new UnauthorizedException('expired refresh token.');
      }

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
      console.log('refreshAccessToken', error);
      throw new UnauthorizedException('Something went wrong.');
    }
  }

  async validateUser(accessToken: string): Promise<any> {
    try {
      const { exp } = this.jwtService.verify(accessToken);
      // const currentTimestamp = Math.floor(Date.now() / 1000);
      // const isExpired = exp < currentTimestamp;

      // if (isExpired) {
      //   throw new UnauthorizedException('access token expired');
      // }
    } catch (error) {
      // import { inspect } from 'util';
      //       console.log('Error instance:', inspect(error, { depth: null, colors: true }));

      console.log('Error instance:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      console.error('validateUser', {
        error,
        msg: error?.message,
        errMsg: error?.TokenExpiredError,
        type: typeof error,
        expiredAt: error?.expiredAt
      });
      throw new UnauthorizedException('access token expired');
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
