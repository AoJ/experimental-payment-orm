var fn = require("../orm/func");

module.exports = function (models, orm, db) {
    models.PurchaseVariants = db.define('deal_purchase_has_deal_variant', {
        deal_purchase_has_deal_variant_id   : { type: "number", retional: false, required: true, unique: true },
        deal_purchase_id                    : { type: 'number', rational: false, required: true },
        deal_id                             : { type: "number", retional: false, required: true }
    }, {
        id: "deal_purchase_has_deal_variant_id",
        methods: {
            inspect: fn.inspectRow,
            inspectRecursive: fn.inspectRecursiveWrapper(["variant", "deal"])
        }
    })
    return models.PurchaseVariants;
};