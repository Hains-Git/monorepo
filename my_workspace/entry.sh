#!/bin/bash

echo "Starting entry.sh in Path: $(pwd)"
apt-get update
apt-get install -y lsof
echo "Show open Ports"
lsof -i -P -n -U
# export NX_DAEMON=true

rm /tmp/f53b52ad6d21cceb72df/fp452.sock

npm install --force

npm run prisma:check
npm run migrate:prod

# Development
npx nx run-many --target=serve --projects=hains,api --configuration=development --parallel --verbose -- --inspect


echo "Show open Ports after nx run-many"
lsof -i -P -n -U

# Production
# echo "Start build"
# npx nx run-many --target=build --configuration=production --projects=hains,api --parallel --verbose
# npx nx run-many --target=serve --configuration=production --projects=hains,api --parallel --verbose
