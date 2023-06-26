FROM node:lts-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build


FROM node:lts-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production


FROM gcr.io/distroless/nodejs:16

ENV NODE_ENV=production
USER 1000
WORKDIR /app
COPY --from=build /app/dist/ ./dist
COPY --from=deps /app/node_modules/ ./node_modules

EXPOSE 3000
CMD ["dist/main.js"]
