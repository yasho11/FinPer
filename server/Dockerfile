#server/Dockerfile

#Base image
FROM node:18-alpine3.21
WORKDIR /app

COPY package*json ./
COPY tsconfig.json ./
COPY ./src ./src

RUN npm install

EXPOSE 5000

CMD ["npx", "ts-node", "src/index.ts"]
