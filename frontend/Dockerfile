# Dockerfile for a Node.js application
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /app
# Copy package.json and package-lock.json to the working directory
COPY . .

# Install the dependencies
RUN npm install
RUN npm run build

EXPOSE 3000

# Start the application using serve

CMD ["npx", "serve", "-s", "build", "-l", "3000"]




