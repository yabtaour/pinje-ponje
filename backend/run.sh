#!/bin/bash

npx prisma migrate dev reset

npx prisma generate

echo "========================================================== Done here"

npm run start