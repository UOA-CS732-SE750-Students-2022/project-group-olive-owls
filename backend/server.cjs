
//   Date: 6/4/2022                                                         S. Schmidt (ssch162)
//   Desc: This is the backend server for Olive Owls project.
//      It will handle all backend processing requests for the COVID app
//   which is being designed for the group project submission for CS732/SE750.
//

//      There are 3 control switches that control activation of features in the server backend.
//          # "disableHTTPS" which allows HTTPS to be switched on or off in code.                           Default: true
//          # "disableBEARER" which allows bearer authentication to be switched on or off in code.          Default: true
//          # "admin" which allows admin endpoints switched on or off in code. (useful for debugging)       Default: true
//
// ##################################
//   Modification History
// ##################################
//

//   Date: 20/4/2022                            S. Schmidt
//   Desc: Made changes to include handling encrypted connections as well as some basic authentication.
// 	Move server.js to server.cjs (common JS format) to handle the "require" function correctly for MongoDB client libraries.
//
//   Date: 20/4/2022                            S. Schmidt
//   Desc: Added endpoints for CRUD operations on the Events table.
//
//   Date: 3/5/2022                             S. Schmidt
//   Desc: 
//      - Added 3 control switchs
//          # "disableHTTPS" which allows HTTPS to be switched on or off in code.
//          # "disableBEARER" which allows bearer authentication to be switched on or off in code.
//          # "admin" which allows admin endpoints switched on or off in code. (useful for debugging)
//      - Added endpoints for User access control. 
//          # User Token Authentication processing
//          # CRUD funtions against user authentication table entries
//          # STILL TODO: Authenticaton logging
//
//   Date: 10/5/2022                            S. Schmidt
//   Desc:  Removed token validation in endpoint /adduser. 
//          Added new endpoint to Users. /verifytoken
//           - Confirms supplied token is valid
//          Added cors (cross-origin resource sharing) library.
//
//   Date: 10/5/2022                            Guanxiang Zhao (gzha644)
//   Desc: Added endpoints for Bubbles.
//
//   Date: 11/5/2022                            S. Schmidt
//   Desc:  Added new endpoints for Association table
//           - /addassoc     /getassoc    /delassoc
//
//   Date: 11/5/2022                            S. Schmidt
//   Desc:  Added new CRUD endpoints for Staff table
//           - /addstaff     /getstaff    /updstaff     /desctivatestaff
//          Change MongoDB connection string to be a central varible that functions reference rather than a 
//           string in the local functions.
//          Added createindex on ID's for Staff, Associations & Events.
//           Ensures ID's are unique and lookups are faster. 
//             When insertOne functions are processed by MongoDB, if the table doesn't exist, it will be created 
//             and then a unique index added on the ID for the table.
//
//   Date: 14/5/2022                            S. Schmidt
//   Desc: Change MongoDB connection string to be a central varible that Bubble endpoints reference rather than a 
//           string in the local functions. Additions to change made by gzha644.
//
//
//   Date: 14/5/2022                            Guanxiang Zhao
//   Desc: Added upload image endpoint

function generateRandom (len) {
    var crypto = require("crypto");
    return crypto.randomBytes(len).toString('hex');
}

