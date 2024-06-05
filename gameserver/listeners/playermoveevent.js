const Player = require("../entity/Player.js");

module.exports = async (ioServer, gameServer, client, packetData) => {
  let id = packetData.id[0];
  let x = packetData.toX[0];
  let y = packetData.toY[0];
  let worldName = packetData.toWorld[0];

  ioServer.emit("EntityAllowedMove", id, x, y, worldName);

}
