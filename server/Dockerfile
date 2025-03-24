FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Heroku dynamically assigns port
ENV PORT=5000

EXPOSE $PORT

CMD ["npm", "start"]
