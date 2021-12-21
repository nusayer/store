const {ROLE_USER, capitalize, getMessage, validateRole} = require('../utils.js');
const network = require('../../app-asset/application-javascript/app.js');

/**
 * @param  {Request} req Body is a json, role in the header
 * @param  {Response} res A 200 response if app is present else a 500 response with a error json
 * @description This method checks if an app is present
 */
exports.appExists = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_USER], userRole, res);
  let args = req.body;
  args.hash = req.params.hash;
  args= [JSON.stringify(args)];
  // Set up and connect to Fabric Gateway
  const networkObj = await network.connectToNetwork(req.headers.username);
  // Invoke smart contract function to check if the app exists
  const response = await network.invoke(networkObj, true, capitalize(userRole) + 'Contract:appExists', args);
  return response;
};

/**
 * @param  {Request} req Bode is a json, role in the header
 * @description This method allows user to give reviews
 */
 exports.giveReviews = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_USER], userRole, res);
  let args = req.body;
  args.hash = req.params.hash;
  args = [JSON.stringify(args)];
  // Set up and connect to Fabric Gateway
  const networkObj = await network.connectToNetwork(req.headers.username);
  // Invoke smart contract function to to submit reviews
  const response = await network.invoke(networkObj, true, capitalize(userRole) + 'Contract:giveReviews', args);
  (response.error) ? res.status(500).send(response.error) : res.status(200).send(getMessage(false, 'Successfully Submitted the Review.'));
};

/**
 * @param  {Request} req Body is a json, role in the header
 * @description This method allows users to give ratings
 */
exports.giveRatings = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_USER], userRole, res);
  let args = req.body;
  args.hash = req.params.hash;
  args = [JSON.stringify(args)];
  // Set up and connect to Fabric Gateway
  const networkObj = await network.connectToNetwork(req.headers.username);
  // Invoke smart contract function to give ratings
  const response = await network.invoke(networkObj, true, capitalize(userRole) + 'Contract:giveRatings', args);
  (response.error) ? res.status(500).send(response.error) : res.status(200).send(getMessage(false, 'Successfully Submitted the Ratting.'));
};

/**
 * @param  {Request} req Bode is a json, role in the header
 * @param  {Response} res Body consists of json of reviews
 * @description This method allows users to read reviews
 */
 exports.readReviews = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_USER], userRole, res);
  let args = req.body;
  args.hash = req.params.hash;
  args= [JSON.stringify(args)];
  // Set up and connect to Fabric Gateway
  const networkObj = await network.connectToNetwork(req.headers.username);
  // Invoke smart contract function to check if the app exists
  const response = await network.invoke(networkObj, true, capitalize(userRole) + 'Contract:readReviews', args);
  const parsedResponse = await JSON.parse(response);
  (response.error) ? res.status(400).send(response.error) : res.status(200).send(parsedResponse);
};

/**
 * @param  {Request} req Bode is a json, role in the header
 * @param  {Response} res Body consists of json of ratings
 * @description This method allows users to read ratings
 */
 exports.readRatings = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_USER], userRole, res);
  let args = req.body;
  args.hash = req.params.hash;
  args= [JSON.stringify(args)];
  // Set up and connect to Fabric Gateway
  const networkObj = await network.connectToNetwork(req.headers.username);
  // Invoke smart contract function to check if the app exists
  const response = await network.invoke(networkObj, true, capitalize(userRole) + 'Contract:readRatings', args);
  const parsedResponse = await JSON.parse(response);
  (response.error) ? res.status(400).send(response.error) : res.status(200).send(parsedResponse);
};




