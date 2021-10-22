const express = require('express');
const path = require('path');
const { createServer } = require("http");
const app = express();
const httpServer = createServer(app);
const io = require('socket.io')(httpServer);

var rooms = {};
var user_room = {};
var server_port = 5000; // || process.env.YOUR_PORT || process.env.PORT;

function findArtworkbyKey(roomId) {
  let room = rooms[roomId]
  if (room == null) {
      console.log("This id doesn't exist yet!");
      return false;
  } else {
      console.log("Artwork Title:", room.artworkTitle);
      return true;
  }
}

function room(artworkTitle, paint) {
  this.artworkTitle = artworkTitle;
  this.paint = paint;
}

io.on('connection', (socket) => {
      console.log("Socket ID:" + socket.id);

      socket.on("checkRoomID_Call", async (roomId) => {
            console.log("checking on room", roomId);
            if (rooms[roomId] != null) {
                  socket.emit("checkRoomID_Return", true);
            } else {
                  socket.emit("checkRoomID_Return", false);
            }
      })
      
      socket.on("createRoom", async (roomId, artworkTitle) => {
            roomExist = findArtworkbyKey(roomId);
            if (user_room[socket.id] == null || user_room[socket.id] != roomId) {
                  user_room[socket.id] = roomId;
            }
            try {
                  await socket.join(roomId);
                  console.log(socket.id + " joined in room id " + roomId);

                  if (!roomExist) {
                        console.log("Creating a new room with the artwork:", artworkTitle);
                        console.log("Room ID:", roomId);
                        rooms[roomId] = new room(artworkTitle, []);
                  } else {
                        console.log("Joining the room with the artwork:", artworkTitle);
                        let painting = rooms[roomId].paint;
                        painting.forEach(async (data) => {
                              await socket.broadcast.emit('canvas-data', roomId, data);
                        })
                  }
            } catch (e) {
                  console.error(socket.id + " failed to join room " + roomId + e);
            }
      });

      // #TODO When one person get disconnected, the entire room gets disconnected
      socket.on('disconnect', async () => {
            roomId = user_room[socket.id]
            console.log(socket.id, "disconnected from room", roomId);
      });

      socket.on('canvas-data', (roomId, data) => {
            rooms[roomId].paint.push(data);
            socket.broadcast.emit('canvas-data', roomId, data);
      })
})

httpServer.listen(server_port, () => {
      console.log("Started on : " + server_port);
})