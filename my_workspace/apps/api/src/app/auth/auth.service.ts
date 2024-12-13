import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { addMinutes, addDays, isAfter } from 'date-fns';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  // Generate authorization code using JwtService
  async generateAuthorizationCode(userId: number, clientId: number): Promise<string> {
    const payload = { userId, clientId };
    const expiresAt = addMinutes(new Date(), 10); // Set expiration to 10 minutes from now

    const code = this.jwtService.sign(payload, {
      expiresIn: '10m' // Token valid for 10 minutes
    });

    // await this.prisma.authorizationCode.create({
    //   data: {
    //     code,
    //     expiresAt,
    //     userId,
    //     clientId
    //   }
    // });

    return code;
  }
  //
  // // Exchange authorization code for access token
  async exchangeAuthorizationCode(
    code: string,
    clientId: number
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // const authCode = await this.prisma.authorizationCode.findUnique({
    //   where: { code },
    //   include: { user: true }
    // });

    // if (!authCode || isAfter(new Date(), authCode.expiresAt)) {
    //   throw new UnauthorizedException('Invalid or expired authorization code.');
    // }

    // Create an access token
    const testUserId = 548;
    const testClientId = 'clientId';
    // const accessToken = await this.generateAccessToken(authCode.userId, authCode.clientId);
    const accessToken = await this.generateAccessToken(testUserId, testClientId);

    // Create a refresh token
    // const refreshToken = await this.generateRefreshToken(authCode.userId, authCode.clientId);
    const refreshToken = await this.generateRefreshToken(testUserId, testClientId);

    // Clean up: delete the authorization code
    // await this.prisma.authorizationCode.delete({ where: { id: authCode.id } });

    return { accessToken, refreshToken };
  }
  //
  //
  // // Refresh access token using a valid refresh token
  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      // const { userId, clientId } = this.jwtService.verify(refreshToken);

      // const tokenRecord = await this.prisma.refreshToken.findUnique({
      //   where: { token: refreshToken }
      // });

      // if (!tokenRecord || isAfter(new Date(), tokenRecord.expiresAt)) {
      //   throw new UnauthorizedException('Invalid or expired refresh token.');
      // }

      // Generate new access token
      const testUserId = 548;
      const testClientId = 'clientId';
      return await this.generateAccessToken(testUserId, testClientId);
      // return await this.generateAccessToken(userId, clientId);
    } catch (error) {
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

  //
  // Generate refresh token using JwtService
  async generateRefreshToken(userId: number, clientId: number | string): Promise<string> {
    const payload = { userId, clientId };
    return this.jwtService.sign(payload, { expiresIn: '30d' }); // Set expiration to 30 days
  }
  // Generate access token using JwtService
  async generateAccessToken(userId: number, clientId: number | string): Promise<string> {
    const payload = { userId, clientId };
    return this.jwtService.sign(payload, { expiresIn: '1h' }); // Token valid for 1 hour
  }
}