// Expire tokens.
  function expiretokens () {
    console.log("Inside expiretokens funciton");
    arraysize = Object.keys(masterTokenTable).length
    allexpired = true;                  // Default to true. If there are active tokens this will be set to true in the loop
    if (arraysize > 0) {
        const dd = {};
        //console.log(masterTokenTable);
        var iterationCounter =1;
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
                console.log(masterTokenTable[token].tokenElement.tokenkey+" has expired.") ;
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
function searchtokens (searchstring) {
    console.log("Inside searchtokens function");
    arraysize = Object.keys(masterTokenTable).length
    allexpired = true;                  // Default to true. If there are active tokens this will be set to true in the loop
    if (arraysize > 0) {
        const dd = {};
        //console.log(masterTokenTable);
        var iterationCounter =1;
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


const fileUpload = require('express-fileupload');
const express = require('express');
const https = require('https');
const http  = require('http');
const fs = require('fs');
const cors = require('cors');
//const port = 8010;
const axios = require('axios');
const path = require('path');
const { Console } = require("console");
const { exit } = require("process");
const { response } = require("express");

const axiosKey = "d802faa0-10bd-11ec-b2fe-47a0872c6708";
const authKey = "Bearer 1234567890";
masterTokenTable = [];

const fullDate = new Date();
const date = Date.now();

// Control switches
const disableHTTPS = true;      // Disable HTTPS for dev mode. Change to true for prod mode
const disableBearer = true;     // Disable Bearer Auth for dev mode. Change to true for prod mode
const admin = true;             // Admin processing functions available like dumpmastertokens endpoint for debugging
const port = 8010;              // Port number to open server on 

// MongoDB connecttivity
var MongoDBConnString = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";

console.info("Inside server.js   Start: "+date.getTime);

// Load HTTPS cert
if (!disableHTTPS) {
    var key = fs.readFileSync(__dirname + '/certs/privkey.pem');
    var cert = fs.readFileSync(__dirname + '/certs/fullchain.pem');
    var options = {
        key: key,
        cert: cert
    }
};

app = express();

app.use(cors());

app.use(express.json())

app.use(fileUpload());


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
    const authHeader = req.headers.authorization;
    if (!disableBearer) {
        if (authHeader != authKey) {
            res.status(401).send({ error: 'Authentication Error.'} );
            console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: "+authHeader);
            return;
        }
    };

    // ip="114.23.125.78";   // Test IP. Located in Auckland.
    const loc = await axios.get('https://geolocation-db.com/jsonp/'+axiosKey+'/'+ip);
    //console.log(loc);
    console.log("Client IP: "+ip+"     JSON Response sent");
    res.status(200).contentType('text/html').send(JSON.stringify(loc.data));
    console.log(fullDate.toUTCString()+" /axiostst API:  Endpoint call from "+ip);
});

// "queryname" endpoint.
// Query on mongoDB using a defined string that has been passed as a parameter and return all received records from DB in JSON format
app.get('/queryname', (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    ip = ip.replace('::ffff:', '');
    const authHeader = req.headers.authorization;
    if (!disableBearer) {
        if (authHeader != authKey) {
            res.status(401).send({ error: 'Authentication Error.'} );
            console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: "+authHeader);
            return;
        }
    };

    console.log(authHeader);

    console.log("Inside /queryname. Client IP: "+ip);
    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = MongoDBConnString;
    //var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
    var recData = '';
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");
        console.log("QueryName");
        console.log(req.query.userid);
        //var query = { first_name: req.query.name };
        var id = parseInt(req.query.userid);
        var query = { userid: id };
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


// "mongoquery" endpoint
// Query on mongoDB using a defined string that is hardcoded and return all received records from DB in JSON format
app.get('/mongoquery', (req, res) => {
    console.log("Inside /mongoquery");
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    ip = ip.replace('::ffff:', '');
    const authHeader = req.headers.authorization;
    if (!disableBearer) {
        if (authHeader != authKey) {
            res.status(401).send({ error: 'Authentication Error.'} );
            console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: "+authHeader);
            return;
        }
    };

    console.log(authHeader);
    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = MongoDBConnString;
    //var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
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
            console.log("Final Return");
            console.log(recData);
            res.status(200).send(recData);
        });
    });
});


//===============================================
//  Events Endpoints
//===============================================

//app.all('/verifytoken', (req, res) => {
//    expiretokens();
//    console.log("Inside /verifytoken");
//    console.log(req.body);
//    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
//    ip = ip.replace('::ffff:', '');
//
//    if (!req.body.authtoken) {        // Require valid auth token to be supplied
//        res.status(401).send({ msg: 'Invalid auth token supplied', validtoken: false });
//        console.log("Authentication Error!!! No token supplied.");
//        return;       
//    }
//
//    tokenquerystring = req.body.authtoken+":"+ip;     // Build lookup string
//    console.log("Built token query string: "+tokenquerystring)
//
//    var searchresult = searchtokens(tokenquerystring);
//    //console.log(searchresult);
//    if (!searchresult) {
//        res.status(401).send({ msg: 'No Auth token or Expired Auth token', validtoken: false });
//        console.log("Authentication Error!!! No valid token in master table.");
//        return;        
//    };
//
//    console.log("Found valid token in master table. token: "+req.body.authtoken+"   Expires: "+searchresult.tokenElement.expiredatetime);
//    var responsertn = { };
//    responsertn.msg = 'Token Valid';
//    responsertn.expiredatetime = '';
//    const expiredatetime = searchresult.tokenElement.expiredatetime;
//    responsertn.expiredatetime = expiredatetime;
//    responsertn.validtoken = true;
//    res.status(200).send(responsertn);    
//    console.log(fullDate.toUTCString()+" /verifytoken API:  Endpoint call from "+ip+". Result sent: "+responsertn);
//    //console.log(searchresult);
//});

