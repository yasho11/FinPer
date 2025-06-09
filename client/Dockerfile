#client/Dockerfile

FROM node:18-alpine3.21

WORKDIR /app

COPY package*.json ./
RUN npm install


COPY . .

EXPOSE 3000

CMD ["npm", "start"]
