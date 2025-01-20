const Player = require("../entity/Player.js");
const CONFIG = require("../../config.json");
const SETTINGS = require("./../settings.json");

module.exports = async (ioServer, gameServer, client, packetData) => {
  let name = packetData.sender[0];
  let id = client.id;
  let message = packetData.message[0];
  let sentAt = packetData.sentAt[0];
  if (message.length <= 2) return;
  if (message[2] == SETTINGS.commandPrefix) {
    let unparsedCommand = message.substring(3).split(" ");
    let commandName = unparsedCommand[0];
    if (commandName.length == 0) return; //this would be just send a /
    let arguments = (unparsedCommand.length == 1) ? [] : unparsedCommand.slice(1);
    let command = gameServer.getCommand(commandName);
    if (command == null) {
      client.emit("PlayerSendChatMessage", "", "Invalid command!");
      return;
    }

    command.execute(ioServer, gameServer, client, arguments);
    gameServer.log(`[COMMAND] [${sentAt}] ${name} executed command: /${commandName} ${arguments}`);
    return;
  }

  gameServer.log(`[CHAT] [${sentAt}] ${name} ${message}`);
  ioServer.emit("PlayerSendChatMessage", `${name} `, message);

}
