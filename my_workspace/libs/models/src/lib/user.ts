import { _user } from '@my-workspace/prisma_cruds';

export async function isRotationsPlaner(userId: number) {
  const user = await _user.getUserById(userId, {
    user_gruppes: {
      include: {
        gruppes: true
      }
    }
  });
  if (!user) return false;
  return user?.user_gruppes?.find((userGrouppes) => {
    return userGrouppes.gruppes?.name === ' Rotationsplaner Anästhesie HD';
  });
}
