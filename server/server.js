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

function room(artworkTitle, usercount, paint) {
  this.artworkTitle = artworkTitle;
  this.usercount = usercount;
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
                        rooms[roomId] = new room(artworkTitle, 1, []);
                  } else {
                        // #TODO 'canvas-data' does not get called.
                        // await io.to(roomId).emit('canvas-data', roomId, rooms[roomId].paint);
                        rooms[roomId].usercount++;
                  }

                  setInterval(() => {
                        io.to(roomId).emit('usercount', {
                              uc: rooms[roomId].usercount
                        });
                  }, 2 * 1000);
            } catch (e) {
                  console.error(socket.id + " failed to join room " + roomId + e);
            }
      });

      // #TODO When one person get disconnected, the entire room gets disconnected
      socket.on('disconnect', async () => {
            roomId = user_room[socket.id]
            try {
                  await io.to(roomId).emit('usercount', {
                        uc: rooms[roomId].usercount--
                  });
            } catch (e) {
                  console.error(e);
            }
            

            console.log(socket.id, "disconnected");
      });

      socket.on('canvas-data', (roomId, strokes) => {
            rooms[roomId].paint.push(strokes);
            socket.broadcast.emit('canvas-data', roomId, strokes);
      })
})

var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
httpServer.listen(server_port, () => {
      console.log("Started on : " + server_port);
})