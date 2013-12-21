var fn = require("../orm/func");

module.exports = function (models, orm, db) {
    models.Vouchers = db.define('deal_purchase', {
        deal_purchase_id    : { type: 'number', rational: false, required: true, unique: true },
        payment_id          : { type: 'number', rational: false, required: true },
        deal_purchase_email : { type: "text", required: true }
    }, {
        id: "deal_purchase_id",
        methods: {
            inspect: fn.inspectRow,
            inspectRecursive: fn.inspectRecursiveWrapper("purchaseVariants")
        }
    })
    return models.Vouchers;
};