FROM node:16 as build

WORKDIR /app

# Copy client package files and install dependencies
COPY ./client/package*.json ./client/
RUN cd client && npm install

# Copy client source code and build
COPY ./client ./client
RUN cd client && npm run build

# Server stage
FROM node:16

WORKDIR /app

# Copy package.json and install dependencies
COPY ./server/package*.json ./
RUN npm install

# Copy server files
COPY ./server .

# Copy client build from build stage
COPY --from=build /app/client/build ./client/build

# Set environment variables
ENV PORT=5000
ENV NODE_ENV=production

EXPOSE $PORT

CMD ["npm", "start"]
