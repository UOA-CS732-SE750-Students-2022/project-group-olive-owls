
//   Date: 6/4/2022                                                         S. Schmidt (ssch162)
//   Desc: This is the backend server for Olive Owls project.
//      It will handle all backend processing requests for the COVID app
//   which is being designed for the group project submission for CS732/SE750.
//
//   Date: 20/4/2022                            S. Schmidt
//   Desc: Made changes to include handling encrypted connections as well as some basic authentication.
// 	Move server.js to server.cjs (common JS format) to handle the "require" function correctly for MongoDB client libraries.
//
//   Date: 20/4/2022                            S. Schmidt
//   Desc: Added endpoints for CRUD operations on the Events table.
//


const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const port = 8010;
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const axiosKey = "d802faa0-10bd-11ec-b2fe-47a0872c6708";
const authKey = "Bearer 1234567890";

const fullDate = new Date();
const date = Date.now();
console.info("Inside server.js   Start: " + date.getTime);
var options = {
};
app = express()
app.use(cors());
app.use(express.json())
// 
// Defined Enpoints
//
app.get('/', (req, res) => {
    res.send('Now using https..');
});
// "axiostst" async endpoint.
//  Simple endpoint that Processes a fetch call to retrieve some information from an external source.
app.get('/axiostst', async (req, res) => {
    console.log("Inside /axiostst");
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    ip = ip.replace('::ffff:', '');
    //const loc = await axios.get('https://geolocation-db.com/json/');
    //const callString = 'https://geolocation-db.com/jsonp/'+axiosKey+'/'+ip;
    const loc = await axios.get('https://geolocation-db.com/jsonp/' + axiosKey + '/' + ip);
    //console.log(loc);
    console.log("Client IP: " + ip + "     JSON Response sent");
    res.status(200).contentType('text/html').send(JSON.stringify(loc.data));
    console.log(fullDate.toUTCString() + " /axiostst API:  Endpoint call from " + ip);
});

// "queryname" endpoint.
// Query on mongoDB using a defined string that has been passed as a parameter and return all received records from DB in JSON format
app.get('/queryname', (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    ip = ip.replace('::ffff:', '');
    const authHeader = req.headers.authorization;
    if (authHeader != authKey) {
        res.status(401).send('Authentication Error.');
        console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: " + authHeader);
        return;
    }
    console.log(authHeader);

    console.log("Inside /queryname. Client IP: " + ip);
    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
    var recData = '';
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");
        console.log("QueryName");
        console.log(req.query.id);
        //var query = { first_name: req.query.name };
        var id = parseInt(req.query.id);
        var query = { id: id };
        console.log(query);
        dbo.collection("Users").find(query).toArray(function (err, result) {
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


// "mongoquery" endpoint
// Query on mongoDB using a defined string that is hardcoded and return all received records from DB in JSON format
app.get('/mongoquery', (req, res) => {
    console.log("Inside /mongoquery");
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    ip = ip.replace('::ffff:', '');
    const authHeader = req.headers.authorization;
    if (authHeader != authKey) {
        res.status(401).send('Authentication Error.');
        console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: " + authHeader);
        return;
    }
    console.log(authHeader);
    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
    var recData = '';
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");
        var query = { first_name: /G/ };
        dbo.collection("Users").find(query).toArray(function (err, result) {
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
        });
    });
});


//===============================================
//  Events Endpoints
//===============================================
app.all('/verifytoken', (req, res) => {
    expiretokens();
    console.log("Inside /verifytoken");
    console.log(req.body);
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    ip = ip.replace('::ffff:', '');

    if (!req.body.authtoken) {        // Require valid auth token to be supplied
        res.status(401).send({ msg: 'Invalid auth token supplied', validtoken: false });
        console.log("Authentication Error!!! No token supplied.");
        return;       
    }

    tokenquerystring = req.body.authtoken+":"+ip;     // Build lookup string
    console.log("Built token query string: "+tokenquerystring)

    var searchresult = searchtokens(tokenquerystring);
    //console.log(searchresult);
    if (!searchresult) {
        res.status(401).send({ msg: 'No Auth token or Expired Auth token', validtoken: false });
        console.log("Authentication Error!!! No valid token in master table.");
        return;        
    };

    console.log("Found valid token in master table. token: "+req.body.authtoken+"   Expires: "+searchresult.tokenElement.expiredatetime);
    var responsertn = { };
    responsertn.msg = 'Token Valid';
    responsertn.expiredatetime = '';
    const expiredatetime = searchresult.tokenElement.expiredatetime;
    responsertn.expiredatetime = expiredatetime;
    responsertn.validtoken = true;
    res.status(200).send(responsertn);    
    console.log(fullDate.toUTCString()+" /verifytoken API:  Endpoint call from "+ip+". Result sent: "+responsertn);
    //console.log(searchresult);
});
// /getevent endpoint.
// 	Retrieve all events or event specified by eventID
//app.use(cors());
app.get('/getevent', (req, res) => {
    res.setHeader('Access-Control-Allow-Methods', '*');
    console.log("Inside /getevent");
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    ip = ip.replace('::ffff:', '');
    const authHeader = req.headers.authorization;
    if (authHeader != authKey) {
        res.status(401).send('Authentication Error.');
        console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: " + authHeader);
        return;
    }
    //console.log(authHeader);
    var eventid = req.query.eventid;
    //console.log("Received EventID: "+eventid);

    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
    var recData = '';
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");
        if (typeof eventid === "undefined") {
            var query = {};
        } else {
            var query = { eventID: 0 };
            query['eventID'] = parseInt(eventid);
        }
        //console.log("Query String: "+query);
        //console.log(query);
        dbo.collection("Events").find(query).toArray(function (err, result) {
            if (err) throw err;
            //console.log("Monogo data");
            //console.log(result);
            recData = result;
            db.close();
            //console.log("Final Return");
            //console.log(recData);
            //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Methods', '*');
            res.status(200).send(recData);
            console.log(fullDate.toUTCString() + " /getevent API:  Endpoint call from " + ip);
        });
    });
});

