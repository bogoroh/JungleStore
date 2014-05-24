/**
 * Affiliate1
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes  : {
        sku: {
            type: 'INTEGER',
            unique: true
        },
        category: 'STRING',
        price: 'FLOAT'
    }

};