// /getevent endpoint.
// 	Retrieve all events or event specified by eventID
//app.use(cors());
app.all('/getevent', (req, res) => {
    res.setHeader('Access-Control-Allow-Methods', '*');
    console.log("Inside /getevent");
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    ip = ip.replace('::ffff:', '');
    const authHeader = req.headers.authorization;
    if (!disableBearer) {
        if (authHeader != authKey) {
            res.status(401).send({ error: 'Authentication Error.'} );
            console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: "+authHeader);
            return;
        }
    };

    //console.log(authHeader);
    var eventid = req.query.eventid;
    //console.log("Received EventID: "+eventid);

    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = MongoDBConnString;
    //var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
    var recData = '';
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");
	if (typeof eventid === "undefined") {
  		var query = {};
	} else	{
        	var query = { eventID : 0 };
		query['eventID'] = parseInt(eventid);
	}
	//console.log("Query String: "+query);
        //console.log(query);
        dbo.collection("Events").find(query).toArray(function(err, result) {
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
	        console.log(fullDate.toUTCString()+" /getevent API:  Endpoint call from "+ip);
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
    if (!disableBearer) {
        if (authHeader != authKey) {
            res.status(401).send({ error: 'Authentication Error.'} );
            console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: "+authHeader);
            return;
        }
    };

    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = MongoDBConnString;
    //var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
    var recData = '';

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");
	    var Events = dbo.collection("Users");

    	currentDate = new Date().toLocaleString("en-NZ", {timeZone: "Pacific/Auckland",timeZoneName: "short"}).replace(',','');

	dbo.collection("Events").find({}).sort({"eventID" : -1}).limit(1).toArray(function(err, result1) {
        if (err) throw err;
		const nextID = result1[0].eventID + 1;

		var newvalues = { eventID: 0,  eventName: "", Description: "", Location: "", dateTime: ""};
		newvalues['dateTime'] = currentDate;
		newvalues['eventID'] = nextID;
		newvalues['eventName'] = req.body.eventName;
        newvalues['Description'] =  req.body.Description;
        newvalues['Location']    =  req.body.Location;
        newvalues['dateTime']    =  req.body.dateTime;
		//console.log(newvalues);

        	dbo.collection("Events").insertOne(newvalues, function(err, result2) {
       		    if (err) throw err;
			    const recData = { eventID: 0, acknowledged: "", insertedId:"" };
			    //console.log(newvalues.eventID);
			    recData['eventID'] = newvalues.eventID;
			    recData['acknowledged'] = result2.acknowledged;
            	recData['insertedId'] = result2.insertedId;
			    //console.log(recData);
            	res.status(200).send(recData);
                const fullDate = new Date();
			    console.log(fullDate.toUTCString()+" /addevent API: New eventID: "+newvalues.eventID+"  Endpoint call from "+ip);
                // Catchall. Makesure an index exists for staffID. Ensures a unique ID and quick lookups.
                dbo.collection("Events").createIndex( { "eventID": 1 }, { unique: true } );
                //db.close();
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
    if (!disableBearer) {
        if (authHeader != authKey) {
            res.status(401).send({ error: 'Authentication Error.'} );
            console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: "+authHeader);
            return;
        }
    };
    //console.log(authHeader);
    var eventid = req.query.eventid;
    //console.log("Received EventID: "+eventid);

    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = MongoDBConnString;
    //var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
    var recData = '';
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");
        if (typeof eventid === "undefined") {
		    console.log(fullDate.toUTCString()+" /delevent API:  Endpoint call from "+ip+". ERROR: No EventID specified. Exiting.");
		    res.status(400).send( { error: "No Event ID supplied" } );
		    return;
        } else  {
            var query = { eventID : 0 };
            query['eventID'] = parseInt(eventid);
        }
        //console.log("Query String: "+query);
        //console.log(query);
        dbo.collection("Events").deleteOne(query, function(err, result2) {
		    //console.log(result2);
            const recData = { eventID: 0, acknowledged: "", deletedCount: 0 };
            //console.log(newvalues.eventID);
            recData['eventID'] = query.eventID;
            recData['acknowledged'] = result2.acknowledged;
            recData['deletedCount'] = result2.deletedCount;
		    res.status(200).send(recData);
            const fullDate = new Date();
		    console.log(fullDate.toUTCString()+" /delevent API:  Endpoint call from "+ip+".");
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
    if (!disableBearer) {
        if (authHeader != authKey) {
            res.status(401).send({ error: 'Authentication Error.'} );
            console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: "+authHeader);
            return;
        }
    };
    //console.log(authHeader);
    var eventid = req.query.eventid;
    //console.log("Received EventID: "+eventid);

    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = MongoDBConnString;
    //var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
    var recData = '';
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");
        if (typeof eventid === "undefined") {
                console.log(fullDate.toUTCString()+" /updevent API:  Endpoint call from "+ip+". ERROR: No EventID specified. Exiting.");
                res.status(400).send( { error: "No Event ID supplied" } );
                return;
        } else  {
                var query = { eventID : 0 };
                query['eventID'] = parseInt(eventid);
        }

	    console.log(req.body);

	    // example of parameter injection:    const updateDoc = { $set: { plot: `A harvest of random numbers, such as: ${Math.random()}` }, };

        console.log("Query String: "+query);
        console.log(query);
        dbo.collection("Events").updateOne(query, { $set: req.body } , function(err, result2) {
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
                console.log(fullDate.toUTCString()+" /updevent API:  Endpoint call from "+ip+".");
                console.log(recData);
        });
    });
});


//===============================================
//  admin processing endpoints. Will only be available if admin is switched on
//===============================================

// /dumptokens endpoint.
// 	dumps the mastertokentable 
//const admin = true; 
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
        res.status(401).send( { error: 'Authentication Failed' } );
        console.log("Authentication Error!!! No username supplied.");
        return;       
    };

    if (!req.body.password) {        // Require valid username to be supplied
        res.status(401).send({ error: 'Authentication Failed' } );
        console.log("Authentication Error!!! No password supplied for "+req.body.username);
        return;       
    };

    // Validate username/password
    // Future Change: TODO: This will be completed once auth mode has been decided

    //  Ok, we got to here. All checks passed. Generate and send back auth token.
    const authToken = req.body.username+":"+generateRandom(10);
    var tokenElement = {};
    tokenElement.tokenkey = authToken+":"+ip;
    tokenElement.expires = Math.floor(Date.now() / 1000) + 1800;  // Expires in 30 mmintues
    //tokenElement.expires = Math.floor(Date.now() / 1000) + 120;  // Expires in 2 mmintues. Uncomment for testing
    tokenElement.expired = false;     
    const expirymilliseconds = tokenElement.expires * 1000;
    const dateObject = new Date(expirymilliseconds);
    const expiryDateFormat = dateObject.toLocaleString();
    tokenElement.expiredatetime = expiryDateFormat;
    masterTokenTable.push({ tokenElement: tokenElement });

    // Fire back new token and expiry
    recData = {  };
    recData.authtoken = authToken;
    recData.expirytimestamp = tokenElement.expires;
    recData.expirydatetime = expiryDateFormat;
    recData.status  = "Authenticated OK";
    res.status(200).send(recData);

    const fullDate = new Date();
    console.log(fullDate.toUTCString()+" /updevent API:  Endpoint call from "+ip+". New authToken sent: "+authToken);
    console.log(masterTokenTable);
});

//===============================================

//===============================================
//  User CRUD Endpoints
//===============================================

// /verifytoken endpoint.
// 	Verify token is valid
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

// /adduser endpoint.
// 	Insert a single record into User table
app.all('/adduser', (req, res) => {
    expiretokens();
    console.log("Inside /adduser");
    console.log(req.body);
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    ip = ip.replace('::ffff:', '');

    if (!req.body.authtoken) {        // Require valid auth token to be supplied
        res.status(401).send({ error: 'Invalid auth token' });
        console.log("Authentication Error!!! No token supplied.");
        return;       
    }

    tokenquerystring = req.body.authtoken+":"+ip;     // Build lookup string
    console.log("Built token query string: "+tokenquerystring)

    var searchresult = searchtokens(tokenquerystring);
    console.log(searchresult);
    if (!searchresult) {
        res.status(401).send({ error: 'No Auth token or Expired Auth token. Add Failed' });
        console.log("Authentication Error!!! No valid token in master table.");
        return;        
    };

    // Future: Validate incoming data


    console.log("Found valid token in master table. Good to go.");
    console.log(searchresult);

    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = MongoDBConnString;
    //var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";


    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");
    	currentDate = new Date().toLocaleString("en-NZ", {timeZone: "Pacific/Auckland",timeZoneName: "short"}).replace(',','');

        dbo.collection("Users").find({}).sort({"userid" : -1}).limit(1).toArray(function(err, result1) {
            if (err) throw err;
            //console.log(result1[0]);
            var nextid = 0;
            if (typeof result1[0] === "undefined") {
                nextid = 1;
            } else {
		        nextid = result1[0].userid + 1;
            }
            //console.log("userid: "+nextid);
		    var newvalues = { };
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

        	dbo.collection("Users").insertOne(newvalues, function(err, result2) {
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
			    const recData = { username: '', acknowledged: "", insertedId:"" };
			    //console.log(newvalues.eventID);
			    recData['username'] = newvalues.username;
			    recData['acknowledged'] = result2.acknowledged;
      		    recData['insertedId'] = result2.insertedId;
			    //console.log(recData);
       		    db.close();
                res.status(200).send(recData);
                const fullDate = new Date();
			    console.log(fullDate.toUTCString()+" /adduser API: Endpoint call from "+ip);    
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

    tokenquerystring = req.body.authtoken+":"+ip;       // Build lookup string
    console.log("Built token query string: "+tokenquerystring)


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
    var url = MongoDBConnString;
    //var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
    var recData = '';
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");

        // The whole request body is sent. It is already in JSON and formatted
        dbo.collection("Users").updateOne(query, { $set: req.body } , function(err, result2) {
                //console.log(result2);
                const recData = {  };
                //console.log(newvalues.eventID);
                recData['username'] = query.username;
                recData['acknowledged'] = result2.acknowledged;
                recData['matchedCount'] = result2.matchedCount;
                recData['modifiedCount'] = result2.modifiedCount;
                recData['upsertedCount'] = result2.upsertedCount;
                res.status(200).send(recData);
                const fullDate = new Date();
                console.log(fullDate.toUTCString()+" /upduser API:  Endpoint call from "+ip+".");
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

    tokenquerystring = req.body.authtoken+":"+ip;     // Build lookup string
    console.log("Built token query string: "+tokenquerystring)

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
    var url = MongoDBConnString;
    //var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
    var recData = '';
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");
       	var query = { username : "" };
		query['username'] = username;
	    console.log("Query String: "+query);
        //console.log(query);
        dbo.collection("Users").find(query).toArray(function(err, result) {
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
	        console.log(fullDate.toUTCString()+" /updevent API:  Endpoint call from "+ip);
        });
    });
});


//===============================================

//===============================================
//  Association CRUD Endpoints
//===============================================

// /addassoc endpoint.
// 	Insert a staff/bubble association

app.all('/addassoc', (req, res) => {
    expiretokens();
    console.log("Inside /addassoc");
    console.log(req.body);
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    ip = ip.replace('::ffff:', '');

    const authHeader = req.headers.authorization;
    if (!disableBearer) {
        if (authHeader != authKey) {
            res.status(401).send({ error: 'Authentication Error.'} );
            console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: "+authHeader);
            return;
        }
    };

    if (!req.body.staffid) {        // Require staff ID to be supplied
        res.status(401).send({ error: 'No Staff ID' });
        console.log("No Staff ID supplied.");
        return;       
    }
    if (!req.body.bubbleid) {        // Require bubble ID to be supplied
        res.status(401).send({ error: 'No Bubble ID' });
        console.log("No Bubble ID supplied.");
        return;       
    }    

    //
    // Future Change: Validate received staffid & bubbleid before adding. Make sure they exist
    //


    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = MongoDBConnString;
    //var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";


    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");
    	currentDate = new Date().toLocaleString("en-NZ", {timeZone: "Pacific/Auckland",timeZoneName: "short"}).replace(',','');

        var newvalues = { };
        newvalues.associd = req.body.bubbleid+":"+req.body.staffid;
        newvalues.bubbleid = req.body.bubbleid;
        newvalues.staffid = req.body.staffid;
       	dbo.collection("Associations").insertOne(newvalues, function(err, result2) {
           	if (err) {
                //throw err;
                if (err.code === 11000) {
                // Duplicate username
                    console.log("Association already exists");
                    return res.status(422).send({ status: "failed", message: 'Association already exists!' });
                }
                console.log(err);
                  // Some other error
                return res.status(422).send(err);                    
            };
			const recData = { };
			console.log(result2);
			recData['associd'] = newvalues.associd;
			recData['bubbleid'] = newvalues.bubbleid;
      		recData['staffid'] = newvalues.staffid;
            recData['acknowledged'] = result2.acknowledged;
            recData['insertedId'] = result2.insertedId;
            recData['status'] = 'Association Saved';
			//console.log(recData);
       		//db.close();
            res.status(200).send(recData);
            const fullDate = new Date();
			console.log(fullDate.toUTCString()+" /addassoc API: Endpoint call from "+ip);    
            dbo.collection("Associations").createIndex( { "associd": 1 }, { unique: true } );
	    });
    });
});

// /getassoc endpoint.
// 	Retrieve a staff/bubble association
app.all('/getassoc', (req, res) => {
    expiretokens();
    console.log("Inside /getassoc");
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    ip = ip.replace('::ffff:', '');
    const authHeader = req.headers.authorization;
    if (!disableBearer) {
        if (authHeader != authKey) {
            res.status(401).send({ error: 'Authentication Error.'} );
            console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: "+authHeader);
            return;
        }
    };

    if (req.body.staffid) {        // Require staff ID to be supplied
        var staffid = req.body.staffid
    } else {
        var bubbleid = '';
    }
    if (req.body.bubbleid) {        // Require bubble ID to be supplied
        var bubbleid = req.body.bubbleid
    } else {
        var bubbleid = '';
    }   

    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = MongoDBConnString;
    //var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
    var recData = '';
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");
       	var query = { };
        // Will load each parameter received. If none, then the query string will be empty returning all.
		if (staffid) { query['staffid'] = staffid; };
        if (bubbleid) { query['bubbleid'] = bubbleid; };        
	    console.log("Query String: "+query);
        console.log(query);
        dbo.collection("Associations").find(query).toArray(function(err, result) {
            if (err) throw err;
            //console.log("Monogo data");
            //console.log(result);
            recData = result;
            db.close();
            //console.log("Final Return");
            //console.log(recData);
	        //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	        //res.setHeader('Access-Control-Allow-Methods', '*');
            res.status(200).send(recData);
            const fullDate = new Date();
	        console.log(fullDate.toUTCString()+" /getassoc API:  Endpoint call from "+ip);
        });
    });
});



// /delassoc endpoint.
// 	Delete a staff/bubble association

app.all('/delassoc', (req, res) => {
    console.log("Inside /delassoc");
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    ip = ip.replace('::ffff:', '');
    const authHeader = req.headers.authorization;
    if (!disableBearer) {
        if (authHeader != authKey) {
            res.status(401).send({ error: 'Authentication Error.'} );
            console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: "+authHeader);
            return;
        }
    };

    // Make sure we have been supplied staffid & bubbleid
    if (req.body.staffid) {        // Require staff ID to be supplied
        var staffid = req.body.staffid;
    } else {
        res.status(401).send({ error: 'No Staff ID supplied.'} );
        console.log("Error: No Staff ID supplied.");
        return;
    }
    if (req.body.bubbleid) {        // Require bubble ID to be supplied
        var bubbleid = req.body.bubbleid;
    } else {
        res.status(401).send( { error: 'No Bubble ID supplied.'} );
        console.log("Error: No Bubble ID supplied.");
        return;
    }   

    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = MongoDBConnString;
    //var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
    //var recData = '';
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");

        // Will load each parameter received. If none, then the query string will be empty returning all.
        var query = { };
        query['associd'] = staffid+":"+bubbleid;
	    console.log("Query String: "+query);
        console.log(query);

        //console.log("Query String: "+query);
        //console.log(query);
        dbo.collection("Associations").deleteOne(query, function(err, result2) {
		    //console.log(result2);
            const recData = { associd: 0, acknowledged: "", deletedCount: 0 };
            //console.log(newvalues.eventID);
            recData['associd'] = query.associd;
            recData['acknowledged'] = result2.acknowledged;
            recData['deletedCount'] = result2.deletedCount;
		    res.status(200).send(recData);
            const fullDate = new Date();
		    console.log(fullDate.toUTCString()+" /delassoc API:  Endpoint call from "+ip+".");
		    console.log(recData);
	    });
    });
});

//===============================================  

//===============================================
//  Staff CRUD Endpoints
//===============================================

// /addstaff     /getstaff    /updstaff     /deactivatestaff

// /addstaff endpoint.
// 	Insert a single record into Staff table
app.all('/addstaff', (req, res) => {
    expiretokens();
    console.log("Inside /addstaff");
    console.log(req.body);
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    ip = ip.replace('::ffff:', '');

    const authHeader = req.headers.authorization;
    if (!disableBearer) {
        if (authHeader != authKey) {
            res.status(401).send({ error: 'Authentication Error.'} );
            console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: "+authHeader);
            return;
        }
    };

    // Future: Validate information received.


    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = MongoDBConnString;
    //var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");
    	currentDate = new Date().toLocaleString("en-NZ", {timeZone: "Pacific/Auckland",timeZoneName: "short"}).replace(',','');

        dbo.collection("Staff").find({}).sort({"staffID" : -1}).limit(1).toArray(function(err, result1) {
            if (err) throw err;
            //console.log(result1[0]);
            var nextid = 0;
            if (typeof result1[0] === "undefined") {
                nextid = 1;
            } else {
		        nextid = result1[0].staffID + 1;
            }
            //console.log("userid: "+nextid);
		    var newvalues = { };
            newvalues['staffID'] = nextid;
		    newvalues['firstName'] = req.body.firstName;
		    newvalues['surname'] = req.body.surname;  // *** TODO: Use CryptoJS to create hashvalue and store hashvalue instead. All auths will be on hashvalue.
		    newvalues['startDate'] = currentDate;
            newvalues['endDate'] = '';
            newvalues['DOB'] = '';
            newvalues['active'] = 'Y';                  // status
		    console.log(newvalues);

        	dbo.collection("Staff").insertOne(newvalues, function(err, result2) {
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
			    //const recData = { staffID: '', acknowledged: "", insertedId:"" };
                var recData = {  };
			    //console.log(newvalues.eventID);
			    recData['staffID'] = newvalues.staffID;
                recData['firstName'] = newvalues.firstName;
                recData['surname'] = newvalues.surname;
                recData['startDate'] = newvalues.startDate;
                recData['endDate'] = newvalues.endDate;
                recData['DOB'] = newvalues.DOB;
                recData['active'] = newvalues.active;
			    recData['acknowledged'] = result2.acknowledged;
      		    recData['insertedId'] = result2.insertedId;
                recData['status'] = 'Staff Record added';
			    //console.log(recData);
                res.status(200).send(recData);
                const fullDate = new Date();
			    console.log(fullDate.toUTCString()+" /addstaff API: Endpoint call from "+ip);    
                // Catchall. Makesure an index exists for staffID. Ensures a unique ID and quick lookups.
                dbo.collection("Staff").createIndex( { "staffID": 1 }, { unique: true } );
       	    });
	    });
    });
});

