/*
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

let App = require('./App.js');
const { Contract } = require('fabric-contract-api');

class UserContract extends Contract {

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

    async giveReviews(ctx, args) {
        args = JSON.parse(args);
        let hash = args.hash;
        let reviews = args.reviews;

        // Get the app asset from world state
        const app = await this.readApp(ctx, hash);
        app.reviews.push(reviews);
        const buffer = Buffer.from(JSON.stringify(app));
        // Update the ledger with updated reviews
        await ctx.stub.putState(hash, buffer);
    };

    async giveRatings(ctx, args) {
        args = JSON.parse(args);
        let hash = args.hash;
        let ratings = args.ratings;

        // Get the app asset from world state
        const app = await this.readApp(ctx, hash);
        app.ratings.push(ratings);
        const buffer = Buffer.from(JSON.stringify(app));
        // Update the ledger with updated ratings
        await ctx.stub.putState(hash, buffer);
    };

    async readReviews(ctx, hash) {
        let app = await this.readApp(ctx, hash);
        app = ({
            reviews: app.reviews})
        return app;
    }

    async readRatings(ctx, hash) {
        let app = await this.readApp(ctx, hash);
        app = ({
            ratings: app.ratings})
        return app;
    }

    
}
module.exports = DeveloperContract;