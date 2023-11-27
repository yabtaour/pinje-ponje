#!/bin/bash

npx prisma migrate dev reset

echo "========================================================== Done here"

npm run start