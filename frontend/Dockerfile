FROM node:20-slim
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn config set registry https://registry.npmmirror.com/ && \
    yarn install --network-timeout 600000
COPY . ./

# Build for production if NODE_ENV is production
RUN if [ "$NODE_ENV" = "production" ]; then yarn build; fi

EXPOSE 3000

# Use development server for development, production build for production
CMD if [ "$NODE_ENV" = "production" ]; then yarn serve; else yarn start; fi