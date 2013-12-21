var fn = require("../orm/func");

module.exports = function (models, orm, db) {
    models.DealVariants = db.define('deal_variant', {
        deal_variant_id             : { type: 'number', rational: false, required: true, unique: true },
        deal_id                     : { type: 'number', rational: false, required: true },
        deal_variant_title_cs       : { type: "text", required: true }
    }, {
        id: "deal_variant_id",
        methods: {
            inspect: fn.inspectRow,
            inspectRecursive: fn.inspectRecursiveWrapper("deal")
        }
    })
    return models.DealVariants;
};