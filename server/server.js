var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var roomId = 4;

io.on('connection', (socket) => {
      console.log(`User Connected: ${socket.id}`);

      // socket.on("join_room", (room) => {
      //       //socket.join(room);
      //       //socket.broadcast.emit('test', "data from server");
      //       roomId = room;
      //       console.log(`User with ID: ${socket.id} joined room: ${room}`);
      //       //socket.broadcast.emit(room, "data from server");
      // });

      // socket.on(roomId, (data) => {
      //       console.log(`current roomId ${roomId}`);
      //       socket.broadcast.emit(roomId, data);
      // })


      socket.on('canvas-data', (data, room) => {
            socket.broadcast.emit('canvas-data', data, room);
      })


      // socket.on(room, (data) => {
      //       socket.broadcast.emit(room, "data from server");
      //       console.log(`test data is: ${data}}`);
      // });

      // socket.on(roomId, (data) => {

      //       console.log(`User with ID: ${socket.id} joined room: ${roomId}`);
      //       socket.broadcast.emit(roomId, data);
      // })





      // socket.on('canvas-data', (data, room) => {

      //       if (room === '') {
      //             console.log(`User ID: ${socket.id} deso not have room: ${room}`);
      //       } else {
      //             console.log(`message sent to room: ${room}`);
      //             socket.to(room).emit('canvas-data', data);
      //       }
      // });

      // socket.on('test', (data, room) => {
      //       console.log(`message from room: ${room} and data is ${data}`);
      //       if (room === '') {
      //             console.log(`User ID: ${socket.id} deso not have room: ${room}`);
      //       } else {
      //             console.log(`message sent to room: ${room}`);
      //             socket.to(room).emit('test', "test data from server");
      //       }
      // });

      // socket.on('canvas-data', (data) => {
      //       socket.broadcast.emit('canvas-data', data);
      // })
      socket.on("disconnect", () => {
            console.log("User Disconnected", socket.id);
      });
})

var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
http.listen(server_port, () => {
      console.log("Started on : " + server_port);
})