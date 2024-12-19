#!/bin/bash

echo "Starting entry.sh in Path: $(pwd)"
apt-get update
apt-get install -y lsof net-tools
echo "Show open Ports"
lsof -i -P -n
export NX_DAEMON=true

npm install --force
# npx prisma format
npx prisma generate --watch &
# npx prisma generate
echo "Show netstat -tulnp"
netstat -tulnp

rm /tmp/f53b52ad6d21cceb72df/fp153.sock

echo "Show open Ports before nx run-many"
lsof -i -P -n

# Development
npx nx run-many --target=serve --skip-nx-cache --projects=hains,api --configuration=development --parallel --verbose

echo "Show open Ports after nx run-many"
lsof -i -P -n

# Production
# echo "Start build"
# npx nx run-many --target=build --configuration=production --projects=hains,api --parallel --verbose
# npx nx run-many --target=serve --configuration=production --projects=hains,api --parallel --verbose
