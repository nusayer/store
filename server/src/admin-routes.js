
// Bring common classes into scope, and Fabric SDK network class
const {ROLE_ADMIN, ROLE_USER, ROLE_DEVELOPER, getMessage, validateRole, createRedisClient} = require('../utils.js');
const network = require('../../app-asset/application-javascript/app.js');

/**
 * @param  {Request} req Body must be a user json and role in the header
 * @param  {Response} res 201 response if asset is created else 400 with a simple json message
 * @description Creates a user and adds the user to the wallet
 */
exports.createUser = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  let {username, password} = req.body;
  await validateRole([ROLE_ADMIN], userRole, res);

  req.body.userId = username;
  req.body.role = ROLE_USER;
  req.body = JSON.stringify(req.body);
  const args = [req.body];
  // Create a redis client and add the user to redis
  const redisClient = createRedisClient(storeId);
  (await redisClient).SET(username, password);
  // Enrol and register the user with the CA and adds the user to the wallet.
  const response = await network.registerUser(args);
  if (response.error) {
    (await redisClient).DEL(username);
    res.status(400).send(response.error);
  }
  res.status(201).send(getMessage(false, response, username, password));
};

/**
 * @param  {Request} req Body must be a developer json and role in the header
 * @param  {Response} res 201 response if asset is created else 400 with a simple json message
 * @description Creates a developer and adds the developer to the wallet
 */
 exports.createDeveloper = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  let {username, password} = req.body;
  await validateRole([ROLE_ADMIN], userRole, res);

  req.body.userId = username;
  req.body.role = ROLE_DEVELOPER;
  req.body = JSON.stringify(req.body);
  const args = [req.body];
  // Create a redis client and add the developer to redis
  const redisClient = createRedisClient(storeId);
  (await redisClient).SET(username, password);
  // Enrol and register the user with the CA and adds the user to the wallet.
  const response = await network.registerUser(args);
  if (response.error) {
    (await redisClient).DEL(username);
    res.status(400).send(response.error);
  }
  res.status(201).send(getMessage(false, response, username, password));
};
