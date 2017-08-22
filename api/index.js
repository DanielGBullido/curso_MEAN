'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean2', function (err, res) {
    //mongod --dbpath /Users/danielgbullido/Projects/ownProyects/curso-mean2/bbdd
    if (err) {
        throw err;
    } else {
        console.log("Ok connect luck bbdd");
        app.listen(port, function () {
            console.log("server is running");
        });
        return mongoose.connection;
    }
});