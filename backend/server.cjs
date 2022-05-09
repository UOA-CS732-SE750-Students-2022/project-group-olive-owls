
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

//   Date: 10/5/2022                            Guanxiang Zhao (gzha644)
//   Desc: Added endpoints for Bubbles.
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

console.info("Inside server.js   Start: "+date.getTime);

//var key = fs.readFileSync(__dirname + '/certs/privkey.pem');
//var cert = fs.readFileSync(__dirname + '/certs/fullchain.pem');
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
    if (authHeader != authKey) {
        res.status(401).send('Authentication Error.');
        console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: "+authHeader);
        return;
    }
    console.log(authHeader);

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


// "mongoquery" endpoint
// Query on mongoDB using a defined string that is hardcoded and return all received records from DB in JSON format
app.get('/mongoquery', (req, res) => {
    console.log("Inside /mongoquery");
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    ip = ip.replace('::ffff:', '');
    const authHeader = req.headers.authorization;
    if (authHeader != authKey) {
	res.status(401).send('Authentication Error.');
	console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: "+authHeader);
	return; 
    }
    console.log(authHeader);
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
            console.log("Final Return");
            console.log(recData);
            res.status(200).send(recData);
        });
    });
});


//===============================================
//  Events Endpoints
//===============================================

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
        console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: "+authHeader);
        return;
    }
    //console.log(authHeader);
    var eventid = req.query.eventid;
    //console.log("Received EventID: "+eventid);

    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
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
    if (authHeader != authKey) {
        res.status(401).send('Authentication Error.');
        console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: "+authHeader);
        return;
    }

    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
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
            	db.close();
            	res.status(200).send(recData);
                   const fullDate = new Date();
			       console.log(fullDate.toUTCString()+" /addevent API: New eventID: "+newvalues.eventID+"  Endpoint call from "+ip);
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
        console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: "+authHeader);
        return;
    }
    //console.log(authHeader);
    var eventid = req.query.eventid;
    //console.log("Received EventID: "+eventid);

    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
    var recData = '';
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");
        if (typeof eventid === "undefined") {
		    console.log(fullDate.toUTCString()+" /getevent API:  Endpoint call from "+ip+". ERROR: No EventID specified. Exiting.");
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
    if (authHeader != authKey) {
        res.status(401).send('Authentication Error.');
        console.log("Authentication Error!!! Wrong or No Bearer supplied.   Received: "+authHeader);
        return;
    }
    //console.log(authHeader);
    var eventid = req.query.eventid;
    //console.log("Received EventID: "+eventid);

    // MongoDB query
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
    var recData = '';
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");
        if (typeof eventid === "undefined") {
                console.log(fullDate.toUTCString()+" /getevent API:  Endpoint call from "+ip+". ERROR: No EventID specified. Exiting.");
                res.status(400).send( { error: "No Event ID supplied" } );
                return;
        } else  {
                var query = { eventID : 0 };
                query['eventID'] = parseInt(eventid);
        }

	    console.log(req.body);

	    // example of parameter injection:    const updateDoc = { $set: { plot: `A harvest of random numbers, such as: ${Math.random()}` }, };

        //console.log("Query String: "+query);
        //console.log(query);
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
    var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
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
    var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";


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
    var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OliveOwls");
        if (typeof bubbleid === "undefined") {
            console.log(fullDate.toUTCString()+" /getevent API:  Endpoint call from "+ip+". ERROR: No BubbleID specified. Exiting.");
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
    var url = "mongodb+srv://root:9Zv5SvE4tK9jKbF@cluster0.ule3y.mongodb.net/test?authSource=admin&replicaSet=atlas-yflv4e-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";

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




//===============================================

var server = http.createServer(options, app);

server.listen(port, () => {
  console.log("server starting on port : " + port)
});