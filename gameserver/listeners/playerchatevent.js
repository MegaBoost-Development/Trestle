const Player = require("../entity/Player.js");
const CONFIG = require("../../config.json");

module.exports = async (ioServer, gameServer, client, packetData) => {
  let name = packetData.sender[0];
  let id = client.id;
  let message = packetData.message[0];
  let sentAt = packetData.sentAt[0];

  gameServer.log(`[CHAT] ${sentAt} ${name} ${message}`);
  ioServer.emit("PlayerSendChatMessage", name, message);

}