// /addevent endpoint.
// 	Insert a single record into Events table
app.all('/addevent', (req, res) => {
    console.log("Inside /addevent");
    //console.log(req.body);
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    ip = ip.replace('::ffff:', '');
    const authHeader = req.headers.authorization;
    if (authHeader != authKey) {
        res.status(401).send('Authentication Error.');
        console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: " + authHeader);
        return;
    }

    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
    var recData = '';

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");
        var Events = dbo.collection("Users");

        currentDate = new Date().toLocaleString("en-NZ", { timeZone: "Pacific/Auckland", timeZoneName: "short" }).replace(',', '');

        dbo.collection("Events").find({}).sort({ "eventID": -1 }).limit(1).toArray(function (err, result1) {
            if (err) throw err;
            const nextID = result1[0].eventID + 1;

            var newvalues = { eventID: 0, eventName: "", Description: "", Location: "", dateTime: "" };
            newvalues['dateTime'] = currentDate;
            newvalues['eventID'] = nextID;
            newvalues['eventName'] = req.body.eventName;
            newvalues['Description'] = req.body.Description;
            newvalues['Location'] = req.body.Location;
            newvalues['dateTime'] = req.body.dateTime;
            //console.log(newvalues);

            dbo.collection("Events").insertOne(newvalues, function (err, result2) {
                if (err) throw err;
                const recData = { eventID: 0, acknowledged: "", insertedId: "" };
                //console.log(newvalues.eventID);
                recData['eventID'] = newvalues.eventID;
                recData['acknowledged'] = result2.acknowledged;
                recData['insertedId'] = result2.insertedId;
                //console.log(recData);
                db.close();
                res.status(200).send(recData);
                const fullDate = new Date();
                console.log(fullDate.toUTCString() + " /addevent API: New eventID: " + newvalues.eventID + "  Endpoint call from " + ip);
            });
        });
    });
});

// /delevent endpoint.
//      Delete a specified event by eventID
app.get('/delevent', (req, res) => {
    console.log("Inside /delevent");
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    ip = ip.replace('::ffff:', '');
    const authHeader = req.headers.authorization;
    if (authHeader != authKey) {
        res.status(401).send('Authentication Error.');
        console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: " + authHeader);
        return;
    }
    //console.log(authHeader);
    var eventid = req.query.eventid;
    //console.log("Received EventID: "+eventid);

    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
    var recData = '';
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");
        if (typeof eventid === "undefined") {
            console.log(fullDate.toUTCString() + " /getevent API:  Endpoint call from " + ip + ". ERROR: No EventID specified. Exiting.");
            res.status(400).send({ error: "No Event ID supplied" });
            return;
        } else {
            var query = { eventID: 0 };
            query['eventID'] = parseInt(eventid);
        }
        //console.log("Query String: "+query);
        //console.log(query);
        dbo.collection("Events").deleteOne(query, function (err, result2) {
            //console.log(result2);
            const recData = { eventID: 0, acknowledged: "", deletedCount: 0 };
            //console.log(newvalues.eventID);
            recData['eventID'] = query.eventID;
            recData['acknowledged'] = result2.acknowledged;
            recData['deletedCount'] = result2.deletedCount;
            res.status(200).send(recData);
            const fullDate = new Date();
            console.log(fullDate.toUTCString() + " /delevent API:  Endpoint call from " + ip + ".");
            console.log(recData);
        });
    });
});

