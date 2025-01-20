class Command {

  #name;
  #usage;
  #description;

  constructor(name, usage, description) {
    this.#name = name;
    this.#usage = usage;
    this.description = description;
  }

  getName() {
    return this.#name;
  }

  getUsage() {
    return this.#usage;
  }

  getDescription() {
    return this.#description;
  }

  execute(ioServer, gameServer, client, args) {
    throw new Error("The execute method must be overriden!");
  }

  sendErrorMessage(client) {
    client.emit("PlayerSendChatMessage", "", `&r${getName()} | ${getDescription()}`);
    client.emit("PlayerSendChatMessage", "", `${getUsage()}`);
  }

}

module.exports = Command;
