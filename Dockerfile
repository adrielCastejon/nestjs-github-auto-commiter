FROM node:18-alpine AS builder

RUN apk update && apk add --no-cache git openssh-client && git config --global --add safe.directory /app

RUN mkdir -p /root/.ssh && \
    chmod 700 /root/.ssh && \
    ssh-keyscan github.com >> /root/.ssh/known_hosts && \
    chmod 644 /root/.ssh/known_hosts

RUN git config --global user.email "adrielcolherinhas@gmail.com" && \
    git config --global user.name "adrielCastejon" && \
    git config --global core.sshCommand "ssh -o StrictHostKeyChecking=no"

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
