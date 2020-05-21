FROM registry.hub.docker.com/library/node:12.16.3-alpine

ENV APP_HOME /app
WORKDIR ${APP_HOME}

COPY . .
RUN npm install
RUN npm run build

EXPOSE 8080
CMD node server/server.js
