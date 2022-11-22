const NetworkEvent = require("./_networkEvent.js")

class PlayerChatEvent extends NetworkEvent {
  static execute(server, socket, data) {
    let id = socket.id;
    let player = server.players.get(id);
    let message = `${player.name} ${data}`
    console.log(message);
    socket.broadcast.emit("PlayerSendChatEvent", socket.id, message);
  }

}

module.exports = PlayerChatEvent;
