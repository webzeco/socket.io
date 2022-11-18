const io = require('socket.io')(8900, {
  cors: {
    origin: '*',
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
  console.log({ users: users.length });
};

const removeUser = (socketId) => {
  users = users?.filter((user) => user?.socketId !== socketId);
};

const getUser = (userId) => {
  return users?.find((user) => user.userId === userId);
};
io.on('connection', (socket) => {
  //when connect
  console.log('a user connected:', socket.id);
  //take userId and socketId from user
  socket.on('addUser', (userId) => {
    console.log('userId: ' + userId);
    addUser(userId, socket.id);
    io.emit('getUsers', users);
  });

  //send and get message
  socket.on('sendMessage', (message) => {
    console.log('recieved:', message);
    const user = getUser(message.receiverId);
    io.to(user?.socketId).emit('getMessage', message);
  });

  //when disconnect
  socket.on('disconnect', () => {
    console.log('a user disconnected!');
    removeUser(socket.id);
    io.emit('getUsers', users);
  });
});