// /getstaff endpoint.
// 	Retrieve a staff record
app.all('/getstaff', (req, res) => {
    expiretokens();
    console.log("Inside /getstaff");
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    ip = ip.replace('::ffff:', '');
    const authHeader = req.headers.authorization;
    if (!disableBearer) {
        if (authHeader != authKey) {
            res.status(401).send({ error: 'Authentication Error.'} );
            console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: "+authHeader);
            return;
        }
    };

    if (req.body.staffID) {        // Require staff ID to be supplied
        var staffid = req.body.staffID
    } else {
        var staffid = '';
    }

    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = MongoDBConnString;
    //var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
    var recData = '';
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");
       	var query = { };
        // Will load each parameter received. If none, then the query string will be empty returning all.
		if (staffid) { query['staffID'] = staffid; };        
	    console.log("Query String: "+query);
        console.log(query);
        dbo.collection("Staff").find(query).toArray(function(err, result) {
            if (err) throw err;
            recData = result;
            db.close();
            res.status(200).send(recData);
            const fullDate = new Date();
	        console.log(fullDate.toUTCString()+" /getstaff API:  Endpoint call from "+ip);
        });
    });
});

// /updstaff endpoint.
//      Update a specified Staff record
app.all('/updstaff', (req, res) => {
    console.log("Inside /updevent");
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    ip = ip.replace('::ffff:', '');
    const authHeader = req.headers.authorization;
    if (!disableBearer) {
        if (authHeader != authKey) {
            res.status(401).send({ error: 'Authentication Error.'} );
            console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: "+authHeader);
            return;
        }
    };

    // Future Change: Validate the inbound data

    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = MongoDBConnString;
    //var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
    var recData = '';
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");
        var staffID = req.body.staffID;
        if (typeof staffID === "undefined") {
                console.log(fullDate.toUTCString()+" /getstaff API:  Endpoint call from "+ip+". ERROR: No staffID specified. Exiting.");
                res.status(400).send( { error: "No staffID supplied" } );
                return;
        } else  {
                var query = { };
                query["staffID"] = parseInt(staffID);
        }

	    console.log(req.body);

	    // example of parameter injection:    const updateDoc = { $set: { plot: `A harvest of random numbers, such as: ${Math.random()}` }, };

        console.log("Query String: "+query);
        console.log(query);
        dbo.collection("Staff").updateOne(query, { $set: req.body } , function(err, result2) {
                //console.log(result2);
                var recData = { };
                //console.log(newvalues.eventID);
                recData['staffID'] = query.staffID;
                recData['acknowledged'] = result2.acknowledged;
                recData['matchedCount'] = result2.matchedCount;
                recData['modifiedCount'] = result2.modifiedCount;
                recData['upsertedCount'] = result2.upsertedCount;
                res.status(200).send(recData);
                const fullDate = new Date();
                console.log(fullDate.toUTCString()+" /updstaff API:  Endpoint call from "+ip+".");
                console.log(recData);
        });
    });
});

