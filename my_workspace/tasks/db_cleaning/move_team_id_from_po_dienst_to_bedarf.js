console.log("Move Team-Id from Po-Dienst to Bedarf/Bedarfseintrag...");
const { PrismaClient } = require('@prisma/client');

run().catch(err => console.log(err));
async function run() {
  console.log("Starting Cleaning...");
  const prismaDb = new PrismaClient();

  const getData = async (key, cursorId = undefined) => {
    const include =  {
      po_diensts: true
    };
    if(key === "bedarfs_eintrags") {
      include.dienstbedarves = true;
    }
    return await prismaDb[key].findMany({
      take: 1000,
      where: {
        team_id: null
      },
      include: include,
      orderBy: {
        id: "asc"
      },
      cursor: cursorId ? { id: cursorId } : undefined
    });
  }

  const updateBedarf = async (key) => {
    let data = await getData(key);
    const teamKey = key === "dienstbedarves" ? "po_diensts" : "dienstbedarves";
    while(data.length > 0) {
      const l = data.length;
      console.log(`Found ${l} ${key} without team_id`);
      for(let i = 0; i < l; i++) {
        const item = data[i];
        if(!item[teamKey]?.team_id) {
          console.log(`${teamKey} ${item[teamKey].id} has no Team`);
          return false;
        }
        if(i % 100 === 0) console.log(`Updating ${key} ${item.id} with Team ${item[teamKey].team_id}`);
        await prismaDb[key].update({
          where: {
            id: item.id
          },
          data: {
            team_id: item[teamKey].team_id
          }
        });
      }
      const lastItem = data[data.length - 1];
      data = await getData(key, lastItem.id);
    }
  }

  updateBedarf("dienstbedarves");
  updateBedarf("bedarfs_eintrags");
  
  console.log("Job finished!");
}