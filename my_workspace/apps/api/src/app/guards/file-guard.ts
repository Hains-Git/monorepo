import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { _user } from '@my-workspace/prisma_cruds';

@Injectable()
export class FileGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let userId = request.query.user_id;
    // TODO: dateityp react -> rails -> nestjs
    // let dateiTypId = request.query.datei_typ_id;

    if (!userId) {
      console.error('User ID is required');
      return false;
    }

    userId = Number(userId);

    const user = await _user.findOne(
      { where: { id: userId } },
      {
        user_gruppes: true
      }
    );

    const userGruppeIds = user.user_gruppes.map((ug) => ug.gruppe_id);

    // check in db
    const allowedGruppeIds = [1, 2, 3];
    const hasAccess = allowedGruppeIds.some((gruppeId) => userGruppeIds.includes(gruppeId));

    console.log('User ID:', userId, 'has access:', hasAccess, userGruppeIds);

    return hasAccess;
  }
}
