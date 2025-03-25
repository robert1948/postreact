FROM node:16 as client-build

# Set working directory
WORKDIR /app

# Copy client package.json and install dependencies
COPY client/package*.json ./
RUN npm install

# Copy client source and build
COPY client/ ./
RUN npm run build

# Server stage
FROM node:16

WORKDIR /app

# Copy server package.json and install dependencies
COPY server/package*.json ./
RUN npm install --production

# Copy server files
COPY server/ ./

# Create client/build directory and copy built client files
RUN mkdir -p /app/client/build
COPY --from=client-build /app/build /app/client/build

# Set environment variables
ENV PORT=5000
ENV NODE_ENV=production

EXPOSE $PORT

CMD ["node", "src/index.js"]
