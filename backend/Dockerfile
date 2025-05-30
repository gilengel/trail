ARG NODE_VERSION=20.11.0

# Base image
FROM node:${NODE_VERSION}-alpine AS development

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

FROM development

# Copy application code
COPY . .

# Generate database client
RUN npx prisma generate

# Create the production build
RUN npm run build

# Expose application port
EXPOSE 3000

# Start the server
CMD [ "npm", "run", "start:migrate:dev" ]