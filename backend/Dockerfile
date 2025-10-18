FROM node:18.18.2-slim
WORKDIR /app
COPY . ./
RUN apt-get update -y && apt-get install -y openssl
RUN yarn install
ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV
EXPOSE 5000
ENTRYPOINT ["yarn", "prismaInitAndRun"]
