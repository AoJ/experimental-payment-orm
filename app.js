var connect = require("./connect");
var util = require("util");
var fn = require("./orm/func");

var mysqlDsn = process.argv[2]; //mysql://zapakateldebug:XXXXXXX@lisa.allin1.cz/zapakateldebug

connect(mysqlDsn, function(err, model){
    
    
    /*model.Vouchers.find({deal_purchase_id: 255}, fn.mapInspectRecursiveCallback(function(err, payments){
        console.log(util.inspect(payments, {depth:null}))
    }));*/
    
    
    
    model.Payment.find({payment_id: 255}, fn.mapInspectRecursiveCallback(function(err, payments){
        console.log(util.inspect(payments, {depth:null}))
    }));
})

