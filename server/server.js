const express = require('express');
const path = require('path');
const { createServer } = require("http");
const app = express();
const httpServer = createServer(app);
const io = require('socket.io')(httpServer);

const encodeworks = [
  { key: "2fa1981b4a9a7a3e2f1294354810635b9030c74f", artwork: "bridge" },
  { key: "b1ade531057f51c2992479335d03b774afdeb6fa", artwork: "garden" },
  { key: "5a46b8253d07320a14cace9b4dcbf80f93dcef04", artwork: "flower" },
  { key: "d79ac4a2b1ac0251b7bbbceb4649e4a964bc5597", artwork: "mountain" }
    ];

var rooms = {};

function findArtworkbyKey(key) {
  let work = encodeworks.find(art => art.key === key)
  if(work) {
      console.log(work.artwork);
      return work.artwork;
  } else {
      console.log("public demo");
      return "public demo"
  }
}

function room(usercount, paint) {
  this.usercount = usercount;
  this.paint = paint;
}

io.on('connection', (socket) => {
  console.log("Socket ID:" + socket.id);
  let artwork = "";

  //register the socket id to a room that refers to an artwork
  socket.on("artwork", async (arg) => {
      artwork = findArtworkbyKey(arg);
      try {
        if (!rooms[artwork]) {
            rooms[artwork] = new room(1, []);
        } else {
            rooms[artwork].usercount++;
      }
      await socket.join(artwork);
      console.log(socket.id + " joined in room " + artwork);
      
      setInterval(() => {
        io.to(artwork).emit('usercount', {
            uc: rooms[artwork].usercount
        });
      }, 2 * 1000);

      io.to(artwork).emit('artworkTitle', {
        artworkTitle: artwork
      });
      } catch (e) {
        console.error(socket.id + " failed to join in " + artwork + e);
      }
      });

      socket.on('disconnect', async () => {
            await io.to(artwork).emit('usercount', {
            uc: rooms[artwork].usercount--
            });
            console.log("User Disconnected", socket.id);
      });

      socket.on('canvas-data', (room, strokes) => {
            rooms[artwork].paint.push(strokes);
            console.log(strokes);
            socket.broadcast.emit('canvas-data', room, strokes);
      })
})

var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
httpServer.listen(server_port, () => {
      console.log("Started on : " + server_port);
})