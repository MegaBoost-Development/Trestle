const CONFIG = require("../config.json");
const SETTINGS = require("./settings.json");
require('events').EventEmitter.defaultMaxListeners = 0;
const express = require("express");
const app = express();
const http = require("http").Server(app);
const ioServer = require("socket.io")(http);
const helmet = require("helmet");
const { io } = require("socket.io-client");
const FS = require("fs");
const World = require("./world/World.js");
const TICK_LENGTH_MS = 1000 / 20; //Looking for 20 tps, denominator is the rate
let previousTick = Date.now();
let actualTicks = 0;

class GameServer {

  #name;
  #port;
  #players;
  #playerNameToId;
  #maxPlayerCount;
  #worlds;
  #commands;
  #loadBalancerSocket;
  createNoise2D;

  constructor(name, port) {

    this.#name = name;
    this.#port = port;
    this.#players = new Map();
    this.#playerNameToId = new Map();
    this.#maxPlayerCount = CONFIG.gameServer.maxPlayerCount;
    this.#worlds = new Map();
    this.#commands = new Map();
    this.#loadBalancerSocket = io(`${CONFIG.loadBalancer.protocol}://${CONFIG.loadBalancer.ip}:${CONFIG.loadBalancer.port}`, {
      auth: {
        token: CONFIG.loadBalancer.accessToken
      }
    });

    this.createNoise2D = require("open-simplex-noise").makeNoise2D;

  }

  #runGameLoop() {
    let now = Date.now();
    actualTicks++
    if (previousTick + TICK_LENGTH_MS <= now) {
      let delta = (now - previousTick) / 1000;
      previousTick = now;

      this.#tick(delta);

      //this.log(`delta, ${delta}, (target: + ${TICK_LENGTH_MS} ms) node ticks: ${actualTicks}`);
      actualTicks = 0;
    }

    if (Date.now() - previousTick < TICK_LENGTH_MS - 16) {
      setTimeout(this.#runGameLoop.bind(this));
    } else {
      setImmediate(this.#runGameLoop.bind(this));
    }
  }

  #tick(deltaTime) {
    //this.log(`tick: ${deltaTime}`);
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
    return this.getPlayers().size;
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
    return this.getWorld(SETTINGS.defaultWorldName);
  }

  getCommand(commandName) {
    return this.#commands.get(commandName.toLowerCase());
  }

  getCommands() {
    return this.#commands;
  }

  async registerAppDetails() {
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    app.get("/", async (req, res) => res.send(`${this.getPlayerCount()}`));
  }

  async registerCommands() {
    FS.readdir("./gameserver/command/commands/", (e, commands) => {
      if (e) return this.log(`Error whilst reading command dir: ${e}`);
      if (!commands) return this.log(`Error whilst reading command directory. Is it empty?`);

      let registered = [];
      commands.forEach((file) => {
        if (!file.endsWith(".js")) return;
        let CommandClazz = require(`./command/commands/${file}`);
        let command = new CommandClazz();
        this.#commands.set(command.getName(), command);
        registered.push(command.getName());
      });

      this.log(`[Command] Registered Commands: ${registered.map(r => r).join(', ')}.`);

    });
  }

  async registerSocketServer() {

    ioServer.engine.use(helmet());

    ioServer.on("connection", (socket) => {
      FS.readdir("./gameserver/listeners/", (e, listeners) => {
        if (e) return this.log(`Error whilst reading listener dir: ${e}`);
        if (!listeners) return this.log(`Error whilst reading listener directory.`);

        let registered = [];
        listeners.forEach((file) => {
          if (!file.endsWith(".js")) return;
          let listener = require(`./listeners/${file}`);
          let name = file.split(".")[0];

          socket.on(name, (packetData) => listener(ioServer, this, socket, packetData));

          registered.push(name);
        });

        socket.on("disconnect", (packetData) => {
          socket.broadcast.emit("PlayerSendChatMessage", "", `${this.getPlayerById(socket.id).getName()} has left the game!`, 'y');
          socket.broadcast.emit("EntityRemoveEvent", socket.id);
          this.removePlayer(socket.id);
        });

        this.log(`[Listener] Registered Listeners: ${registered.map(r => r).join(', ')}.`);
      });
    });

    ioServer.engine.on("connection", (rawSocket) => {
      rawSocket.request = null;
    });

  }

  async registerLoadBalancerConnection() {

    this.#loadBalancerSocket.emit("gameservercreated", {name: this.#name, port: this.#port});

  }

  async start() {
    await this.registerAppDetails();
    await this.registerSocketServer();
    await this.registerCommands();
    await this.registerLoadBalancerConnection();
    http.listen(this.#port, () => {
      this.log(`App is listening on port: ${this.#port}`);
    })

    //Load the world and create it if it does not exist.
    World.loadOrGenerateNew(this, SETTINGS.defaultWorldName, SETTINGS.biomeIndexes[0]);

    this.#runGameLoop();

  }

}

/**

  MAIN NODEJS INSTANCE RUNS THIS AS CHILD PROCESS

**/
process.on("message", (config) => {
  let gameServer = new GameServer(config.name, config.port);
  gameServer.start();
})
