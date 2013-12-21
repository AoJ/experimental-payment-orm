var _ = require("lodash");

/**
 * 
 * jeden activeRow převede na object
 * @TODO do budoucna je lepší, když se nechá původní activeRow
 *      tohle je jen pro účely lepšího dumpu :)
 */
var inspectRow = exports.inspectRow = function() {
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
var mapInspectCallback = exports.mapInspectCallback = function(err, resultArray) {
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
var mapInspectRecursiveCallback = exports.mapInspectRecursiveCallback = function(cb) {
    
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

var inspectRecursiveWrapper = exports.inspectRecursiveWrapper = function(foreignModels) {
    var properties = _.isArray(foreignModels) ? foreignModels : [foreignModels];
    
    return function mapChild(container, cb) {
        var data = this.inspect();
        for (var f in data) container[f] = data[f];
        var activeRow = this;
        var processed = 0;
        
        properties.forEach(function(property) {
            
            loadForeignTable(container, property, activeRow, function(err, res){
                processed++;
                if(properties.length === processed) cb(null, container);
            })
        })
    }
}


var loadForeignTable = exports.loadForeignTable = function(container, property, activeRow, cb) {
    var method = property ? capitaliseFirstLetter(property) : false;
    
    var foreignMethod = activeRow["get"+method];
    if(!foreignMethod || !method) return cb(null, container);
    
    foreignMethod(mapInspectRecursiveCallback(function(err, childResult){
        container[property] = childResult;
        cb(null, container);
    }))
}

var capitaliseFirstLetter = exports.capitaliseFirstLetter = function(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}