// /deactivatestaff endpoint.
//      Update a specified Staff record
app.all('/deactivatestaff', (req, res) => {
    console.log("Inside /deactivatestaff");
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    ip = ip.replace('::ffff:', '');
    const authHeader = req.headers.authorization;
    if (!disableBearer) {
        if (authHeader != authKey) {
            res.status(401).send({ error: 'Authentication Error.'} );
            console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: "+authHeader);
            return;
        }
    };

    // Future Change: Validate the inbound data

    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = MongoDBConnString;
    //var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
    var recData = '';
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");
        var staffID = req.body.staffID;
        if (typeof staffID === "undefined") {
                console.log(fullDate.toUTCString()+" /deactivatestaff API:  Endpoint call from "+ip+". ERROR: No staffID specified. Exiting.");
                res.status(400).send( { error: "No staffID supplied" } );
                return;
        } else  {
                var query = { };
                query["staffID"] = parseInt(staffID);
        }

        req.body.active = "N";
	    console.log(req.body);

	    // example of parameter injection:    const updateDoc = { $set: { plot: `A harvest of random numbers, such as: ${Math.random()}` }, };

        console.log("Query String: "+query);
        console.log(query);
        dbo.collection("Staff").updateOne(query, { $set: req.body } , function(err, result2) {
                //console.log(result2);
                var recData = { };
                //console.log(newvalues.eventID);
                recData['staffID'] = query.staffID;
                recData['acknowledged'] = result2.acknowledged;
                recData['matchedCount'] = result2.matchedCount;
                recData['modifiedCount'] = result2.modifiedCount;
                recData['upsertedCount'] = result2.upsertedCount;
                res.status(200).send(recData);
                const fullDate = new Date();
                console.log(fullDate.toUTCString()+" /deactivatestaff API:  Endpoint call from "+ip+".");
                console.log(recData);
        });
    });
});



