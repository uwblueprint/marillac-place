FROM node:20-slim
WORKDIR /app

# Set Node.js memory limit
ENV NODE_OPTIONS="--max-old-space-size=4096"

COPY package.json yarn.lock ./
RUN yarn config set registry https://registry.npmmirror.com/ && \
    yarn install --network-timeout 600000
COPY . ./
EXPOSE 3000
ENTRYPOINT ["yarn", "start"]