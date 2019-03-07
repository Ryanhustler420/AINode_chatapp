module.exports = function (io, User, _) {
  const user = new User ();

  io.on ('connection', socket => {
    socket.on ('refresh', data => {
      io.emit ('refreshPage', {});
    });
    socket.on ('online', data => {
      socket.join (data.room);
      user.EnterRoom (socket.id, data.user, data.room);
      const list = user.GetOnlineUserName (data.room);
      io.emit ('usersOnline', _.uniq (list));
    });
  });
};
