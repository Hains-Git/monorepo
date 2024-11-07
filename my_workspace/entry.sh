#!/bin/bash

echo "Starting entry.sh in Path: $(pwd)"

npm install --force
npx prisma generate
npx ts-node ./libs/prisma_hains/src/lib/generate_model_names.ts

echo "Show all running node processes"

# Development
npx nx serve hains --verbose

# Production
# npx nx build hains --prod --verbose
# cd dist/apps/hains
# npx next start -p 3010
