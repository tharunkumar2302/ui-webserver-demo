<<<<<<< HEAD
<<<<<<< HEAD
#FROM node:alpine

#RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app

#WORKDIR /usr/src/node-app

#COPY package.json yarn.lock ./

#USER node

#RUN yarn install --pure-lockfile

#COPY --chown=node:node . .

#EXPOSE 3000




#FROM node:latest
#WORKDIR /app
#COPY package.json ./
#COPY package-lock.json* ./
#COPY package.json yarn.lock ./
#RUN yarn install
#COPY . .
#EXPOSE 3000



# Use Node.js version 14 as the base image
FROM node:14

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./


# Install Puppeteer, other dependencies, and PM2 globally
RUN npm install puppeteer && npm install && npm install -g pm2

# Copy the rest of the application code
COPY . .

# Expose the port if your application listens on a specific port
 EXPOSE 3000

# Command to run the application using PM2
#CMD ["sh", "-c", "pm2 start && pm2 status && npm run start:pm2dev"]
CMD ["sh", "-c", "pm2 start qaEcosystem.config.json && pm2 status && npm run start:pm2dev"]













=======
FROM node:16.13.1-alpine3.15 AS build
RUN mkdir /app

WORKDIR /app

COPY wtt-pms-ui-main/ /app/
RUN npm i --f
RUN npm install -g env-cmd
RUN npm run build:dev
RUN   rm -rf node_modules

# Use Node.js image as base
FROM node:16.13.1

# Set working directory in the container
WORKDIR /webserver

COPY wtt-pms-webserver-version_2/ /webserver/
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
>>>>>>> 1b773a278af57dfb1e814cddbeb33afa5855d030
=======
FROM jenkins/jenkins:lts
USER root
RUN apt-get update -qq \
    && apt-get install -qqy apt-transport-https ca-certificates curl gnupg2 software-properties-common
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -
RUN add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/debian \
   $(lsb_release -cs) \
   stable"
RUN apt-get update  -qq \
    && apt-get -y install docker-ce
RUN usermod -aG docker jenkins
>>>>>>> tarun/main
