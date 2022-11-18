const NetworkEvent = require("./_networkEvent.js");

class PlayerDisconnectEvent extends NetworkEvent {

  static execute(server, socket, data) {
    let id = socket.id;
    let player = server.players.get(id);
    console.log(`${player.name} has disconnected with id: ${id}`);
    server.players.delete(id);
  }

}

module.exports = PlayerDisconnectEvent;
