console.log("Importing telefon from Joomla...");
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

run().catch(err => console.log(err));
async function run() {
  const filePath = '/app/tasks/files/telefon.csv';
  console.log(`Reading file from ${filePath}`);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const lines = fileContent.split('\n');
  const prismaDb = new PrismaClient();
  const l = lines.length;
  let lastLabel = null;
  for(let i = 0; i < l; i++) {
    const line = lines[i].trim();
    if (line === '') continue;
    let [name, telefon] = line.split(',');
    name = name.trim();
    telefon = telefon.trim();
    const isLabel = telefon === '';
    if(isLabel) {
      console.log(`Importing ${name} as label`);
      let label = await prismaDb.telefonliste_label.findFirst({
        where: {
          title: name
        }
      });
      if(label) console.log(`Label ${name} already exists!`, label);
      else {
        label = await prismaDb.telefonliste_label.create({
          data: {
            title: name,
            position: i
          }
        });
        console.log(`Created label ${name}`, label);
      }
      lastLabel = label;
    } else {
      console.log(`Importing ${name} with telefon ${telefon}`);
      const entry = await prismaDb.telefonliste_joomla.findFirst({
        where: {
          name: name,
          telefon: telefon
        }
      });
      if(entry) console.log(`Entry ${name}, ${telefon} already exists!`, entry);
      else {
        const data = {
          name: name,
          telefon: telefon,
          position: i
        };
        if(lastLabel) {
          data.telefonliste_label = {
            connect: {
              id: lastLabel.id
            }
          };
        }
        const entry = await prismaDb.telefonliste_joomla.create({
          data: data
        });
        console.log(`Created entry ${name}, ${telefon}`, entry);
      }
    }
  }
  console.log('Importing telefon from Joomla... done');
}