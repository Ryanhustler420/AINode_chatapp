class User {
  constructor () {
    this.globalArrayForOnlineUsers = [];
  }

  EnterRoom (Socket_id, name, room) {
    const user = {Socket_id, name, room};
    this.globalArrayForOnlineUsers.push (user);
    return user;
  }

  GetUserId (id) {
    const socket_id = this.globalArrayForOnlineUsers.filter (
      userId => userId.id === id
    )[0];

    return socket_id;
  }

  RemoveUser (socket_id) {
    const user = this.GetUserId (id);
    if (user) {
      this.globalArrayForOnlineUsers = this.globalArrayForOnlineUsers.filter (
        userId => userId.id !== socket_id
      );
    }
    return user;
  }

  GetOnlineUserName (room) {
    const roomName = this.globalArrayForOnlineUsers.filter (
      user => user.room === room
    );
    const names = roomName.map (user => user.name);
    return names;
  }
}

module.exports = {
  User,
};
