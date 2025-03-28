FROM node:18 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Nếu build qua GitHub Actions, tạo .env từ ARG
ARG VITE_OPENROUTER_API_KEY
RUN echo "VITE_OPENROUTER_API_KEY=$VITE_OPENROUTER_API_KEY" > .env

RUN npm run build

# Serve với Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
