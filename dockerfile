FROM node:current-slim

WORKDIR /usr/src/waterbaseServer

COPY package.json .

RUN npm install

EXPOSE 1217

RUN npm install pm2 -g

CMD ["pm2-runtime", "src/index.js"]


COPY . .