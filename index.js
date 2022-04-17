const express = require("express");
require('events').EventEmitter.defaultMaxListeners = 0;
const Player = require("./entity/_player.js");
const PlayerJoinEvent = require("./network/_playerJoinEvent.js");

class Server {
  constructor() {
    this.app = express();
    this.http = require("http").Server(this.app);
    this.port = process.env.PORT || 8000;
    this.ioServer = require("socket.io")(this.http);
    this.players = new Map();
    this.entities = new Map();
  }

  registerAppDetails() {
    this.app.use(express.urlencoded({extended: true}));
    this.app.use(express.json());
    this.app.get("/", (req, res) => res.send("ok"));
  }

  registerSocketServer() {
    this.ioServer.on("connection", (socket) => {

      socket.on("PlayerJoinEvent", (data) => PlayerJoinEvent.execute(this, socket, data));

    })
  }

  async start() {
    this.registerAppDetails();
    this.http.listen(this.port, () => {
      console.log(`App is listening on port: ${this.port}`);
      this.registerSocketServer();
    })
  }

}

module.exports = Server;
