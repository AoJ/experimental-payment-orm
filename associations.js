

module.exports = function (model) {
    model.PurchaseVariants.hasOne('variant', model.DealVariants, {reverse: 'purchaseVariants'});
    model.PurchaseVariants.hasOne('deal', model.Deal, {reverse: 'purchaseVariants'});
    model.PurchaseVariants.hasOne('voucher', model.Vouchers, {reverse: 'purchaseVariants'});
    model.Vouchers.hasOne("payment", model.Payment, {reverse: "vouchers"});
    model.DealVariants.hasOne("deal", model.Deal, {reverse: "variants"});
};