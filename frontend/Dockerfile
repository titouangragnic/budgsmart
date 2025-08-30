# Étape 1 : Build de l'app React
FROM node:20 AS builder

WORKDIR /app
COPY . .
RUN npm install

# Déclaration de l'ARG pour Vite
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

RUN npm run build

# Étape 2 : Image Nginx pour servir les fichiers statiques
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Copie de ta config Nginx SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf