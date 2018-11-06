'use strict'
const colyseus = require('colyseus');
const http = require('http');
const express = require('express');
const GameRoom = require('./rooms/MainRoom');
const WebSocket = require("uws")

// monitor - very useful tool for debug server side
const monitor = require("@colyseus/monitor").monitor;

const port = process.env.PORT || 80;
//==============================================================================
const app = express();
app.use(express.static(__dirname + "/../client"))

//==============================================================================
const gameServer = new colyseus.Server({
    engine: WebSocket.Server,
    server: http.createServer(app)
});

// Register your room handlers.
gameServer.register("GameRoom", GameRoom);
gameServer.listen(port);

// Register monitor route AFTER registering your room handlers
app.use("/colyseus", monitor(gameServer));

console.log("Server started!");
