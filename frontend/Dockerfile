# Use Node.js image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose Next.js dev port
EXPOSE 3000

# Start Next.js dev server
CMD ["npm", "run", "dev"]