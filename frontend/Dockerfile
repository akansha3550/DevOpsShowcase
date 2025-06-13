FROM node:18-slim

# set the working directory
WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install

# copy the rest of the application code
COPY . .

# build the application
RUN npm run build

# install serve to serve the built application
RUN npm install -g serve

# expose the port the app runs on
EXPOSE 3000

# command to run the application
CMD ["serve", "-s", "build", "-l", "3000"]
