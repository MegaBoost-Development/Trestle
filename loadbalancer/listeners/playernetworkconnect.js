const ProxyPlayer = require("../ProxyPlayer.js");

module.exports = async (loadBalancer, client, gameServer, packetData) => {

  //let gameServer = loadBalancer.getGameServerById(client.id);
  if (gameServer == null || gameServer == undefined) {
    loadBalancer.log(`Error! Invalid GameServer for id: ${client.id}`);
    return;
  }

  let proxyPlayer = new ProxyPlayer(packetData.name, packetData.id, client.id);
  gameServer.addPlayer(proxyPlayer);
  loadBalancer.log(`${proxyPlayer.getName()} has joined the network with id: ${proxyPlayer.getId()}.`);

}
