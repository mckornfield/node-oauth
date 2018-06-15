FROM node:10.4.1-alpine

ENV SERVER_DIR=/opt/nodeserver

RUN mkdir -p $SERVER_DIR && echo $SERVER_DIR
COPY index.js package*.json $SERVER_DIR/

RUN cd $SERVER_DIR && npm install

# Entrypoint cannot reference environment variables :(
ENTRYPOINT node /opt/nodeserver/index.js
