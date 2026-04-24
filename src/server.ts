import http from "http";
import app from "./app";
import env from "./config/env";
import { setupSocket } from "./sockets";

const server = http.createServer(app);

setupSocket(server);

server.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});
