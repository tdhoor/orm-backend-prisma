FROM node:18.15.0

WORKDIR /app

COPY . .
RUN npm install

RUN npx prisma generate

COPY . .
RUN npm run build

CMD npm run prod