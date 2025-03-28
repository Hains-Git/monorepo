import { prismaDb } from '@my-workspace/prisma_hains';

class RolesMap {
  rolesMap: Map<string, string> = new Map();

  constructor() {
    prismaDb.gruppes.findMany().then((roles) => {
      roles.forEach((role) => {
        if (!role.name) return;
        const name = role.name.trim().replace('HAINS', '').trim().replace('Anästhesie HD', '').trim();
        this.rolesMap.set(name, role.name);
      });

      console.log('---roles', this.rolesMap.entries());
    });
  }
}

export const map = new RolesMap().rolesMap;
