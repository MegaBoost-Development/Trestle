require('events').EventEmitter.defaultMaxListeners = 0;
const express = require("express");
const app = express();
const http = require("http").Server(app);
const ioServer = require("socket.io")(http);
const helmet = require("helmet");
const { fork } = require("child_process");
const CONFIG = require("../config.json");
const PORT = CONFIG.loadBalancer.port;
const FS = require("fs");

class LoadBalancer {

  #count;
  #gameServers;
  #proxyPlayers;
  #proxyPlayerNameMap;
  #minServerCount;
  #maxServerCount;

  constructor() {

    this.#count = 1;
    this.#gameServers = new Map();
    this.#proxyPlayers = new Map();
    this.#proxyPlayerNameMap = new Map();
    this.#minServerCount = CONFIG.loadBalancer.minServerCount;
    this.#maxServerCount = CONFIG.loadBalancer.maxServerCount;

  }

  addGameServer(gameServer) {
    this.#gameServers.set(gameServer.getId(), gameServer);
  }

  removeGameServer(gameServer) {
    this.#gameServers.delete(gameServer.getId());
  }

  getGameServerById(id) {
    return this.#gameServers.get(id);
  }

  addProxyPlayer(proxyPlayer) {
    this.#proxyPlayers.set(proxyPlayer.getId(), proxyPlayer);
    this.#proxyPlayerNameMap.set(proxyPlayer.getName(), proxyPlayer);
  }

  getProxyPlayerById(id) {
    return this.#proxyPlayers.get(id);
  }

  getProxyPlayerByName(name) {
    return this.#proxyPlayerNameMap.get(name);
  }

  removeProxyPlayer(id) {
    this.#proxyPlayerNameMap.delete(this.getProxyPlayerById(id).getName());
    this.#proxyPlayers.delete(id);
  }

  log(info) {
    console.log(`[${process.pid}] [LoadBalancer] ${info}`);
  }

  async createGameServer() {
    let gameServerPort = PORT + this.#count;
    let name = `GameServer-${this.#count}`;
    this.#count++;
    let forkedGameServer = fork("./gameserver/GameServer.js");

    forkedGameServer.send({
      name: name,
      port: gameServerPort
    });

    return gameServerPort;

  }

  async registerAppDetails() {
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    app.get("/", async (req, res) => {

      let playableServer = 0;
      for (let [gameserverId, gameServer] of this.#gameServers.entries()) {
        if (gameServer.isFull()) continue;
        playableServer = gameServer.getPort();
        break;
      }

      if (playableServer != 0) {
        res.send(`${playableServer}`);
        return;
      }


      this.createGameServer().then((port) => {
        res.send(`${port}`);
      });

    });
  }

  async registerSocketServer() {

    ioServer.engine.use(helmet());

    ioServer.use((socket, next) => {
      const token = socket.handshake.auth.token;

      if (token != CONFIG.loadBalancer.accessToken) next(new Error("Invalid credentials!"));
      else next();
    });

    ioServer.on("connection", (socket) => {

      FS.readdir("./loadbalancer/listeners/", (e, listeners) => {
        if (e) return this.log(`Error whilst reading listener dir: ${e}`);
        if (!listeners) return this.log(`Error whilst reading listener directory.`);

        let registered = [];
        listeners.forEach((file) => {
          if (!file.endsWith(".js")) return
          let listener = require(`./listeners/${file}`);
          let name = file.split(".")[0];

          socket.on(name, (packetData) => listener(this, socket, this.getGameServerById(socket.id), packetData));

          registered.push(name);
        });
        this.log(`[Listener] Registered Listeners: ${registered.map(r => r).join(', ')}.`);
      });

    })

  }

  async registerBaseGameServers() {
    for (let i = 0; i < CONFIG.loadBalancer.minServerCount; i++) {
      this.createGameServer();
    }
  }

  async start() {
    await this.registerAppDetails();
    await this.registerSocketServer();
    await this.registerBaseGameServers();
    http.listen(PORT, () => {
      this.log(`App is listening on port: ${PORT}`);
    })
  }

}

module.exports = LoadBalancer;