// /updevent endpoint.
//      Update a specified event by eventID
app.all('/updevent', (req, res) => {
    console.log("Inside /updevent");
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    ip = ip.replace('::ffff:', '');
    const authHeader = req.headers.authorization;
    if (authHeader != authKey) {
        res.status(401).send('Authentication Error.');
        console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: " + authHeader);
        return;
    }
    //console.log(authHeader);
    var eventid = req.query.eventid;
    //console.log("Received EventID: "+eventid);

    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
    var recData = '';
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");
        if (typeof eventid === "undefined") {
            console.log(fullDate.toUTCString() + " /getevent API:  Endpoint call from " + ip + ". ERROR: No EventID specified. Exiting.");
            res.status(400).send({ error: "No Event ID supplied" });
            return;
        } else {
            var query = { eventID: 0 };
            query['eventID'] = parseInt(eventid);
        }

        console.log(req.body);

        // example of parameter injection:    const updateDoc = { $set: { plot: `A harvest of random numbers, such as: ${Math.random()}` }, };

        //console.log("Query String: "+query);
        //console.log(query);
        dbo.collection("Events").updateOne(query, { $set: req.body }, function (err, result2) {
            //console.log(result2);
            const recData = { eventID: 0 };
            //console.log(newvalues.eventID);
            recData['eventID'] = query.eventID;
            recData['acknowledged'] = result2.acknowledged;
            recData['matchedCount'] = result2.matchedCount;
            recData['modifiedCount'] = result2.modifiedCount;
            recData['upsertedCount'] = result2.upsertedCount;
            res.status(200).send(recData);
            const fullDate = new Date();
            console.log(fullDate.toUTCString() + " /updevent API:  Endpoint call from " + ip + ".");
            console.log(recData);
        });
    });
});



//===============================================
//Auth  Stuff
masterTokenTable = [];
function generateRandom(len) {
    var crypto = require("crypto");
    return crypto.randomBytes(len).toString('hex');
}

// Expire tokens.
function expiretokens() {
    console.log("Inside expiretokens funciton");
    arraysize = Object.keys(masterTokenTable).length
    allexpired = true;                  // Default to true. If there are active tokens this will be set to true in the loop
    if (arraysize > 0) {
        const dd = {};
        //console.log(masterTokenTable);
        var iterationCounter = 1;
        for (var token in masterTokenTable) {
            dd[token] = masterTokenTable[token];
            console.log(dd[token].tokenElement.tokenkey);
            console.log(dd[token].tokenElement.expires);
            console.log(dd[token].tokenElement.expired);
            currenttimestamp = Math.floor(Date.now() / 1000);
            expiretimestamp = dd[token].tokenElement.expires;
            if ((currenttimestamp > expiretimestamp) && (!dd[token].tokenElement.expired)) {                   // Timestamp has expired. Mark token as expired.
                dd[token].tokenElement.expired = true;
                masterTokenTable[token].tokenElement.tokenkey = true;
                console.log(masterTokenTable[token].tokenElement.tokenkey + " has expired.");
            }
            if (!dd[token].tokenElement.expired) {   // We still have active tokens. don't clear object
                allexpired = false;
            }
            iterationCounter = iterationCounter + 1;
        }
        if (allexpired) {                 // All tokens have expired. clear tracking object
            masterTokenTable = [];
        }
    }
}

// Expire tokens.
function searchtokens(searchstring) {
    console.log("Inside searchtokens function");
    arraysize = Object.keys(masterTokenTable).length
    allexpired = true;                  // Default to true. If there are active tokens this will be set to true in the loop
    if (arraysize > 0) {
        const dd = {};
        //console.log(masterTokenTable);
        var iterationCounter = 1;
        for (var token in masterTokenTable) {
            dd[token] = masterTokenTable[token];
            if (!dd[token].tokenElement.expired) {
                if (dd[token].tokenElement.tokenkey === searchstring) {
                    console.log("String found");
                    return dd[token];
                }
            }
            iterationCounter = iterationCounter + 1;
        }
        return false;
    }
}
const admin = true; 
if (admin) {
    app.all('/dumptokens', (req, res) => {
        console.log("Inside /dumptokens");
        console.log(req.body);
        var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        ip = ip.replace('::ffff:', '');
        const authHeader = req.headers.authorization;
        if ((authHeader != authKey) && (!disableBearer)) {
            res.status(401).send('Authentication Error.');
            console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: " + authHeader);
            return;
        };

        res.status(200).send(masterTokenTable);
        const fullDate = new Date();
        console.log(fullDate.toUTCString() + " /dumptokens API:  Endpoint call from " + ip + ". Sending mastertokentable");
        expiretokens();
    });
};

