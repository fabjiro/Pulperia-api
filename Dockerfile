FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install -g pnpm
RUN pnpm i 

COPY . .

RUN pnpm run build


CMD ["pnpm", "run", "start:prod"]