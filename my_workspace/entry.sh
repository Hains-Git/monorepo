#!/bin/bash

echo "Starting entry.sh in Path: $(pwd)"
# apt-get updage
# apt-get install net-tools -y

npm install --force
npx prisma generate

# rm /tmp/f53b52ad6d21cceb72df/fp79.sock

npx nx run-many --target=serve --projects=hains,api --parallel --verbose

# Production
# npx nx build hains --prod --verbose
# cd dist/apps/hains
# npx next start -p 3010
