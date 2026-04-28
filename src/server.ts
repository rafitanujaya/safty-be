import http from "http";
import env from "./config/env";
import app from "./app";

const server = http.createServer(app);

server.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});
