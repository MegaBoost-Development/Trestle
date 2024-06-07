const Player = require("../entity/Player.js");

module.exports = async (ioServer, gameServer, client, packetData) => {
  const id = client.id;
  const x = packetData.blockX[0];
  const y = packetData.blockY[0];
  const worldName = packetData.worldName[0];
  const objectClass = packetData.object[0];
  const material = packetData.material[0];

  ioServer.emit("WorldObjectAllowedPlace", x, y, worldName, objectClass);
  client.emit("InventoryRemoveItem", id, material, 1);

}
