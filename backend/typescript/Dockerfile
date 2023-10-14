FROM node:18.16.0-slim

RUN apt-get update -y
RUN apt-get install -y openssl

WORKDIR /app

COPY package.json yarn.lock tsconfig.json ./

COPY ./prisma/schema.prisma ./prisma/schema.prisma

# libcurl3 is required for mongodb-memory-server, which is used for testing
# RUN apt-get update && apt-get install -y libcurl3

RUN yarn install

COPY . ./

EXPOSE 5000

ENTRYPOINT ["yarn", "dev"]

ENTRYPOINT ["yarn", "prismaInit"]

