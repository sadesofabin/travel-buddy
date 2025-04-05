# Dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your app
COPY . .

# Resolve module aliases
RUN npm install module-alias

# Expose port the gateway runs on
EXPOSE 5000

# Start the application
CMD ["npm", "run", "st:server"]
