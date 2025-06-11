# Dockerfile for a Node.js application
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies including express and http-proxy-middleware
RUN npm install express http-proxy-middleware

# Copy the rest of the application code to the working directory
COPY . .

# Build the React app
RUN npm run build

EXPOSE 3000

# Start the proxy server
CMD ["node", "server.js"]




