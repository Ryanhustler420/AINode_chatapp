module.exports = function (io) {
  io.on ('connection', socket => {
    socket.on ('join chat', params => {
      socket.join (params.room1); //sender
      socket.join (params.room2); //receiver
    });
  });
};