//===============================================


//===============================================
//  Bubble Endpoints
//===============================================

//get bubble by bubbleid
app.get('/getbubble', (req, res) => {
    res.setHeader('Access-Control-Allow-Methods', '*');
    console.log("Inside /getbubble");
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    ip = ip.replace('::ffff:', '');

    //Authorization
    const authHeader = req.headers.authorization;
    if (authHeader != authKey) {
        res.status(401).send('Authentication Error.');
        console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: "+authHeader);
        return;
    }

    // get bubble id
    var bubbleid = req.query.bubbleID;

    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = MongoDBConnString;
    //var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
    var recData = '';

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");
        if (typeof bubbleid === "undefined") {
            var query = {};
        } else	{
            var query = { bubbleID : 0 };
            query['bubbleID'] = parseInt(bubbleid);
        }

        dbo.collection("Bubbles").find(query).toArray(function(err, result) {
            if (err) throw err;
            recData = result;
            db.close();
            res.setHeader('Access-Control-Allow-Methods', '*');
            res.status(200).send(recData);
            console.log(fullDate.toUTCString()+" /getbubble API:  Endpoint call from "+ip);
        });
    });
});



// Addbubble endpoingt
// Create a record to Bubble database
app.all('/addbubble', (req, res) => {
    console.log("Inside /addbubble");
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    ip = ip.replace('::ffff:', '');

    //Authorization
    const authHeader = req.headers.authorization;
    if (authHeader != authKey) {
        res.status(401).send('Authentication Error.');
        console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: "+authHeader);
        return;
    }

    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = MongoDBConnString;
    //var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");

        dbo.collection("Bubbles").find({}).sort({"bubbleID" : -1}).limit(1).toArray(function(err, result1) {
            if (err) throw err;
            const nextID = result1[0].bubbleID + 1;
            //create a new bubble record
            var newvalues = { bubbleID: 0,  bubbleName: "", Active: ""};
            newvalues['bubbleID'] = nextID;
            newvalues['bubbleName'] = req.body.bubbleName;
            newvalues['Active'] =  req.body.Active;

            //insert to database
            dbo.collection("Bubbles").insertOne(newvalues, function(err, result2) {
                if (err) throw err;
                const recData = { bubbleID: 0, acknowledged: "", insertedId:"" };

                recData['bubbleID'] = newvalues.bubbleID;
                recData['acknowledged'] = result2.acknowledged;
                recData['insertedId'] = result2.insertedId;

                db.close();
                res.status(200).send(recData);
                const fullDate = new Date();
                console.log(fullDate.toUTCString()+" /addevent API: New bubbleID: "+newvalues.bubbleID+"  Endpoint call from "+ip);
            });
            });
    });
});


