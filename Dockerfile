# Use Node.js base image
FROM node:22-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install 

# Copy the rest of the code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build app 
RUN npm run build

# Expose port (change if needed)
EXPOSE 3000

# Run migrations and start app
CMD ["npm", "run", "start:migrate:prod"]
