ARG NODE_VERSION=20.11.0


FROM node:${NODE_VERSION}-alpine as base

WORKDIR /frontend

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "run", "dev", "--", "--host"]