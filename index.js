const express = require('express')
const url = require('url')
const myParser = require("body-parser")
const app = express()
const port = 3434

const RESPONSE_TYPE = "response_type"
const CLIENT_ID = "clientId"
const CLIENT_SECRET = "client_secret"
const REDIRECT_URI = "redirect_uri"
const SCOPE = "scope"
const CODE = "code"
const STATE = "state"

app.use(myParser.json({extended: true}))
app.use((request, response, next) => {
  console.log(request.headers)
  next()
})

app.get('/auth', (request, response) => {
  var redirectUri = request.query[REDIRECT_URI]
  var state = request.query[STATE]
  var code = request.query[CODE]
  if(redirectUri) {
    response.redirect(url.format({
      pathname: redirectUri,
      query: {
        "code": code,
        "state": state
      }
    }));
  } else {
    response.send("No redirect uri specified")
  }
})

app.post('/token', (request, response) => {
  response.send(request.body.a)
})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
