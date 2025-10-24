FROM node:20-slim
WORKDIR /app

# Set Node.js memory limit for build
ENV NODE_OPTIONS="--max-old-space-size=4096"

COPY package.json yarn.lock ./
RUN yarn config set registry https://registry.npmmirror.com/ && \
    yarn install --network-timeout 600000
COPY . ./

# Accept build arguments and set as environment variables for build
ARG REACT_APP_BACKEND_URL
ARG REACT_APP_JWT_SECRET
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
ENV REACT_APP_JWT_SECRET=$REACT_APP_JWT_SECRET

# Build the production bundle
RUN yarn build

# Serve the static files
EXPOSE 3000
ENTRYPOINT ["yarn", "serve"]