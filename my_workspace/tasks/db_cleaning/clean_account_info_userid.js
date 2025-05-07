console.log("Cleaning user_id from Account-Info...");
const { PrismaClient } = require('@prisma/client');

run().catch(err => console.log(err));
async function run() {
  const prismaDb = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });
  const accounts = await prismaDb.account_infos.findMany({
    include: {
      user: true,
      mitarbeiter: true
    }
  });
  const usersWithoutAcc = await prismaDb.$queryRawUnsafe(`
    SELECT u.id, u.name 
    FROM users AS u
    WHERE u.id NOT IN (SELECT user_id FROM account_infos)
    OR u.account_info_id IS NULL
  `);
  console.log("users without Account-Info result: ", usersWithoutAcc.length, usersWithoutAcc);
  const l = accounts.length;
  console.log("Account-Infos: ", l);
  for(let i = 0; i < l; i++) {
    const acc = accounts[i];
    if(acc.user) {
      if(acc.user.account_info_id !== acc.id || (acc.user_id && acc.user.id !== acc.user_id)) {
        console.log(`Account-Info ${acc.id} (${acc.user_id}) has user_id ${acc.user.id}, has acc-id ${acc.user.account_info_id}`);
      }
      continue;
    }
    const user = usersWithoutAcc.find(u => u.id === acc.user_id);
    if(user) {
      console.log(`Account-Info not related to user`, acc.id, acc.mitarbeiter?.planname, "user", user?.id, user?.name);
    } else {
      console.log(`Account-Info without user`, acc.id, acc.mitarbeiter?.planname);
    }
  }
  console.log("Job finished!");
}