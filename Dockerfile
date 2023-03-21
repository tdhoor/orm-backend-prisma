FROM node:latest

WORKDIR /app

COPY . .
RUN npm install

RUN npx prisma generate

COPY . .
RUN npm run build

CMD npm run prod