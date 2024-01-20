const ProxyPlayer = require("../ProxyPlayer.js");

module.exports = async (loadBalancer, client, gameServer, packetData) => {

  if (gameServer == null || gameServer == undefined) {
    loadBalancer.log(`Error! Invalid GameServer for id: ${client.id}`);
    return;
  }

  let name = packetData.name;
  let proxyPlayer = new ProxyPlayer(packetData.name, packetData.id, client.id);
  gameServer.addPlayer();

}
