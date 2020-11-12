FROM node:current-slim

WORKDIR /usr/src/waterbaseServer

COPY package.json .

RUN npm install

EXPOSE 1217

CMD [ "npm", "start" ]

COPY . .