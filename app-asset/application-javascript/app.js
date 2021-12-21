/**
 * @author Nusayer
 * @desc The file interacts with the fabric network.
 */


const {Gateway, Wallets} = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const {buildCAClient, registerAndEnrollUser} = require('./CAUtil.js');
const {buildCCPStore3, buildCCPStore2, buildCCPStore1, buildWallet} = require('./AppUtil.js');

const channelName = 'storechannel';
const chaincodeName = 'app';
const mspOrg1 = 'store1MSP';
const mspOrg2 = 'store2MSP';
const mspOrg3 = 'store3MSP';
const walletPath = path.join(__dirname, 'wallet');


/**
 * @param  {string} userID
 * @return {networkObj} networkObj if all paramters are correct, the networkObj consists of contract, network, gateway
 * @return {string} response error if there is a error in the method
 * @description Connects to the network using the username - userID, networkObj contains the paramters using which
 * @description a connection to the fabric network is possible.
 */
exports.connectToNetwork = async function(userID) {
  const gateway = new Gateway();
  const ccp = buildCCPStore1();

  try {
    const walletPath = path.join(process.cwd(), '../app-asset/application-javascript/wallet/');

    const wallet = await buildWallet(Wallets, walletPath);

    const userExists = await wallet.get(userID);
    if (!userExists) {
      console.log('An identity for the userID: ' + userID + ' does not exist in the wallet');
      console.log('Create the userID before retrying');
      const response = {};
      response.error = 'An identity for the user ' + userID + ' does not exist in the wallet. Register ' + userID + ' first';
      return response;
    }

    await gateway.connect(ccp, {wallet, identity: userID, discovery: {enabled: true, asLocalhost: true}});

    // Build a network instance based on the channel where the smart contract is deployed
    const network = await gateway.getNetwork(channelName);

    // Get the contract from the network.
    const contract = network.getContract(chaincodeName);

    const networkObj = {
      contract: contract,
      network: network,
      gateway: gateway,
    };
    console.log('Succesfully connected to the network.');
    return networkObj;
  } catch (error) {
    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);
    const response = {};
    response.error = error;
    return response;
  }
};

/**
 Invoke Function
*/
exports.invoke = async function(networkObj, isQuery, func, args= '') {
  try {
    if (isQuery === true) {
      const response = await networkObj.contract.evaluateTransaction(func, args);
      console.log(response);
      await networkObj.gateway.disconnect();
      return response;
    } else {
      if (args) {
        args = JSON.parse(args[0]);
        args = JSON.stringify(args);
      }
      const response = await networkObj.contract.submitTransaction(func, args);
      await networkObj.gateway.disconnect();
      return response;
    }
  } catch (error) {
    const response = {};
    response.error = error;
    console.error(`Failed to submit transaction: ${error}`);
    return response;
  }
};

/**
 Register user and developer
 */
exports.registerUser = async function(attributes) {
  const attrs = JSON.parse(attributes);
  const stored = parseInt(attrs.stored);
  const userId = attrs.userId;

  if (!userId || !stored) {
    const response = {};
    response.error = 'Error! You need to fill all fields before you can register!';
    return response;
  }

  try {
    const wallet = await buildWallet(Wallets, walletPath);
    // TODO: Must be handled in a config file instead of using if
    if (stored === 1) {
      const ccp = buildCCPStore1();
      const caClient = buildCAClient(FabricCAServices, ccp, 'ca.store1.nusayer.com');
      await registerAndEnrollUser(caClient, wallet, mspOrg1, userId, 'store1admin', attributes);
    } else if (stored === 2) {
      const ccp = buildCCPStore2();
      const caClient = buildCAClient(FabricCAServices, ccp, 'ca.store2.nusayer.com');
      await registerAndEnrollUser(caClient, wallet, mspOrg2, userId, 'store2admin', attributes);
    } else if (stored === 3) {
      const ccp = buildCCPStore3();
      const caClient = buildCAClient(FabricCAServices, ccp, 'ca.store3.nusayer.com');
      await registerAndEnrollUser(caClient, wallet, mspOrg3, userId, 'store3admin', attributes);
    }
    console.log(`Successfully registered user: + ${userId}`);
    const response = 'Successfully registered user: '+ userId;
    return response;
  } catch (error) {
    console.error(`Failed to register user + ${userId} + : ${error}`);
    const response = {};
    response.error = error;
    return response;
  }
};

