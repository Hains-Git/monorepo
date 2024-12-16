import { prismaDb } from '../prisma-hains';

export async function createRefreshToken(
  userId: number,
  clientId: string,
  token: string,
  scopes: string[],
  expiresAt: Date
) {
  const now = new Date();

  const refreshToken = await prismaDb.oauth_refresh_tokens.create({
    data: {
      user_id: userId,
      client_id: clientId,
      token: token,
      scopes: scopes,
      created_at: now,
      updated_at: now,
      expires_at: expiresAt
    }
  });

  return refreshToken;
}

export async function createAccessToken(
  userId: number,
  clientId: string,
  refreshTokenId: number,
  token: string,
  scopes: string[],
  expiresAt: Date
) {
  const now = new Date();

  const accessToken = await prismaDb.oauth_access_tokens_new.create({
    data: {
      user_id: userId,
      client_id: clientId,
      refresh_token_id: refreshTokenId,
      token,
      scopes: scopes,
      created_at: now,
      updated_at: now,
      expires_at: expiresAt
    }
  });

  return accessToken;
}
