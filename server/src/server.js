/**
 API to interact with the fabric network
 */

// Classes for Node Express
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const jwtSecretToken = 'password';
const refreshSecretToken = 'refreshpassword';
let refreshTokens = [];

// Express Application init
const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

app.listen(3001, () => console.log('Backend server running on 3001'));

// Bring key classes into scope
const adminRoutes = require('./admin-routes');
const userRoutes = require('./user-routes');
const developerRoutes = require('./developer-routes');
const {ROLE_ADMIN, ROLE_USER, ROLE_DEVELOPER} = require('../utils');
const {createRedisClient} = require('../utils');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    if (token === '' || token === 'null') {
      return res.status(401).send('Unauthorized request: Token is missing');
    }
    jwt.verify(token, jwtSecretToken, (err, user) => {
      if (err) {
        return res.status(403).send('Unauthorized request: Wrong or expired token found');
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).send('Unauthorized request: Token is missing');
  }
};

/**
 * @description Generates a new accessToken
 */
function generateAccessToken(username, role) {
  return jwt.sign({username: username, role: role}, jwtSecretToken, {expiresIn: '5m'});
}

/**
 * @description Login and create a session with and add two variables to the session
 */
app.post('/login', async (req, res) => {
  // Read username and password from request body
  let {username, password, storeId, role} = req.body;
  storeId = parseInt(storeId);
  let user;
  // using get instead of redis GET for async
  if (role === ROLE_ADMIN || role === ROLE_USER || role === ROLE_DEVELOPER) {
    // Create a redis client based on the store ID
    const redisClient = await createRedisClient(storeId);
    // Async get
    const value = await redisClient.get(username);
    // comparing passwords
    user = value === password;
    redisClient.quit();
  }

  if (user) {
    // Generate an access token
    const accessToken = generateAccessToken(username, role);
    const refreshToken = jwt.sign({username: username, role: role}, refreshSecretToken);
    refreshTokens.push(refreshToken);
    // Once the password is matched a session is created with the username and password
    res.status(200);
    res.json({
      accessToken,
      refreshToken,
    });
  } else {
    res.status(400).send({error: 'Username or password incorrect!'});
  }
});

/**
 * @description Creates a new accessToken when refreshToken is passed in post request
 */
app.post('/token', (req, res) => {
  const {token} = req.body;

  if (!token) {
    return res.sendStatus(401);
  }

  if (!refreshTokens.includes(token)) {
    return res.sendStatus(403);
  }

  jwt.verify(token, refreshSecretToken, (err, username) => {
    if (err) {
      return res.sendStatus(403);
    }

    const accessToken = generateAccessToken({username: username, role: req.headers.role});
    res.json({
      accessToken,
    });
  });
});

/**
 * @description Logout to remove refreshTokens
 */
app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.headers.token);
  res.sendStatus(204);
});

// //////////////////////////////// Admin Routes //////////////////////////////////////
app.post('/user/register', authenticateJWT, adminRoutes.createUser);
app.post('/developer/register', authenticateJWT, adminRoutes.createDeveloper);

// //////////////////////////////// User Routes //////////////////////////////////////
app.get('/appExists)', authenticateJWT, userRoutes.appExists);
app.patch('/giveReveviews', authenticateJWT, userRoutes.giveReviews);
app.patch('/giveRatings', authenticateJWT, userRoutes.giveRatings);
app.get('/readReviews)', authenticateJWT, userRoutes.readReviews);
app.get('/readRatings)', authenticateJWT, userRoutes.readRatings);

// //////////////////////////////// Developer Routes //////////////////////////////////////
app.patch('/registerApp', authenticateJWT, developerRoutes.registerApp);
app.patch('/updateAppDetails', authenticateJWT, developerRoutes.updateAppDetails);