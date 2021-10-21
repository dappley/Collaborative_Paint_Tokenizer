const express = require('express');
const path = require('path');
const { createServer } = require("http");
const app = express();
const httpServer = createServer(app);
const io = require('socket.io')(httpServer);

var rooms = {};
var user_room = {};

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

var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
httpServer.listen(server_port, () => {
      console.log("Started on : " + server_port);
})