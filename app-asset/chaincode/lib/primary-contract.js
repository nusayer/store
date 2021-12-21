/*
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

const { Contract } = require('fabric-contract-api');
let App = require('./App.js');
let initApps = require('./initLedger.json');

class PrimaryContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        for (let i = 0; i < initApps.length; i++) {
            initApps[i].docType = 'app';
            await ctx.stub.putState('hash' + i, Buffer.from(JSON.stringify(initApps[i])));
            console.info('Added <--> ', initApps[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }
}
module.exports = PrimaryContract;