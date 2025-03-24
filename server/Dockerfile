FROM node:16

WORKDIR /app

# Copy the entire project
COPY . .

# Install server dependencies
WORKDIR /app/server
RUN npm install

# Install and build client
WORKDIR /app/client
RUN npm install
RUN npm run build

# Back to server directory
WORKDIR /app/server

# Heroku dynamically assigns port
ENV PORT=5000

EXPOSE $PORT

CMD ["npm", "start"]
