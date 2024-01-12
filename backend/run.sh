#!/bin/bash

npx prisma migrate deploy

npx prisma generate
npx nest build

echo "========================================================== start here"
env
echo "========================================================== Done here"

npm run start