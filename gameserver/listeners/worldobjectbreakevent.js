const Player = require("../entity/Player.js");

module.exports = async (ioServer, gameServer, client, packetData) => {
  const id = packetData.id[0];
  const x = packetData.blockX[0];
  const y = packetData.blockY[0];
  const worldName = packetData.worldName[0];
  const objectClass = packetData.object[0];

  ioServer.emit("WorldObjectAllowedBreak", id, x, y, worldName, objectClass);

}
