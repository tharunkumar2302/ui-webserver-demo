FROM node:16.13.1-alpine3.15 AS build
RUN mkdir /app

WORKDIR /app

COPY ui-webserver-demo/wtt-pms-ui-main/ /app/
RUN npm i --f
RUN npm install -g env-cmd
RUN npm run build:dev
RUN   rm -rf node_modules

# Use Node.js image as base
FROM node:16.13.1

# Set working directory in the container
WORKDIR /webserver

COPY ui-webserver-demo/wtt-pms-webserver-version_2/ /webserver/
COPY  --from=build /app/build/  webserver/ui/public/
# Copy package.json and package-lock.json to the container
#COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Install Puppeteer
RUN npm install puppeteer

# Install pm2 globally
RUN npm install -g pm2
RUN rm -rf /root/.npm /usr/local/share/.cache
# Copy the rest of your application files to the container
COPY . .
EXPOSE 4001
# Start your application using pm2
CMD ["pm2-runtime", "npm", "--", "run", "start:pm2dev"]
