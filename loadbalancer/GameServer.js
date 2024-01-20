/**

THIS IS A DATA CLASS FOR THE LOAD BALANCER

**/
const MAX_SIZE = require("../config.json").gameServer.maxPlayerCount;

class GameServer {

  #id;
  #name;
  #port;
  #players;

  constructor(id, name, port) {
    this.#id = id;
    this.#name = name;
    this.#port = port;
    this.#players = new Map();
  }

  getId() {
    return this.#id;
  }

  getName() {
    return this.#name;
  }

  getPort() {
    return this.#port;
  }

  getPlayerCount() {
    return this.getPlayers().length;
  }

  addPlayer(player) {
    this.#players.set(player.getId(), player);
  }

  removePlayer(player) {
    this.#players.remove(player.getId());
  }

  getPlayers() {
    return this.#players.entries();
  }

  isFull() {
    return this.getPlayerCount() >= MAX_SIZE;
  }

}

module.exports = GameServer;
