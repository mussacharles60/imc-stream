
// reference: https://developer.okta.com/blog/2018/11/15/node-express-typescript

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from "path";

const app = express();
const port: any = process.env.PORT || 3000; // default port to listen

const httpServer = createServer(app);
const io = new Server(httpServer, {

});

type Room = {
  id: string;
  name: string;
  description: string;
}

type Message = {
  id: string;
  room_id: string;
}

io.on("connection", (socket) => {

  // tslint:disable-next-line:no-console
  console.log("a user connected");

  socket.on("join", (room: Room) => {
    // tslint:disable-next-line:no-console
    console.log("join room", room);
    socket.join(room.id);
  });

  socket.on("leave", (room: Room) => {
    // tslint:disable-next-line:no-console
    console.log("leave room", room);
    socket.leave(room.id);
  });

  socket.on("message", (message: Message) => {
    // tslint:disable-next-line:no-console
    console.log("message", message);
    io.to(message.room_id).emit("message", message);
  });

});

// Configure Express to use EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (_req, res) => {
  res.render("home/index");
});

app.get("/stream", (_req, res) => {
  res.render("stream/index");
});

app.get("/watch", (_req, res) => {
  res.render("watch/index");
});

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`Server running on port ${port}.`);
});
