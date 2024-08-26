# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install\
        && npm install typescript -g

# Copy the rest of the application code to the working directory
COPY . .

RUN tsc

# Expose port 4000 for the application
EXPOSE 4001

# Define the command to run the application
CMD [ "node", "./dist/app.js" ]
