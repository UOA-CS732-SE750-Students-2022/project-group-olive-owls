// MongoDB query
var MongoClient = require('mongodb').MongoClient;
//import mongoose from 'mongoose';

export default function mongodbTest() {
//var url = "mongodb://localhost:27017/";
    var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");
        var query = { first_name: "/^G/" };
        dbo.collection("Users").find(query).toArray(function(err, result) {
        if (err) throw err;
            console.log("Monogo data");
            console.log(result);
            db.close();
        });
    });
}
