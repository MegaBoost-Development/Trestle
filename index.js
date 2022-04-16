const express = require("express");
require('events').EventEmitter.defaultMaxListeners = 0;

class Server {
  constructor() {
    this.app = express();
    this.http = require("http").Server(this.app);
    this.port = process.env.PORT || 8000;
    this.ioServer = require("socket.io")(this.http);
  }

  registerAppDetails() {
    this.app.use(express.urlencoded({extended: true}));
    this.app.use(express.json());
    this.app.get("/", (req, res) => res.send("ok"));

  }

  registerSocketServer() {
    this.ioServer.on("connection", (socket) => {

      console.log("A user connected!");

      socket.on("test", (data) => {
        console.log(data);
      })

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
