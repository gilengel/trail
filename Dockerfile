

###################
# BUILD FOR LOCAL DEVELOPMENT
###################

ARG NODE_VERSION=20.11.0

# Base image
FROM node:${NODE_VERSION}-alpine AS development

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Bundle app source
#COPY /usr/src/app/node_modules ./node_modules
COPY . .

# Install app dependencies
RUN npm install

# Generate database client
RUN npx prisma generate

# Creates a "dist" folder with the production build
RUN npm run build

EXPOSE 3000

# Start the server using the production build
CMD [ "npm", "run", "start:migrate:dev" ]