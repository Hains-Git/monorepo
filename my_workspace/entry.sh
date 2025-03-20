#!/bin/bash

echo "Starting entry.sh in Path: $(pwd)"
apt-get update
apt-get install -y lsof
# export NX_DAEMON=true
npm install --force

npm run prisma:check
npm run migrate:prod

connect(){
  echo "Trying to connect"
  # Development
  npx nx run-many --target=serve --projects=hains,api --configuration=development --parallel --verbose -- --inspect
  
  # Production
  # npx nx run-many --target=build --configuration=production --projects=hains,api --parallel --verbose
  # npx nx run-many --target=serve --configuration=production --projects=hains,api --parallel --verbose
}

check_eadrinuse(){
  echo "Checking EADDRINUSE"
  connected=$(connect)
  if [[ $connected == *"EADDRINUSE"* ]]; then
    # Get .sock from error message
    sock=$(echo $connected | grep -oP '/tmp/*/fp.*sock')
    # remove sock
    rm $sock
    echo "Retry"
  else
    echo "Connected"
  fi
}

count=0
max=3
echo "Starting connection loop"
tryconnect=$(check_eadrinuse)
while [[ $tryconnect == *"Retry"* ]]; do
  echo "Not connected"
  sleep 5
  tryconnect=$(check_eadrinuse)
  count=$((count+1))
  if [ $count -eq $max ]; then
    echo "Max retries reached"
    break
  fi
done
echo "Connection count: $count of $max"