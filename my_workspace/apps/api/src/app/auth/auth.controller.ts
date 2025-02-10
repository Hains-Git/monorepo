import { Post, Get, Res, Req, UnauthorizedException, Body, Query } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

import { isValidClient } from '@my-workspace/prisma_cruds';

@Controller('oauth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService
  ) {}

  @Get('authorize')
  async authorize(
    @Query()
    query: { client_id: string; redirect_uri: string; response_type: string; user_id: string },
    @Req() req: Request,
    @Res() res: Response
  ) {
    console.log('query', query);

    const { client_id: clientId, redirect_uri: redirectUri, user_id: userId } = query;

    const client = await this.prisma.oauth_clients.findUnique({ where: { client_id: clientId } });

    if (!client) {
      return res.status(400).send('Client not found');
    }

    const code = await this.authService.generateAuthorizationCode(Number(userId), clientId);

    return res.redirect(`${redirectUri}?code=${code}`);
  }

  @Post('token')
  async token(
    @Body()
    body: {
      grant_type: string;
      code?: string;
      refresh_token?: string;
      client_id: string;
      client_secret: string;
    }
  ) {
    console.log('controller:token', body);

    const isValid = await isValidClient(body.client_id, body.client_secret);
    console.log('isValid', isValid);
    if (!isValid) {
      throw new UnauthorizedException('Invalid client credentials');
    }

    if (body.grant_type === 'authorization_code' && body.code) {
      const { accessToken, refreshToken, user } = await this.authService.exchangeAuthorizationCode(body.code);
      return { access_token: accessToken, refresh_token: refreshToken, user };
    }

    if (body.grant_type === 'refresh_token' && body.refresh_token) {
      const accessToken = await this.authService.refreshAccessToken(body.refresh_token);
      return { access_token: accessToken };
    }

    throw new UnauthorizedException('Invalid grant type or missing parameters.');
  }

  @Post('login')
  async login(@Body() loginCredentials: LoginDto) {
    // Handle login logic
    const username = loginCredentials.username;
    const password = loginCredentials.password;

    const [isValidCredentials, user] = await this.authService.checkCredentials(username, password);

    if (!isValidCredentials || !user) {
      throw new UnauthorizedException('Invalid login credentials');
    }

    // const authroizeUrl = new URL('http://localhost:3020/api/oauth/authorize');
    // authroizeUrl.searchParams.append('client_id', process.env.DIENSTPLANER_CLIENT_ID);
    // authroizeUrl.searchParams.append('redirect_uri', 'http://localhost:3020/api/oauth/token');
    // authroizeUrl.searchParams.append('response_type', 'code');
    // authroizeUrl.searchParams.append('user_id', String(user.id));
    // return res.redirect(authroizeUrl.toString());

    const code = await this.authService.generateAuthorizationCode(user.id, process.env.DIENSTPLANER_CLIENT_ID);
    const { accessToken, refreshToken } = await this.authService.exchangeAuthorizationCode(code);

    console.log({
      now: new Date(),
      accessToken,
      refreshToken,
      user
    });

    return { message: 'Login successful', accessToken, refreshToken, user };
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
