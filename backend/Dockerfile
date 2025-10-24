FROM node:18.18.2-slim
WORKDIR /app
COPY . ./
RUN apt-get update -y && apt-get install -y openssl
RUN yarn install
EXPOSE 5000
ENV NODE_ENV=development
ENTRYPOINT ["yarn", "prismaInitAndRun"]
