import { Prisma, users } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';
import * as bcrypt from 'bcrypt';

type TUserWithAccountInfo = users & { account_info: any };

export async function getUserById<TInclude extends Prisma.usersInclude>(
  id: number,
  include?: TInclude
): Promise<Prisma.usersGetPayload<{ include: TInclude }> | null> {
  const result = await prismaDb.users.findUnique({
    where: {
      id: id
    },
    include
  });
  return result as Prisma.usersGetPayload<{ include: TInclude }> | null;
}

export async function checkUserCredentials(username: string, password: string): Promise<[boolean, users | null]> {
  const user = await prismaDb.users.findFirst({
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

  const isValid = bcrypt.compareSync(password, user?.encrypted_password || '');

  if (user && 'encrypted_password' in user) {
    delete (user as any)?.encrypted_password;
  }

  return [isValid, user as TUserWithAccountInfo];
}
