const {ROLE_DEVELOPER, capitalize, getMessage, validateRole} = require('../utils.js');
const network = require('../../app-asset/application-javascript/app.js');

/**
 * @param  {Request} req Body is json with app info and role in the header
 * @param  {Response} res 201 response if app is registered else 400 with a simple json message
 * @description Register app to the ledger
 */
 exports.registerApp = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_DEVELOPER], userRole, res);
  // Set up and connect to Fabric Gateway using the username in header
  const networkObj = await network.connectToNetwork(req.headers.username);
  // The request present in the body is converted into a single json string
  const data = JSON.stringify(req.body);
  const args = [data];
  // Invoke the smart contract function
  const registerAppRes = await network.invoke(networkObj, false, capitalize(userRole) + 'Contract:registerApp', args);
  if (registerAppRes.error) {
    res.status(400).send(response.error);
  }
};

  /**
 * @param  {Request} req Body is a json and role in the header
 * @param  {Response} res A 200 response if the app is updated successfully else a 500 response with s simple message json
 * @description Updates app information in the ledger
 */
exports.updateAppDetails = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_DEVELOPER], userRole, res);
  let args = req.body;
  args.hash = req.params.hash;
  args.appName = req.params.appName;
  args.developerName = req.params.developerName;
  args.category = req.params.category;
  args= [JSON.stringify(args)];
  // Set up and connect to Fabric Gateway
  const networkObj = await network.connectToNetwork(req.headers.username);
  // Invoke the smart contract function
  const response = await network.invoke(networkObj, false, capitalize(userRole) + 'Contract:updateAppDetails', args);
  (response.error) ? res.status(500).send(response.error) : res.status(200).send(getMessage(false, 'Successfully Updated App information.'));
};
