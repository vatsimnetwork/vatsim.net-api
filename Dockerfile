FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm run build

COPY . .

EXPOSE 3333

CMD ["node", "dist/index.js"]