//===============================================
//  token processing
//===============================================

// /authenticate endpoint.
// 	This endpoint must be accessed first to receive a token before doing any user processing
// Parameters: { "username": "<YourUserName>", "password": "<YourPassWord>" }

app.all('/authenticate', (req, res) => {
    console.log("Inside /requestauthtoken");
    expiretokens();
    console.log(req.body);
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    ip = ip.replace('::ffff:', '');
    const authHeader = req.headers.authorization;

    if (!req.body.username) {        // Require valid username to be supplied
        res.status(401).send({ error: 'Authentication Failed' });
        console.log("Authentication Error!!! No username supplied.");
        return;
    };

    if (!req.body.password) {        // Require valid username to be supplied
        res.status(401).send({ error: 'Authentication Failed' });
        console.log("Authentication Error!!! No password supplied for " + req.body.username);
        return;
    };

    // Validate username/password
    // **** TODO


    //  Ok, we got to here. All checks passed. Generate and send back auth token.
    const authToken = req.body.username + ":" + generateRandom(10);
    var tokenElement = {};
    tokenElement.tokenkey = authToken + ":" + ip;
    tokenElement.expires = Math.floor(Date.now() / 1000) + 1800;  // Expires in 30 mmintues
    //tokenElement.expires = Math.floor(Date.now() / 1000) + 120;  // Expires in 2 mmintues. Uncomment for testing
    tokenElement.expired = false;
    const expirymilliseconds = tokenElement.expires * 1000;
    const dateObject = new Date(expirymilliseconds);
    const expiryDateFormat = dateObject.toLocaleString();
    tokenElement.expiredatetime = expiryDateFormat;
    masterTokenTable.push({ tokenElement: tokenElement });

    // Fire back new token and expiry
    recData = {};
    recData.authtoken = authToken;
    recData.expirytimestamp = tokenElement.expires;
    recData.expirydatetime = expiryDateFormat;
    recData.status = "Authenticated OK";
    res.status(200).send(recData);

    const fullDate = new Date();
    console.log(fullDate.toUTCString() + " /updevent API:  Endpoint call from " + ip + ". New authToken sent: " + authToken);
    console.log(masterTokenTable);
});

//===============================================

//===============================================
//  User CRUD Endpoints
//===============================================

// /adduser endpoint.
// 	Insert a single record into User table
app.all('/adduser', (req, res) => {
    expiretokens();
    console.log("Inside /adduser");
    console.log(req.body);
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    ip = ip.replace('::ffff:', '');

    // if (!req.body.authtoken) {        // Require valid auth token to be supplied
    //     res.status(401).send({ error: 'Invalid auth token' });
    //     console.log("Authentication Error!!! No token supplied.");
    //     return;
    // }

    // tokenquerystring = req.body.authtoken + ":" + ip;     // Build lookup string
    // console.log("Built token query string: " + tokenquerystring)

    // var searchresult = searchtokens(tokenquerystring);
    // console.log(searchresult);
    // if (!searchresult) {
    //     res.status(401).send({ error: 'No Auth token or Expired Auth token. Add Failed' });
    //     console.log("Authentication Error!!! No valid token in master table.");
    //     return;
    // };

    // // Future: Validate incoming data


    // console.log("Found valid token in master table. Good to go.");
    // console.log(searchresult);

    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";


    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");
        currentDate = new Date().toLocaleString("en-NZ", { timeZone: "Pacific/Auckland", timeZoneName: "short" }).replace(',', '');

        dbo.collection("Users").find({}).sort({ "userid": -1 }).limit(1).toArray(function (err, result1) {
            if (err) throw err;
            //console.log(result1[0]);
            var nextid = 0;
            if (typeof result1[0] === "undefined") {
                nextid = 1;
            } else {
                nextid = result1[0].userid + 1;
            }
            //console.log("userid: "+nextid);
            var newvalues = {};
            newvalues['userid'] = nextid;
            newvalues['username'] = req.body.username;
            newvalues['password'] = req.body.password;  // *** TODO: Use CryptoJS to create hashvalue and store hashvalue instead. All auths will be on hashvalue.
            newvalues['dateCreated'] = currentDate;
            newvalues['status'] = 'A';
            newvalues['userlevel'] = 'S';               // Default to Staff. Future validation - Options S = Staff, A = Admin, U = User
            newvalues['staffID'] = '';
            newvalues['lastLogin'] = '';
            newvalues['loginIP'] = '';
            //console.log(newvalues);

            dbo.collection("Users").insertOne(newvalues, function (err, result2) {
                if (err) {
                    //throw err;
                    if (err.code === 11000) {
                        // Duplicate username
                        console.log("Duplicate username");
                        return res.status(422).send({ status: "failed", message: 'User already exist!' });
                    }
                    console.log(err);
                    // Some other error
                    return res.status(422).send(err);
                };
                const recData = { username: '', acknowledged: "", insertedId: "" };
                //console.log(newvalues.eventID);
                recData['username'] = newvalues.username;
                recData['acknowledged'] = result2.acknowledged;
                recData['insertedId'] = result2.insertedId;
                //console.log(recData);
                db.close();
                res.status(200).send(recData);
                const fullDate = new Date();
                console.log(fullDate.toUTCString() + " /adduser API: Endpoint call from " + ip);
            });
        });
    });
});

