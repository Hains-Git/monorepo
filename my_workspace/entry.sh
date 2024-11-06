#!/bin/bash

echo "Starting entry.sh in Path: $(pwd)"

npm install --force
npx prisma generate

echo "Show all running node processes"
ps aux | awk '/node/{print $2}'

npx nx serve hains --verbose

# Production
# npx nx build hains --prod --verbose
# cd dist/apps/hains
# npx next start -p 3010
