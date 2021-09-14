import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import authorsRouter from "./services/authors/authors/";

const server = express();
const port = 3001;

server.use(cors());
server.use(express.json());
server.use("./services/authors/index.js", authorsRouter);

console.table(listEndpoints(server));

server.listen(port, () => {
  console.log("Server started on port:" + port);
});
