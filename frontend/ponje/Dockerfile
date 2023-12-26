FROM node:20.6-alpine as base

WORKDIR /app

COPY package*.json ./

# RUN npm install && npm install --dev

COPY . .

EXPOSE 3000

# ENTRYPOINT ["npm", "run", "dev"]

CMD ["tail", "-f", "/dev/null"]