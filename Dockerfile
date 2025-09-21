# 1️⃣ Build Stage
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2️⃣ Production Stage
FROM node:18
WORKDIR /app
COPY --from=builder /app ./
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080
CMD ["npm", "start"]