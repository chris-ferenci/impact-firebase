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
COPY nginx/default.conf.template /etc/nginx/conf.d/default.conf.template

# Inject environment variable for BACKEND_URL
ARG REACT_APP_BACKEND_URL
ENV react_app_backend_url=$REACT_APP_BACKEND_URL

RUN envsubst '$react_app_backend_url' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

RUN echo "Using REACT_APP_BACKEND_URL: $REACT_APP_BACKEND_URL"
RUN echo "Backend URL set to: $react_app_backend_url"

# Expose the default Nginx port
EXPOSE 80