// /upduser endpoint.
//      Update user details
app.all('/upduser', (req, res) => {
    console.log("Inside /upduser");
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    ip = ip.replace('::ffff:', '');
    const authHeader = req.headers.authorization;

    if (!req.body.authtoken) {                          // Require valid auth token to be supplied
        res.status(401).send({ error: 'Invalid auth token' });
        console.log("Authentication Error!!! No token supplied.");
        return;
    }

    tokenquerystring = req.body.authtoken + ":" + ip;       // Build lookup string
    console.log("Built token query string: " + tokenquerystring)

    var searchresult = searchtokens(tokenquerystring);
    console.log(searchresult);
    if (!searchresult) {
        res.status(401).send({ error: 'No Auth token or Expired Auth token. Add Failed' });
        console.log("Authentication Error!!! No valid token in master table.");
        return;
    };

    // Future: Validate incoming data


    var query = { username: "" };
    query['username'] = req.body.username;   // Set query: username being updated
    console.log(query);

    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
    var recData = '';
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");

        // The whole request body is sent. It is already in JSON and formatted
        dbo.collection("Users").updateOne(query, { $set: req.body }, function (err, result2) {
            //console.log(result2);
            const recData = {};
            //console.log(newvalues.eventID);
            recData['username'] = query.username;
            recData['acknowledged'] = result2.acknowledged;
            recData['matchedCount'] = result2.matchedCount;
            recData['modifiedCount'] = result2.modifiedCount;
            recData['upsertedCount'] = result2.upsertedCount;
            res.status(200).send(recData);
            const fullDate = new Date();
            console.log(fullDate.toUTCString() + " /upduser API:  Endpoint call from " + ip + ".");
            console.log(recData);
        });
    });
});

// /getuser endpoint.
// 	Retrieve info for specified username
app.all('/getuser', (req, res) => {
    expiretokens();
    console.log("Inside /getuser");
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    ip = ip.replace('::ffff:', '');
    const authHeader = req.headers.authorization;

    if (!req.body.authtoken) {        // Require valid auth token to be supplied
        res.status(401).send({ error: 'Invalid auth token' });
        console.log("Authentication Error!!! No token supplied.");
        return;
    }

    tokenquerystring = req.body.authtoken + ":" + ip;     // Build lookup string
    console.log("Built token query string: " + tokenquerystring)

    var searchresult = searchtokens(tokenquerystring);
    console.log(searchresult);
    if (!searchresult) {
        res.status(401).send({ error: 'No Auth token or Expired Auth token. Add Failed' });
        console.log("Authentication Error!!! No valid token in master table.");
        return;
    };

    console.log("Found valid token in master table. Good to go.");
    console.log(searchresult);

    var username = req.body.username;

    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
    var recData = '';
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");
        var query = { username: "" };
        query['username'] = username;
        console.log("Query String: " + query);
        //console.log(query);
        dbo.collection("Users").find(query).toArray(function (err, result) {
            if (err) throw err;
            //console.log("Monogo data");
            //console.log(result);
            recData = result;
            db.close();
            //console.log("Final Return");
            //console.log(recData);
            //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Methods', '*');
            res.status(200).send(recData);
            const fullDate = new Date();
            console.log(fullDate.toUTCString() + " /getevent API:  Endpoint call from " + ip);
        });
    });
});


//===============================================
//===============================================

var server = http.createServer(options, app);

server.listen(port, () => {
    console.log("server starting on port : " + port)
});