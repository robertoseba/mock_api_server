FROM node:alpine3.18 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build


FROM node:alpine3.18 AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production


FROM node:alpine3.18

ENV NODE_ENV=production
USER 1000
WORKDIR /app
COPY --from=build /app/dist/ ./dist
COPY --from=deps /app/node_modules/ ./node_modules

EXPOSE 5000
CMD ["node","dist/main.js"]
