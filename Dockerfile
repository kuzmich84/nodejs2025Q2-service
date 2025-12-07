FROM node:24.10-alpine
WORKDIR /app
COPY package*.json ./
COPY doc/api.yaml ./doc/api.yaml
RUN npm ci
COPY . .
RUN npx prisma generate
EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:dev"]