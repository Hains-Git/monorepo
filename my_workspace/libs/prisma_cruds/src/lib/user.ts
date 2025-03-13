import { Prisma } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';
import * as bcrypt from 'bcrypt';
import { DefaultArgs } from '@prisma/client/runtime/library';

export const omitUserFields: Prisma.usersOmit<DefaultArgs> | null = {
  encrypted_password: true,
  otp_secret_key: true,
  reset_password_sent_at: true,
  reset_password_token: true,
  remember_created_at: true,
  current_sign_in_ip: true,
  last_sign_in_ip: true,
  confirmation_sent_at: true,
  confirmation_token: true,
  confirmed_at: true,
  otp_counter: true,
  otp_enabled: true,
  unlock_token: true,
  unconfirmed_email: true,
  locked_at: true
};

export async function getUserById<TInclude extends Prisma.usersInclude>(id: number, include?: TInclude) {
  const result = await prismaDb.users.findUnique({
    omit: omitUserFields,
    where: {
      id: Number(id)
    },
    include
  });
  return result as Prisma.usersGetPayload<{ include: TInclude }> | null;
}

export async function findOne<TInclude extends Prisma.usersInclude | undefined>(
  condition: Omit<Prisma.usersFindUniqueArgs, 'include'>,
  include?: TInclude
) {
  const result = await prismaDb.users.findUnique({
    omit: omitUserFields,
    ...condition,
    include: include
  });
  return result as Prisma.usersGetPayload<{ include: TInclude }> | null;
}

async function getUserByLogin(username: string) {
  return await prismaDb.users.findFirst({
    where: {
      login: username
    },
    select: {
      id: true,
      name: true,
      login: true,
      email: true,
      admin: true,
      deactivated: true,
      account_info_id: true,
      sign_in_count: true,
      current_sign_in_at: true,
      last_sign_in_at: true,
      failed_attempts: true,
      encrypted_password: true,
      account_info: true
    }
  });
}

type TUserWithAccountInfo = Prisma.PromiseReturnType<typeof getUserByLogin>;

export async function checkUserCredentials(
  username: string,
  password: string
): Promise<[boolean, TUserWithAccountInfo | null]> {
  const user = await getUserByLogin(username);
  const isValid = bcrypt.compareSync(password, user?.encrypted_password || '');
  if (user) {
    user.encrypted_password = '';
  }

  return [isValid, user];
}
