FROM node:20.6-alpine as base

WORKDIR /app

COPY package*.json ./

RUN npm install && npm install --dev

COPY . .

# ENTRYPOINT ["npm run dev --turbo"]

CMD ["tail", "-f", "/dev/null"]