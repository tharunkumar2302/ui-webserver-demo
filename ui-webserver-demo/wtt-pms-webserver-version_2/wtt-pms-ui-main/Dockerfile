FROM node:16.13.1-alpine3.15 AS build
RUN mkdir /app

WORKDIR /app

COPY . /app/
RUN npm i --f
RUN npm install -g env-cmd
RUN npx update-browserslist-db@latest
RUN npm install express-rate-limit
RUN npm run build:dev 
RUN rm -rf node_modules

# Use Node.js image as base
FROM node:16.13.1

# Set working directory in the container
WORKDIR /webserver

COPY  wtt-pms-webserver-version_2/ /webserver/
COPY  --from=build /app/build/  webserver/ui/public/
# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install
RUN npx update-browserslist-db@latest

# Install Puppeteer
RUN npm install puppeteer \
    && npm install bcryptjs --save \
    && npm install aws-sdk --save console --save envfile --save exceljs --save express-mongo-sanitize --save express-rate-limit --save

# Install pm2 globally
RUN npm install -g pm2
RUN rm -rf /root/.npm /usr/local/share/.cache
# Copy the rest of your application files to the container
COPY . .
EXPOSE 4001
# Start your application using pm2
CMD ["pm2-runtime", "npm", "--", "run", "start:dev"]

