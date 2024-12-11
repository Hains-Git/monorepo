import { Post, Get, Res, Req, UnauthorizedException, Body, Query } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Controller('oauth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService
  ) {}

  @Get('authorize')
  async authorize(
    @Query('client_id') clientId: string,
    @Query('redirect_uri') redirectUri: string,
    @Query('response_type') responseType: string,
    @Query('access_token') accessToken: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    console.log('authorize', clientId, redirectUri, responseType, accessToken);
    // const client = await this.prisma.client.findUnique({ where: { clientId } });
    const client = await this.prisma.oauth_applications.findUnique({ where: { uid: clientId } });
    if (!client) {
      return res.status(400).send('Client not found');
    }

    const test = 'Bearer b983becd485deff0dbbce91b8a2b650571087b7e5210fdebf3378d4886379996';
    const authorization = req.headers.authorization;

    const isAuthenticated = authorization === test;

    if (!isAuthenticated) {
      // Implement your authentication check
      // return res.redirect(`/login?redirect_uri=${encodeURIComponent(redirectUri)}&client_id=${clientId}`);
      console.log('ggdg');
      return res.redirect(`http://localhost:3010/login`);
    }

    // User is authenticated, generate authorization code
    const userId = 548;
    const code = await this.authService.generateAuthorizationCode(userId, Number(clientId));

    // Redirect back to the client with the authorization code
    return res.redirect(`${redirectUri}?code=${code}`);
  }

  @Post('token')
  async token(@Body() body: { grant_type: string; code?: string; refresh_token?: string; client_id: number }) {
    console.log('controller:token', body);
    if (body.grant_type === 'authorization_code' && body.code) {
      const { accessToken, refreshToken } = await this.authService.exchangeAuthorizationCode(body.code, body.client_id);
      return { access_token: accessToken, refresh_token: refreshToken, token_type: 'Bearer' };
    }

    if (body.grant_type === 'refresh_token' && body.refresh_token) {
      const accessToken = await this.authService.refreshAccessToken(body.refresh_token);
      return { access_token: accessToken, token_type: 'Bearer' };
    }

    throw new UnauthorizedException('Invalid grant type or missing parameters.');
  }

  @Post('login')
  async login(@Body() loginDto: any) {
    // Handle login logic
    return { message: 'Login successful' };
  }

  @Post('register')
  async register(@Body() registerDto: any) {
    // Handle registration logic
    return { message: 'Registration successful' };
  }

  @Get('callback')
  async callback(@Req() req: Request, @Res() res: Response) {
    console.log('controller:callback', req?.query);
    return res.redirect('/');
  }
}
