/**
 * Distro
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        sku: {
            type: 'STRING',
            unique: true
        },
        name: 'STRING',
        description: 'TEXT',
        photos: 'ARRAY',
        msrp: 'FLOAT',
        wholesale: 'FLOAT',
        category: 'STRING',
        stock: 'INTEGER'
    }

};
