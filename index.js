const express = require("express");
require('events').EventEmitter.defaultMaxListeners = 0;
const Player = require("./entity/_player.js");
const PlayerJoinEvent = require("./network/_playerJoinEvent.js");
const PlayerChatEvent = require("./network/_playerChatEvent.js");
const PlayerDisconnectEvent = require("./network/_playerDisconnectEvent.js")
const ProgramState = require("./utils/_programState.js");
const STATE = ProgramState.DEVELOPMENT;

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
    if (STATE == ProgramState.PRODUCTION) {
      console.log("###########################################");
      console.log(" Override function: `registerSocketServer` ");
      console.log("###########################################");
      process.exit();
      return; // just in case ;)
    }

    this.ioServer.on("connection", (socket) => {
      socket.on("PlayerJoinEvent", (data) => PlayerJoinEvent.execute(this, socket, data));
      socket.on("PlayerChatEvent", (data) => PlayerChatEvent.execute(this, socket, data));
      socket.on("disconnect", () => PlayerDisconnectEvent.execute(this, socket, null));
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
