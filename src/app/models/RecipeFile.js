const ModelBase = require('./ModelBase');

ModelBase.init({ table: 'recipe_files' });

module.exports = { ...ModelBase };