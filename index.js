const express = require('express');
const url = require('url');
const myParser = require("body-parser");
const app = express();
const port = process.env.PORT == null ? 3434 : process.env.PORT;

const RESPONSE_TYPE = "response_type";
const CLIENT_ID = "client_id";
const CLIENT_SECRET = "client_secret";
const REDIRECT_URI = "redirect_uri";
const SCOPE = "scope";
const CODE = "code";
const STATE = "state";

const CLIENT_SECRET_VAL = "secretid";

const inMemoryRequestTokenRepository = new Map();
const inMemoryAccessTokenRepository = new Map();

app.use(myParser.json({ extended: true }));
app.use(myParser.urlencoded({ extended: true }));
app.use((request, response, next) => {
  console.log(request.headers);
  next();
})

app.get('/auth', (request, response) => {
  console.log(request.query);
  var redirectUri = request.query[REDIRECT_URI];
  var state = request.query[STATE];
  var clientId = request.query[CLIENT_ID];
  console.log(redirectUri);
  if (redirectUri && state && clientId) {
    var code = generateToken();
    console.log(code);
    // Store the code so that it can be compared later
    inMemoryRequestTokenRepository.set(clientId, code);
    console.log(inMemoryRequestTokenRepository);
    response.redirect(url.format({
      pathname: redirectUri,
      query: {
        "code": code,
        "state": state
      }
    }));
  } else {
    response.send("No redirect_uri, client_id or state specified");
  }
})

app.post('/token', (request, response) => {
  var authHeader = request.headers['authorization'];
  if (isRequestAuthorized(authHeader)) {
    console.log(request.body);
    if (!request.query) {
      response.status(400).send('{"error": "invalid_client", "error_description": "No query parameters set"}');
      return;
    }
    var accessCode = request.body.code;
    // console.log(request);
    console.log("The body string is " + JSON.stringify(request.body));
    var clientId = request.body.client_id;
    console.log("Sent Token " + accessCode);
    var storedAccessCode = inMemoryRequestTokenRepository.get(clientId);
    console.log("Stored token " + storedAccessCode);
    if (accessCode && storedAccessCode && storedAccessCode == accessCode) {
      // Remove access token from repo
      inMemoryRequestTokenRepository.delete(clientId);

      // Add access token to repo
      var resourceToken = generateToken();
      inMemoryAccessTokenRepository.set(resourceToken, "You got the resource for " + clientId);
      console.log("Stored token " + resourceToken);
      response.json(
        {
          "access_token": resourceToken,
          "token_type": "bearer",
          "expires_in": 3600,
          "refresh_token": "TODO",
          "scope": "any"
        }
      )
    } else {
      response.status(400).send('{"error": "invalid_token", "error_description": "Access token invalid or not present"}');
    }
    return;
  }

  response.status(401).send('{"error": "invalid_client", "error_description": "Request is not authorized"}');
})

app.get('/resource', (request, response) => {
  var authHeader = request.headers['authorization'];
  var resourceToken = authHeader.substring("Bearer ".length);
  if (resourceToken) {
    var responseBody = inMemoryAccessTokenRepository.get(resourceToken);
    if (responseBody) {
      response.send(responseBody)
    } else {
      response.status(401).send('{"error": "invalid_client", "error_description": "Resource token not valid"}')
    }
    return;
  }
  response.status(401).send('{"error": "invalid_client", "error_description": "Resource token not sent"}');
})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`Token Request Server listening on ${port}`);
})

function generateToken() {
  var randomFunc = () => Math.random().toString(32).substring(2, 16);
  var code = randomFunc() + randomFunc() + randomFunc() + randomFunc();
  return code;
}

function isRequestAuthorized(authHeader) {
  var shortenedHeader = authHeader.startsWith("Basic ") ? authHeader.substring("Basic ".length) : "";
  var decodedHeader = Buffer.from(shortenedHeader, 'base64').toString('ascii');
  var headerParts = String(decodedHeader).split(":");
  var isAuthorized = authHeader != null && headerParts.length == 2 && headerParts[0] != null && CLIENT_SECRET_VAL == headerParts[1];
  return isAuthorized;
}

function getClientIdFromHeader(authHeader) {
  var shortenedHeader = authHeader.startsWith("Basic ") ? authHeader.substring("Basic ".length) : "";
  var decodedHeader = Buffer.from(shortenedHeader, 'base64').toString('ascii');
  var headerParts = String(decodedHeader).split(":");
  return headerParts[0];
}
