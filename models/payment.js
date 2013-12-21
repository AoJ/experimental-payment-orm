var fn = require("../orm/func");

module.exports = function (models, orm, db) {
    models.Payment = db.define('payment', {
            payment_id          : { type: 'number', rational: false, required: true, unique: true },
            payment_variable    : { type: "number", retional: false, required: true, unique: true },
            payment_issue       : { type: 'date', required: true, time: true }
        }, {
            id: "payment_id",
            methods: {
                inspect: fn.inspectRow,
                inspectRecursive: fn.inspectRecursiveWrapper("vouchers")
            }
        }
    )
    return models.Payment;
};