# Stage 1: Build the Vite app
FROM node:16 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to leverage caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . ./

# Run the Vite build
RUN npm run build

# Debug: Verify that the build folder exists
RUN ls -la /app/build

# Stage 2: Serve the Vite build with Nginx
FROM nginx:alpine

# Copy the build output from the first stage
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# COPY nginx.conf /etc/nginx/nginx.conf

# Expose the default Nginx port
EXPOSE 80
