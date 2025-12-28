FROM node:20-slim
WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=4096"

# Accept build arguments from Railway
ARG REACT_APP_BACKEND_URL
ARG REACT_APP_FRONTEND_URL
ARG REACT_APP_JWT_SECRET

# Set them as environment variables for the build
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
ENV REACT_APP_FRONTEND_URL=$REACT_APP_FRONTEND_URL
ENV REACT_APP_JWT_SECRET=$REACT_APP_JWT_SECRET

COPY package.json yarn.lock ./
RUN yarn config set registry https://registry.npmmirror.com/ && \
    yarn install --network-timeout 600000
COPY . ./

RUN yarn build
EXPOSE 3000
ENTRYPOINT ["yarn", "serve"]