# Use the official Node.js 14 image as base
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Create a volume for the /uploads folder
VOLUME /usr/src/app/uploads

# Expose port 3009
EXPOSE 3009

# Command to run the application
CMD ["node", "server.js"]