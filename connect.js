var orm = require("orm");
var fs = require("fs");

module.exports = function (dsn, cb) {
    orm.settings.set("connection.debug", true);
    
    orm.connect(dsn, function (err, db) {
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