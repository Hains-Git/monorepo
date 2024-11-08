#!/bin/bash

echo "Starting entry.sh in Path: $(pwd)"

npm install --force
npx prisma generate

echo "Show all running node processes.."
ps aux | awk '/node/{print $2}'

# rm /tmp/f53b52ad6d21cceb72df/fp78.sock
rm /tmp/f53b52ad6d21cceb72df/fp79.sock

# npx nx run-many --target=serve --projects=hains,api --parallel --verbose
npx nx daemon start
npx nx serve api

# Production
# npx nx build hains --prod --verbose
# cd dist/apps/hains
# npx next start -p 3010
