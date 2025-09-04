# ---------- deps stage ----------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ---------- build stage ----------
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Set NODE_ENV=production so Next.js optimizes build
ENV NODE_ENV=production
RUN npm run build

# ---------- run stage ----------
FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
# Only copy what is needed to run
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY package.json ./
COPY --from=deps /app/node_modules ./node_modules

# Next.js default port
EXPOSE 3000
# Use non-root
USER node
CMD ["npm", "run", "start"]
