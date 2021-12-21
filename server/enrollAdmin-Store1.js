/**
 * @author Nusayer
 * @desc Execute this file to create and enroll an admin at Store 1.
 */


const {Wallets} = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const {buildCAClient, enrollAdmin} = require('../app-asset/application-javascript/CAUtil.js');
const {buildCCPStore, buildWallet} = require('../app-asset/application-javascript/AppUtil.js');
const adminStore1 = 'store1admin';
const adminStore1Passwd = 'store1nusayer';

const mspStore1 = 'store1MSP';
const walletPath = path.join(__dirname, '../app-asset/application-javascript/wallet');

/**
 * @description Enrolls the admin of Store 1
 */
exports.enrollAdminStore = async function() {
  try {
    // build an in memory object with the network configuration (also known as a connection profile)
    const ccp = buildCCPStore();

    // build an instance of the fabric ca services client based on
    // the information in the network configuration
    const caClient = buildCAClient(FabricCAServices, ccp, 'ca.store1.nusayer.com');

    // setup the wallet to hold the credentials of the application user
    const wallet = await buildWallet(Wallets, walletPath);

    // to be executed and only once per store. Which enrolls admin and creates admin in the wallet
    await enrollAdmin(caClient, wallet, mspStore, adminStore1, adminStore1Passwd);

    console.log('msg: Successfully enrolled admin user ' + adminStore1 + ' and imported it into the wallet');
  } catch (error) {
    console.error(`Failed to enroll admin user ' + ${adminStore1} + : ${error}`);
    process.exit(1);
  }
};