//Uptdate bubble endpoint

app.all('/updbubble', (req, res) => {
    console.log("Inside /updbubble");
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    ip = ip.replace('::ffff:', '');

    //Authorization
    const authHeader = req.headers.authorization;
    if (authHeader != authKey) {
        res.status(401).send('Authentication Error.');
        console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: "+authHeader);
        return;
    }
    
    // Get the bubble id which want to update
    var bubbleid = req.query.bubbleID;
    
    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = MongoDBConnString;
    //var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");
        if (typeof bubbleid === "undefined") {
            console.log(fullDate.toUTCString()+" /updbubble API:  Endpoint call from "+ip+". ERROR: No BubbleID specified. Exiting.");
            res.status(400).send( { error: "No Bubble ID supplied" } );
            return;
        } else  {
                var query = { bubbleID : 0 };
                query['bubbleID'] = parseInt(bubbleid);
        }

	    console.log(req.body);

        dbo.collection("Bubbles").updateOne(query, { $set: req.body } , function(_err, result2) {

            const recData = { bubbleID: 0};

            recData['bubbleID'] = query.bubbleID;
            recData['acknowledged'] = result2.acknowledged;
            recData['matchedCount'] = result2.matchedCount;
            recData['modifiedCount'] = result2.modifiedCount;
            recData['upsertedCount'] = result2.upsertedCount;
            res.status(200).send(recData);
            const fullDate = new Date();
            console.log(fullDate.toUTCString()+" /updbubble API:  Endpoint call from "+ip+".");
            console.log(recData);
        });
    });
});


