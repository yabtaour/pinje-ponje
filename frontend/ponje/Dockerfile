FROM node:20.6-alpine as base

WORKDIR /app

COPY package*.json ./

RUN npm install && npm install --dev

COPY . .

# ENTRYPOINT ["npm run start"]

CMD ["tail", "-f", "/dev/null"]