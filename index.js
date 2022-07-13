const express = require('express')
const app = express()
const { auth, requiresAuth } = require('express-openid-connect');
require('dotenv').config(`${__dirname}/.env`)



const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  authorizationParams: {
  response_type: 'code', // This requires you to provide a client secret
  audience: process.env.AUDIENCE,
  scope: 'openid profile email read:products',
  },
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  console.log(req.oidc.accessToken);
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/callback', (req, res) => {
    console.log(req.oidc.accessToken);
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});
app.get('/profile', requiresAuth(), async (req, res) => {
  // let { token_type, access_token } = req.oidc.accessToken;
  res.send(JSON.stringify(req.oidc.user));
});


app.listen(3000, ()=>console.log('http://127.0.0.1:3000'))