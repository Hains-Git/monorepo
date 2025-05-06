console.log("Move Team-Id from Po-Dienst to Bedarf/Bedarfseintrag...");
const { PrismaClient } = require('@prisma/client');

const updateBedarf = async (diensbedarf) => {
  const po_dienst = diensbedarf.po_diensts;
  if(!po_dienst) {
    console.log(`Dienstbedarf ${diensbedarf.id} has no Po-Dienst`);
    return;
  }
  if(!po_dienst.teams) {
    console.log(`Po-Dienst ${po_dienst.id} has no Team`);
    return;
  }
  const team = po_dienst.teams;
  if(!team) {
    console.log(`Po-Dienst ${po_dienst.id} has no Team`);
    return;
  }
  await prismaDb.dienstbedarves.update({
    where: {
      id: diensbedarf.id
    },
    data: {
      team_id: team.id
    }
  });
}

run().catch(err => console.log(err));
async function run() {
  console.log("Starting Cleaning...");
  const prismaDb = new PrismaClient();
  const diensbedarfe = await prismaDb.dienstbedarves.findMany({
    where: {
      team_id: null
    },
    include: {
      po_diensts: {
        include: {
          teams: true
        }
      }
    }
  });
  const l = diensbedarfe.length;
  for(let i = 0; i < l; i++) {
    await updateBedarf(diensbedarfe[i]);
  }

  const bedarfseinraege = await prismaDb.bedarfs_eintrags.findMany({
    where: {
      team_id: null
    },
    include: {
      po_diensts: {
        include: {
          teams: true
        }
      }
    }
  });
  const l2 = bedarfseinraege.length;
  for(let i = 0; i < l2; i++) {
    await updateBedarf(bedarfseinraege[i]);
  }
  
  console.log("Job finished!");
}