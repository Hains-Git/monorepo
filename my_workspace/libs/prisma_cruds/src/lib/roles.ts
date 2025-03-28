import { prismaDb } from '@my-workspace/prisma_hains';

class RolesMap {
  rolesMap: Map<string, string> = new Map();

  constructor() {
    prismaDb.gruppes.findMany().then((roles) => {
      roles.forEach((role) => {
        if (!role.name) return;

        let name = role.name.trim();
        if (process.env['INSTANCE_NAME'] !== 'hains') {
          name = name.replace('HAINS', '').trim();
          name = name.replace('Anästhesie HD', '').trim();
        }

        this.rolesMap.set(name, role.name);
      });
    });
  }
}

export const map = new RolesMap().rolesMap;

console.log('---roles', map.entries());
