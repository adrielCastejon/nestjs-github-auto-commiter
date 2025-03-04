FROM node:18-alpine AS builder

RUN apk update && apk add --no-cache git openssh-client && git config --global --add safe.directory /app

RUN git config --global user.email "${GIT_EMAIL}" && git config --global user.name "${GIT_NAME}"

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine

RUN apk update && apk add --no-cache git openssh-client

WORKDIR /app
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["npm", "run", "start:prod"]