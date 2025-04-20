FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Register module aliases
RUN npm install module-alias

# Default port (used by gateway); overridden per service by Docker Compose
EXPOSE 5000