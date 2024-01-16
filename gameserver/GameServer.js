const CONFIG = require("../config.json");
require('events').EventEmitter.defaultMaxListeners = 0;
const express = require("express");
const app = express();
const http = require("http").Server(app);
const ioServer = require("socket.io")(http);
const helmet = require("helmet");
const { io } = require("socket.io-client");
const FS = require("fs");

class GameServer {

  #name;
  #port;
  #players;
  #maxPlayerCount;
  #loadBalancerSocket;

  constructor(name, port) {

    this.#name = name;
    this.#port = port;
    this.#players = new Map();
    this.#maxPlayerCount = CONFIG.gameServer.maxPlayerCount;
    this.#loadBalancerSocket = io(`${CONFIG.loadBalancer.protocol}://${CONFIG.loadBalancer.ip}:${CONFIG.loadBalancer.port}`, {
      auth: {
        token: CONFIG.loadBalancer.accessToken
      }
    });

  }

  log(info) {
    console.log(`[${process.pid}] [GameServer] ${info}`);
  }

  async registerAppDetails() {
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    app.get("/", async (req, res) => res.send("ok"));
  }

  async registerSocketServer() {

    ioServer.engine.use(helmet());

    ioServer.on("connection", (socket) => {
      FS.readdir("./gameserver/listeners/", (e, listeners) => {
        if (e) return this.log(`Error whilst reading listener dir: ${e}`);
        if (!listeners) return this.log(`Error whilst reading listener directory.`);

        let registered = [];
        listeners.forEach((file) => {
          if (!file.endsWith(".js")) return
          let listener = require(`./listeners/${file}`);
          let name = file.split(".")[0];

          socket.on(name, (packetData) => listener(this, socket, packetData));

          registered.push(name);
        });
        this.log(`[Listener] Registered Listeners: ${registered.map(r => r).join(', ')}.`);
      });
    })

  }

  async registerLoadBalancerConnection() {

    this.#loadBalancerSocket.emit("gameservercreated", {name: this.#name, port: this.#port});

  }

  async start() {
    await this.registerAppDetails();
    await this.registerSocketServer();
    await this.registerLoadBalancerConnection();
    http.listen(this.#port, () => {
      this.log(`App is listening on port: ${this.#port}`);
    })
  }

}

/**

  MAIN NODEJS INSTANCE RUNS THIS AS CHILD PROCESS

**/
process.on("message", (config) => {
  let gameServer = new GameServer(config.name, config.port);
  gameServer.start();
})
