const ModelBase = require('./ModelBase');

ModelBase.init({ table: 'chefs' });

module.exports = { ...ModelBase };