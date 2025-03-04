FROM node:18-alpine AS builder

RUN apk update && apk add --no-cache git openssh-client && \
    mkdir -p /root/.ssh && \
    chmod 700 /root/.ssh && \
    ssh-keyscan github.com >> /root/.ssh/known_hosts

WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM node:18-alpine

RUN apk add --no-cache git openssh-client && \
    mkdir -p /root/.ssh && \
    chmod 700 /root/.ssh && \
    ssh-keyscan github.com >> /root/.ssh/known_hosts \
    chmod 600 /root/.ssh/id_ed25519 

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

COPY .ssh /root/.ssh
RUN chmod 600 /root/.ssh/id_ed25519

CMD ["npm", "run", "start:prod"]