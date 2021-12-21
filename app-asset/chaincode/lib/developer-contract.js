/*
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

let App = require('./App.js');
const { Contract } = require('fabric-contract-api');

class DeveloperContract extends Contract {

    async readApp(ctx, hash) {
        const exists = await this.appExists(ctx, hash);
        if (!exists) {
            throw new Error(`The app ${hash} does not exist`);
        }
        const buffer = await ctx.stub.getState(hash);
        let asset = JSON.parse(buffer.toString());
        asset = ({
            hash: hash,
            appName: asset.appName,
            developerName: asset.developerName,
            version: asset.version,
            category: asset.category,
            ratings: asset.ratings,
            reviews: asset.reviews,
        });
        return asset;
    }


    async appExists(ctx, hash) {
        const buffer = await ctx.stub.getState(hash);
        return (!!buffer && buffer.length > 0);
    }
    
    //Register app in the ledger
    async registerApp(ctx, args) {
        args = JSON.parse(args);

        if (args.hash === null || args.hash === '') {
            throw new Error(`Empty or null hash`);
        }
        let newApp = await new App(args.hash, args.appName, args.developerName, args.version,
            args.category);
        const exists = await this.appExists(ctx, newApp.hash);
        if (exists) {
            throw new Error(`The app ${newApp.hash} already exists`);
        }
        const buffer = Buffer.from(JSON.stringify(newApp));
        await ctx.stub.putState(newApp.hash, buffer);
    }

    //This function is to update app details. This function should be called by only developer.
    async updateAppDetails(ctx, args) {
        args = JSON.parse(args);
        let isDataChanged = false;
        let hash = args.hash;
        let newAppName = args.appName;
        let newDeveloperName = args.developerName;
        let newCategory = args.category;

        const app = await this.readApp(ctx, appId);

        if (newAppName !== null && newAppName !== '') {
            app.appName = newAppName;
            isDataChanged = true;
        }

        if (newDeveloperName !== null && newDeveloperName !== '') {
            app.developerName = newDeveloperName;
            isDataChanged = true;
        }

        if (newCategory !== null && newCategory !== '') {
            app.category = newCategory;
            isDataChanged = true;
        }

        if (isDataChanged === false) return;

        const buffer = Buffer.from(JSON.stringify(app));
        await ctx.stub.putState(hash, buffer);
    }
}
module.exports = DeveloperContract;