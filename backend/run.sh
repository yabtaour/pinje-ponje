#!/bin/bash

npx prisma migrate deploy

npx prisma generate

echo "========================================================== Done here"

npm run start:dev