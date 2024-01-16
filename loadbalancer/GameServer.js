/**

THIS IS A DATA CLASS FOR THE LOAD BALANCER

**/
const MAX_SIZE = require("../config.json").gameServer.maxPlayerCount;

class GameServer {

  #id;
  #name;
  #port;
  #playerCount;

  constructor(id, name, port) {
    this.#id = id;
    this.#name = name;
    this.#port = port;
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
    return this.#playerCount;
  }

  addPlayer() {
    this.#playerCount++;
  }

  removePlayer() {
    this.#playerCount--;
  }

  isFull() {
    return this.getPlayerCount() >= MAX_SIZE;
  }

}

module.exports = GameServer;
