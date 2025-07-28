FROM node:20-slim
WORKDIR /app
COPY . ./
RUN yarn config set registry https://registry.npmmirror.com/ && \
    yarn install --network-timeout 600000
EXPOSE 3000
ENTRYPOINT ["yarn", "start"]