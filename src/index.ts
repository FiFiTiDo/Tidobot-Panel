import Server from "./Server";

require("dotenv").config();

let server = new Server();
server.init();
server.start();