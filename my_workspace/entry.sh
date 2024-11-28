#!/bin/bash

echo "Starting entry.sh in Path: $(pwd)"
apt-get update
apt-get install -y lsof
echo "Show open Ports"
lsof -i -P -n
export NX_DAEMON=true

npm install --force
npx prisma generate

rm /tmp/f53b52ad6d21cceb72df/fp185.sock

# Development
npx nx run-many --target=serve --projects=hains,api --parallel --verbose
# npx nx serve hains --verbose &
# npx nx serve api --watch --verbose

echo "Show open Ports after nx run-many"
lsof -i -P -n

# Production
# npx nx build hains --prod --verbose
# cd dist/apps/hains
# npx next start -p 3010
