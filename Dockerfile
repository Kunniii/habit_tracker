# Stage 1: Build Frontend
FROM node:lts AS frontend-builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Stage 2: Setup Backend and Serve
FROM node:lts
WORKDIR /app/backend

COPY backend/package.json backend/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY backend ./

# Copy built frontend to /app/dist
COPY --from=frontend-builder /app/dist /app/dist

EXPOSE 3000

CMD ["yarn", "start"]
