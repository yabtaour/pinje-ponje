FROM node:20.6-alpine as base

RUN apk add --no-cache tini

RUN apk add --no-cache \
    python3 \
    make \
    g++

WORKDIR /app

COPY package*.json ./

RUN npm install && npm install --dev

COPY . .

EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--", "npm", "run", "dev"]


# CMD ["tail", "-f", "/dev/null"]