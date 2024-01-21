module.exports = async (loadBalancer, client, gameServer, packetData) => {

  //let gameServer = loadBalancer.getGameServerById(client.id);
  if (gameServer == null || gameServer == undefined) {
    loadBalancer.log(`Error! Invalid GameServer for id: ${client.id}`);
    return;
  }

  gameServer.removePlayer(packetData.id);
  loadBalancer.removeProxyPlayer(packetData.id);

}
