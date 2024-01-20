class ProxyPlayer {

  #name;
  #playerId;
  #gameServerId;

  constructor(name, playerId, gameServerId) {
    this.#name = name;
    this.#playerId = playerId;
    this.#gameServerId = gameServerId;
  }

  getName() {
    return this.#name;
  }

  getId() {
    return this.#playerId;
  }

  getGameServerId() {
    return this.#gameServerId;
  }

}

module.exports = ProxyPlayer;
