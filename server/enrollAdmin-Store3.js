/**
 * @author Nusayer
 * @desc Execute this file to create and enroll an admin at Store 3.
 */


 const {Wallets} = require('fabric-network');
 const FabricCAServices = require('fabric-ca-client');
 const path = require('path');
 const {buildCAClient, enrollAdmin} = require('../app-asset/application-javascript/CAUtil.js');
 const {buildCCPStore, buildWallet} = require('../app-asset/application-javascript/AppUtil.js');
 const adminStore3 = 'store3admin';
 const adminStore3Passwd = 'store3nusayer';
 
 const mspStore3 = 'store3MSP';
 const walletPath = path.join(__dirname, '../app-asset/application-javascript/wallet');
 
 /**
  * @description Enrolls the admin of Store 3
  */
 exports.enrollAdminStore = async function() {
   try {
     // build an in memory object with the network configuration (also known as a connection profile)
     const ccp = buildCCPStore();
 
     // build an instance of the fabric ca services client based on
     // the information in the network configuration
     const caClient = buildCAClient(FabricCAServices, ccp, 'ca.store3.nusayer.com');
 
     // setup the wallet to hold the credentials of the application user
     const wallet = await buildWallet(Wallets, walletPath);
 
     // to be executed and only once per store. Which enrolls admin and creates admin in the wallet
     await enrollAdmin(caClient, wallet, mspStore, adminStore3, adminStore3Passwd);
 
     console.log('msg: Successfully enrolled admin user ' + adminStore3 + ' and imported it into the wallet');
   } catch (error) {
     console.error(`Failed to enroll admin user ' + ${adminStore3} + : ${error}`);
     process.exit(1);
   }
 };
 