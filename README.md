# node-oauth
Node Server for OAuth, simply for testing, not very useful as is. It simply stores tokens in memory, and does not enforce any sort of expiration date.

# Next steps:
Refresh Token
Accepting authorization in the body
Persisting tokens across restarts

# Building

Run `npm install` to build the project

Run `node index.js` to start the server (available on localhost:5050)

# Docker

You can use the ./build.sh script to build the image locally, or you can run `docker build . -t ...`

You can use the ./run.sh script to start the container

# Kubernetes

TODO