//Delet bubble by id endpoint
app.get('/delbubble', (req, res) => {
    console.log("Inside /delbubble");
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    ip = ip.replace('::ffff:', '');

    //Authorization
    const authHeader = req.headers.authorization;
    if (authHeader != authKey) {
        res.status(401).send('Authentication Error.');
        console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: "+authHeader);
        return;
    }

    // Get bubbleid which want to delet
    var bubbleid = req.query.bubbleID;
    

    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = MongoDBConnString;
    //var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");

        if (typeof bubbleid === "undefined") {
		    console.log(fullDate.toUTCString()+" /delbubble API:  Endpoint call from "+ip+". ERROR: No EventID specified. Exiting.");
		    res.status(400).send( { error: "No Bubble ID supplied" } );
		    return;
        } else  {
            var query = { bubbleID : 0 };
            query['bubbleID'] = parseInt(bubbleid);
        }

        dbo.collection("Bubbles").deleteOne(query, function(_err, result2) {

            const recData = { bubbleID: 0, acknowledged: "", deletedCount: 0 };

            recData['bubbleID'] = query.eventID;
            recData['acknowledged'] = result2.acknowledged;
            recData['deletedCount'] = result2.deletedCount;
		    res.status(200).send(recData);
            const fullDate = new Date();
		    console.log(fullDate.toUTCString()+" /delevent API:  Endpoint call from "+ip+".");
		    console.log(recData);
	    });
    });
});

//upload img

app.post('/upload', (req, res) => {
    if(req.files == null) {
        return res.status(400).json({ msg: 'No file! '});
    }

    const file = req.files.file;

    file.mv(`../frontend/public/uploads/${file.name}`, err => {
        if (err) {
          console.error(err);
          return res.status(500).send(err);
        }

        res.json({ fileName: file.name, filePath: `uploads/${file.name}` });
    });
});

//===============================================

if (!disableHTTPS) {
    var server = https.createServer(options, app);      // Create HTTPS server
} else {
    var server = http.createServer(app);       // Create HTTP server
}

server.listen(port, () => {
  console.log("server starting on port : " + port)
});

