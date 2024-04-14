ARG NODE_VERSION=20.11.0
FROM node:${NODE_VERSION}-alpine as builder

WORKDIR /frontend

COPY package.json .
RUN npm install
COPY . .
RUN npm run build-only

FROM nginx:alpine
EXPOSE 8000
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /frontend /app