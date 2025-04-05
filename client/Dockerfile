FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy client source
COPY . ./

# Set environment variables
ENV PORT=3000
ENV NODE_ENV=development

EXPOSE $PORT

CMD ["npm", "start"]
