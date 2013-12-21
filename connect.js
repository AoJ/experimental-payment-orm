var orm = require("orm");
var fs = require("fs");

module.exports = function (cb) {
    orm.settings.set("connection.debug", true);
    
    orm.connect("mysql://zapakateldebug:tR9fruW9@lisa.allin1.cz/zapakateldebug", function (err, db) {
        if(err) throw err;
        db.settings.set("properties.association_key", "{field}");
        
        var models = {};
        
        fs.readdirSync("./models").forEach(function(file) {
            require("./models/" + file)(models, orm, db);
        });
        
        require("./associations")(models);
        
        cb(err, models);
    })
};