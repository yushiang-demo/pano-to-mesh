# Stage 1: Build the application
FROM node:18-alpine as builder

# Set the working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV production

# Copy source code
COPY ./ ./

# Install and build
RUN yarn && yarn build

# Stage 2: Create the final image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next/standalone ./app
COPY --from=builder /app/public ./app/public
COPY --from=builder /app/.next/static ./app/.next/static

# Link package to github repo
ARG repo
LABEL org.opencontainers.image.source https://github.com/${repo}

# Expose port 3000
EXPOSE 3000

# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# CMD to start the application
CMD ["node", "app/server.js"]