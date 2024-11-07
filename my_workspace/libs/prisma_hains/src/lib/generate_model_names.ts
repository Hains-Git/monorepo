import { readFileSync } from 'fs';
import { join } from 'path';

const schemaPath = join('prisma', 'schema.prisma');
const schema = readFileSync(schemaPath, 'utf-8');

const modelNames =
  schema.match(/model\s+(\w+)\s+{/g)?.map((match) => match.split(' ')[1]) || [];

const typeDefinition = `export type ModelNames = ${modelNames
  .map((name) => `'${name}'`)
  .join(' | ')};`;

const outputPath = join(__dirname, 'types', 'model-names.ts');
require('fs').writeFileSync(outputPath, typeDefinition);

console.log('Model names type generated:', typeDefinition);
