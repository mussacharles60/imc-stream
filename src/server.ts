
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

io.on("connection", (socket) => {
  // ...
});


// Configure Express to use EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// define a route handler for the default home page
app.get("/", (req, res) => {
  // render the index template
  res.render("index");
});

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`Server running on port ${port}.`);
});