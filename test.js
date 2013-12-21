
var orm = require("orm");
var util = require("util");
var _ = require("lodash");
var lazy = require("lazy.js");


    orm.settings.set("connection.debug", true);

var Payment, Vouchers, Deal, DealVariants, PurchaseVariants;

orm.connect("mysql://zapakateldebug:tR9fruW9@lisa.allin1.cz/zapakateldebug", function (err, db) {
    if(err) throw err;
    
    init(orm, db);
    
    Payment.find({payment_id: 255}, mapInspectRecursiveCallback(function(err, payments){
        console.log(util.inspect(payments, {depth:null}))
    }));
    
    
})

/**
 * 
 * jeden activeRow převede na object
 * @TODO do budoucna je lepší, když se nechá původní activeRow
 *      tohle je jen pro účely lepšího dumpu :)
 */
function inspectRow() {
    var row = this;
    var data = {};
    for(var field in row) {
        data[field] = row[field];
    }
    return data;
}


/**
 * 
 * @param {} err
 * @param {} resultArray
 * @TODO oneToOne
 */
function mapInspectCallback(err, resultArray) {
    if(err) throw err;
    
    var rows = resultArray.map(function(row){
        return row.inspect();
    })
    
    return rows;
}

/**
 * vygeneruje callback pro načtení vazební tabulky
 * počítá s OneToOne a OneToMany
 * 
 * 
 */
function mapInspectRecursiveCallback(cb) {
    
    return function(err, result) {
        if(err) throw err;
        
        var isCollection = _.isArray(result);
        var rows = []; //použije se pouze v případě kolekce
        
        var resultArray = isCollection ? result : [result];
        
        resultArray.map(function(row){
            var data = {};
            row.inspectRecursive(data, function(err){
                if(isCollection) {
                    rows.push(data);
                    if(rows.length === resultArray.length) cb(null, rows);
                } else cb(null, data);
                
            })
            
        });
        
    }
}

function inspectRecursiveWrapper(foreignModel) {
    var property = foreignModel;
    var method = property ? capitaliseFirstLetter(property) : false;
    
    return function mapChild(container, cb) {
        var data = this.inspect();
        for (var f in data) container[f] = data[f];
        
        var foreignMethod = this["get"+method];
        if(!foreignMethod) return cb(null, container);
        
        foreignMethod(mapInspectRecursiveCallback(function(err, childResult){
            container[property] = childResult;
            cb(null, container);
            
        }))
    }
}


function implodeChildTable(container, property, activeRow, cb) {
    var results = [];
}

function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function init(orm, db) {
    db.settings.set("properties.association_key", "{field}");
    
    Payment = db.define('payment', {
            payment_id          : { type: 'number', rational: false, required: true, unique: true },
            payment_variable    : { type: "number", retional: false, required: true, unique: true },
            payment_issue       : { type: 'date', required: true, time: true }
        }, {
            id: "payment_id",
            methods: {
                inspect: inspectRow,
                inspectRecursive: inspectRecursiveWrapper("vouchers")
            }
        }
    )
    
    
    
    
    Vouchers = db.define('deal_purchase', {
        deal_purchase_id    : { type: 'number', rational: false, required: true, unique: true },
        payment_id          : { type: 'number', rational: false, required: true },
        deal_purchase_email : { type: "text", required: true }
    }, {
        id: "deal_purchase_id",
        methods: {
            inspect: inspectRow,
            inspectRecursive: inspectRecursiveWrapper("purchaseVariants")
        }
    })
    
    
    
    
    
    
    PurchaseVariants = db.define('deal_purchase_has_deal_variant', {
        deal_purchase_has_deal_variant_id   : { type: "number", retional: false, required: true, unique: true },
        deal_purchase_id                    : { type: 'number', rational: false, required: true },
        deal_id                             : { type: "number", retional: false, required: true }
    }, {
        id: "deal_purchase_has_deal_variant_id",
        methods: {
            inspect: inspectRow,
            inspectRecursive: inspectRecursiveWrapper("variant")
        }
    })
    
    
    
    
    DealVariants = db.define('deal_variant', {
        deal_variant_id             : { type: 'number', rational: false, required: true, unique: true },
        deal_id                     : { type: 'number', rational: false, required: true },
        deal_variant_title_cs       : { type: "text", required: true }
    }, {
        id: "deal_variant_id",
        methods: {
            inspect: inspectRow,
            inspectRecursive: inspectRecursiveWrapper("deal")
        }
    })
    
    
    
    
    
    Deal = db.define('deal', {
        deal_id                             : { type: 'number', rational: false, required: true },
        deal_title_newsletter_cs            : { type: 'text', required: true }
    }, {
        id: "deal_id",
        methods: {
            inspect: inspectRow,
            inspectRecursive: inspectRecursiveWrapper()
        }
    })
    
    
    //Vouchers.hasOne('payment', Payment, {reverse: 'vouchers'});
    

    PurchaseVariants.hasOne('variant', DealVariants, {reverse: 'purchaseVariants'});
    PurchaseVariants.hasOne('voucher', Vouchers, {reverse: 'purchaseVariants'});
    Vouchers.hasOne("payment", Payment, {reverse: "vouchers"});
    DealVariants.hasOne("deal", Deal, {reverse: "variants"});
    
    
    //DealVariant.hasMany('purchases', Purchase, { why: String }, { reverse: 'deals' })
    
    
    
}