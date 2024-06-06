const CONFIG = require("../config.json");
require('events').EventEmitter.defaultMaxListeners = 0;
const express = require("express");
const app = express();
const http = require("http").Server(app);
const ioServer = require("socket.io")(http);
const helmet = require("helmet");
const { io } = require("socket.io-client");
const FS = require("fs");
const World = require("./world/World.js");

class GameServer {

  #name;
  #port;
  #players;
  #playerNameToId;
  #maxPlayerCount;
  #worlds;
  #loadBalancerSocket;
  createNoise2D;

  constructor(name, port) {

    this.#name = name;
    this.#port = port;
    this.#players = new Map();
    this.#playerNameToId = new Map();
    this.#maxPlayerCount = CONFIG.gameServer.maxPlayerCount;
    this.#worlds = new Map();
    this.#loadBalancerSocket = io(`${CONFIG.loadBalancer.protocol}://${CONFIG.loadBalancer.ip}:${CONFIG.loadBalancer.port}`, {
      auth: {
        token: CONFIG.loadBalancer.accessToken
      }
    });

    this.createNoise2D = require("open-simplex-noise").makeNoise2D;

  }

  tick() {

  }

  log(info) {
    console.log(`[${process.pid}] [${this.getName()}] ${info}`);
  }

  getName() {
    return this.#name;
  }

  getPort() {
    return this.#port;
  }

  getPlayerCount() {
    return this.getPlayers().size();
  }

  addPlayer(player) {
    this.#players.set(player.getId(), player);
    this.#playerNameToId.set(player.getName(), player.getId());
    this.#loadBalancerSocket.emit("playernetworkconnect", {
      name: player.getName(),
      id: player.getId()
    })
  }

  removePlayer(id) {
    let player = this.#players.get(id);
    this.#playerNameToId.delete(player.getName());
    this.#players.delete(id);
    this.#loadBalancerSocket.emit("playernetworkdisconnect", {
      name: player.getName(),
      id: player.getId()
    })
  }

  getPlayers() {
    return this.#players;
  }

  getPlayerById(id) {
    return this.#players.get(id);
  }

  isFull() {
    return this.getPlayerCount() >= MAX_SIZE;
  }

  getWorldMap() {
    return this.#worlds;
  }

  addWorld(world) {
    this.#worlds.set(world.getName(), world);
  }

  removeWorld(name, save) {
    const world = this.getWorld(name);
    if (world == null) {
      this.log(`[WORLD] Error when removing ${name}, it was not found!`);
      return;
    }

    if (save) {
      this.log(`[WORLD] Saving ${name}...`);
      world.save();
      this.log(`[WORLD] Saved ${name}!`);
    }

    this.#worlds.delete(name);

  }

  getWorld(name) {
    return this.#worlds.get(name);
  }

  getDefaultWorld() {
    return getWorld(CONFIG.gameServer.defaultWorldName);
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

          socket.on(name, (packetData) => listener(ioServer, this, socket, packetData));

          registered.push(name);
        });

        socket.on("disconnect", (packetData) => this.removePlayer(socket.id));

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

    //Load the world and create it if it does not exist.
    World.loadOrGenerateNew(this, CONFIG.gameServer.defaultWorldName, CONFIG.gameServer.biomeIndexes[0]);

    //tick the server every 25 ms
    setInterval(() => this.tick(), 25);
  }

}

/**

  MAIN NODEJS INSTANCE RUNS THIS AS CHILD PROCESS

**/
process.on("message", (config) => {
  let gameServer = new GameServer(config.name, config.port);
  gameServer.start();
})
