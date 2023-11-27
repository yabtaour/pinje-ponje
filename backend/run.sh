#!/bin/bash


npx prisma generate 

npx prisma migrate deploy

echo "========================================================== Done here"

npm run start