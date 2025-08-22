# Stage 1: Build React app
FROM node:18 AS build

WORKDIR /app

# Copy dependencies files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy all files
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy build output to Nginx html folder
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
