# node-oauth
Node Server for OAuth, simply for testing, not very useful as is. It simply stores tokens in memory, and does not enforce any sort of expiration date.

The initial part of the request is at `BASE_URL/auth`
The token request is done at `BASE_URL/token`
The actual resources are at `BASE_URL/resources`

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

Using minikube locally, first run
`minikube start`
If you have issues starting, (i.e. `Starting VM...` simply hangs) you can try `minikube delete` and `rm -rf ~/.minikube`

Once minikube is running, run these commands to start the service locally:

In order to see the docker images, run:
```
kubectl create -f k8s/deployment.yaml
kubectl create -f k8s/service-nodeport.yaml
```

To get the port once created, use:
`minikube service node-oauth-service-nodeport --url`

```
eval $(minikube docker-env)
docker images
```

Note you will not be able to see local docker images on your machine using this, but can build to here in order to iterate more quickly.