FROM node:alpine

WORKDIR /app
COPY package.json .
RUN yarn install --suppress-optional mongodb-memory-server 
COPY . .

CMD ["yarn", "start"]
