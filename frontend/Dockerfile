# Use official Node.js image as build stage
FROM node:16-alpine as build

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source files and build React app
COPY . .
RUN npm run build

# Use official Node.js image for runtime
FROM node:16-alpine

WORKDIR /app

# Copy package files and install only production dependencies
COPY package.json package-lock.json ./
RUN npm install --only=production

# Copy built React app from build stage
COPY --from=build /app/build ./build

# Copy server.js and other necessary files
COPY server.js .

# Expose port 3000
EXPOSE 3000

# Start the frontend proxy server
CMD ["node", "server.js"]
