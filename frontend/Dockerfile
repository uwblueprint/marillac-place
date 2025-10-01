# ---------- Build Stage ----------
FROM node:20-slim AS build
WORKDIR /app

# Copy dependencies and install
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 600000

# Copy the rest of the code
COPY . ./

# Build React for production
RUN yarn build


# ---------- Serve Stage ----------
FROM node:20-slim AS serve
WORKDIR /app

# Install 'serve' to host static files
RUN yarn global add serve

# Copy only the built output
COPY --from=build /app/build ./build

EXPOSE 3000

# Serve the build folder on port 3000
CMD ["serve", "-s", "build", "-l", "3000"]
