"use strict";
// reference: https://developer.okta.com/blog/2018/11/15/node-express-typescript
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000; // default port to listen
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {});
io.on("connection", (socket) => {
    // ...
});
// Configure Express to use EJS
app.set("views", path_1.default.join(__dirname, "views"));
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
//# sourceMappingURL=server.js.map