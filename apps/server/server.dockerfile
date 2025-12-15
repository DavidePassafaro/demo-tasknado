FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY apps/server/src/prisma ./prisma

RUN npx prisma generate

COPY apps/server/src .

EXPOSE 4000

CMD ["node", "index.js"]
    