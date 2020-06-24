const ModelBase = require('./ModelBase');

ModelBase.init({ table: 'receipts' });

module.exports = { ...ModelBase };