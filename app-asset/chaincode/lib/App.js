/*
 * SPDX-License-Identifier: Apache-2.0
 */


class App {

    constructor(hash, appName, developerName, version, category)
    {
        this.hash = hash;
        this.appName = appName;
        this.developerName = developerName;
        this.version = version;
        this.category = category;
        this.ratings = [];
        this.reviews = [];
        return this;
    }
}
module.exports = App