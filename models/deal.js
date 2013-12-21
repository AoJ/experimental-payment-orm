var fn = require("../orm/func");

module.exports = function (models, orm, db) {
    models.Deal = db.define('deal', {
        deal_id                             : { type: 'number', rational: false, required: true },
        deal_title_newsletter_cs            : { type: 'text', required: true }
    }, {
        id: "deal_id",
        methods: {
            inspect: fn.inspectRow,
            inspectRecursive: fn.inspectRecursiveWrapper()
        }
    })
    return models.Deal;
};