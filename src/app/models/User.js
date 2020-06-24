const ModelBase = require('./ModelBase');

ModelBase.init({ table: 'users' });

module.exports = { ...ModelBase };