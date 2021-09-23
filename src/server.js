import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import authorsRouter from "./services/authors/index.js";
import blogPostsRouter from "./services/blogPosts/index.js";
import {
  badRequestErrorHandler,
  notFoundErrorHandler,
  forbiddenErrorHandler,
  genericServerErrorHandler
} from "./errorHandlers.js";
import { join } from "path";
import filesRouter from "./services/fileUpload/index.js";

const server = express();
export const port = process.env.PORT || 3001;

server.use(cors());
server.use(express.json());
server.use("/authors", authorsRouter);
server.use("/blogposts", blogPostsRouter);
server.use("/fileupload", filesRouter);
const publicFolderPath = join(process.cwd(), "public");
server.use(express.static(publicFolderPath));
server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(forbiddenErrorHandler);
server.use(genericServerErrorHandler);
console.table(listEndpoints(server));

server.listen(port, () => {
  console.log("Server started on port:" + port);
});
