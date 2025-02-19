import { Prisma } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';
import * as bcrypt from 'bcrypt';

export async function getUserById<TInclude extends Prisma.usersInclude>(id: number, include?: TInclude) {
  const result = await prismaDb.users.findUnique({
    where: {
      id: id
    },
    include
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
