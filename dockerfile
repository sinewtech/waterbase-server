FROM node:current-slim

WORKDIR /usr/src/waterbaseServer

COPY package.json .

RUN npm install

EXPOSE 1217
CMD [ "npm", "install", "-g", "pm2" ]

CMD [ "pm2", "start", "src/index.start" ]

COPY . .