FROM node:20-slim
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . ./
EXPOSE 3000
ENTRYPOINT ["yarn", "start"]