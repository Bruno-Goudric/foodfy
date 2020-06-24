const ModelBase = require('./ModelBase');

ModelBase.init({ table: 'files' });

module.exports = { ...ModelBase };