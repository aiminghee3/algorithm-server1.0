FROM node:16

WORKDIR /usr/app

COPY package.json /usr/app

RUN npm install

COPY . /usr/app

EXPOSE 8000

CMD ["node", "app.js"]