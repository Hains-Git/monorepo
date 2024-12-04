#!/bin/bash

echo "Starting entry.sh in Path: $(pwd)"
apt-get update
apt-get install -y lsof
echo "Show open Ports"
lsof -i -P -n
export NX_DAEMON=true

npm install --force
# npx prisma format
npx prisma generate --watch &
# npx prisma generate

rm /tmp/f53b52ad6d21cceb72df/fp184.sock

# Development
npx nx run-many --target=serve --projects=hains,api --configuration=development --parallel --verbose

echo "Show open Ports after nx run-many"
lsof -i -P -n

# Production
# echo "Start build"
# npx nx run-many --target=build --configuration=production --projects=hains,api --parallel --verbose
# npx nx run-many --target=serve --configuration=production --projects=hains,api --parallel --verbose
