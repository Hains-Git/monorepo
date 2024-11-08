#!/bin/bash

echo "Starting entry.sh in Path: $(pwd)"
# apt-get updage
# apt-get install net-tools -y

npm install --force
npx prisma generate

# Development
npx nx serve hains --verbose

# Production
# npx nx build hains --prod --verbose
# cd dist/apps/hains
# npx next start -p 3010
