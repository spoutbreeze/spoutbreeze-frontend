FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install


COPY . .

# Set NODE_ENV to production
ENV NODE_ENV=production

RUN npm run build

# Install nginx for SSL termination
RUN apk add --no-cache nginx

EXPOSE 443
EXPOSE 3000

CMD ["npm", "start"]