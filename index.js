const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const path = require('path');
const createExpressApp = require('./create-express-app');
/* const http = require('http');
const socketIo = require('socket.io'); */

const socketIo = require('./socketio');

require('dotenv').config();

MongoClient.connect(process.env.DB_CONN, (err, db) => {

  console.log('connected to mongodb...');
  
  var app = createExpressApp(db)
    .listen(process.env.PORT_APP, () => {
      database = db;
      console.log('listening on port '+process.env.PORT_APP+'...');
    });

    var io = socketIo(process.env.PORT_SOCKET);

  });
