//   Date: 6/4/2022                                                         S. Schmidt (ssch162)
//   Desc: This is the backend server for Olive Owls project.
//      It will handle all backend processing requests for the COVID app
//   which is being designed for the group project submission for CS732/SE750.
//

import express from 'express';
import path from 'path';
import axios from 'axios';

//------------- Function Calls -------------------------  Work in progress. Not currently used.
function findIP(req) {
    console.log("In findIP()");
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    //var ipaddr = '';

    //fetch(`https://geolocation-db.com/json/`)
    //.then(resp => resp.json())
    //console.log(resp);

    //const getData = async () => {
    //    const loc = await axios.get('https://geolocation-db.com/json/')
    //    //const loc = axios.get('https://geolocation-db.com/json/')
    //    console.log("Loc Data");
    //    console.log(loc.data);
    //    const ip = loc.data.IPv4;
    //    console.log("IP: "+ip);
    //    ipaddr = loc.data.IPv4;
    //}

    //ipaddr = getData.data.IPv4;
    //console.log(ipaddr);
    return ip;
}

function mongodbTest() {
    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;

//var url = "mongodb://localhost:27017/";
    var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
    var recData = '';

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");
        var query = { first_name: "Giavani" };
        dbo.collection("Users").find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log("err:");
            console.log(err);
            console.log("Monogo data");
            console.log(result);
            recData = result;
            db.close();
            console.log("Fianl Return");
            console.log(recData);
            return recData;            
        });

    });

}


//------------------------------------------------------
// Main code
//------------------------------------------------------

const date = Date.now();
console.info("Inside server.js   Start: "+date.getTime);

// Setup Express
const app = express();
const port = process.env.PORT || 3000;      // Port to listen on
app.use(express.json());                    // Setup JSON parsing req body

// Setup our routes.

// ==========================
//  Endpoints
// ==========================

// default Endpoint
app.get('/', (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    var output = '<!DOCTYPE html><html><head><title>Default endpoint. Served from an Express!</title></head><body><h1>Default endpoint!!!</h1><p>This HTML content was served from an Express endpoint!</p><p>Your IP is '+ip+'</p></body></html>';
    res.status(200).contentType('text/html').send(output);
});

// "api" endpoint. 
// Simple endpoint test that returns name if supplied and IP address
app.get('/api', (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    console.log("Inside /api. Client IP: "+ip);
    res.json({
        Endpoint: '/api',
        name: req.query.name,
        ip: ip
    });
});

// "axiostst" async endpoint. 
//  Simple endpoint that Processes a fetch call to retrieve some information from an external source.
app.get('/axiostst', async (req, res) => {
    console.log("Inside /axiostst");
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    const loc = await axios.get('https://geolocation-db.com/json/');
    console.log(loc);
    console.log("Client IP: "+ip+"     JSON Response sent");
    res.status(200).contentType('text/html').send(JSON.stringify(loc.data));    
});

// "mongoquery" endpoint
// Query on mongoDB using a defined string that is hardcoded and return all received records from DB in JSON format
app.get('/mongoquery', (req, res) => {
    console.log("Inside /mongoquery");
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
    var recData = '';
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");
        var query = { first_name: /G/ };
        dbo.collection("Users").find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log("err:");
            console.log(err);
            console.log("Monogo data");
            console.log(result);
            recData = result;
            db.close();
            console.log("Fianl Return");
            console.log(recData);
            res.status(200).send(recData);
            //return recData;            
        });

    });

    console.log("Call return") ;
    console.log(recData);
    //res.status(200).contentType('text/html').send(output);
});

// "queryname" endpoint. 
// Query on mongoDB using a defined string that has been passed as a parameter and return all received records from DB in JSON format
app.get('/queryname', (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    console.log("Inside /queryname. Client IP: "+ip);
    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
    var recData = '';
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");
        console.log("QueryName");
        console.log(req.query.id);
        //var query = { first_name: req.query.name };
        var id = parseInt(req.query.id);
        var query = { id: id };
        console.log(query); 
        dbo.collection("Users").find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log("err:");
            console.log(err);
            console.log("Monogo data");
            console.log(result);
            recData = result;
            db.close();
            console.log("Final Return");
            console.log(recData);
            res.status(200).send(recData);
            //res.json(recData);
            //return recData;            
        });

    });    
    //res.json({
    //    Endpoint: '/api',
    //    name: req.query.name,
    //    ip: ip
    //});

    //res.json({ recData });

});

// ==========================
//  End of Endpoints
// ==========================



// Make the "public" folder available statically
app.use(express.static(path.join(__dirname, 'public')));

// Start the server running. Once the server is running, the given function will be called, which will
// log a simple message to the server console. Any console.log() statements in your node.js code
// can be seen in the terminal window used to run the server.
app.listen(port, () => console.log(`App server listening on port ${port}!`));