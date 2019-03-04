module.exports = function (io) {
  io.on ('connection', socket => {
    socket.on ('join chat', params => {
      socket.join (params.room1); //sender
      socket.join (params.room2); //receiver
    });

    socket.on ('start_typing', data => {
      io.to (data.receiver).emit ('is_Typing', data);
    });

    socket.on ('stop_typing', data => {
      io.to (data.receiver).emit ('has_stopped_typing', data);
    });
  });
};
