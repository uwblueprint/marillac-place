FROM node:22.11.0-slim
WORKDIR /app
COPY . ./
RUN apt-get update -y && apt-get install -y openssl
RUN yarn install
EXPOSE 5000
ENV NODE_ENV=development
ENTRYPOINT ["yarn", "prismaInitAndRun"]
