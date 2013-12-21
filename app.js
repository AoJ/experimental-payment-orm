var db = require("./connect");
var util = require("util");
var fn = require("./orm/func");

db(function(err, model){
    model.Payment.find({payment_id: 255}, fn.mapInspectRecursiveCallback(function(err, payments){
        console.log(util.inspect(payments, {depth:null}))
    }));
})

