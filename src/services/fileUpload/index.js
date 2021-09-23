import express from "express";
import multer from "multer";
import fs from "fs-extra";
import { join } from "path";
import { overWriteBlogPost } from "../blogPosts/blogPostsUtilities.js";
import json2csv from "json2csv";
import { port } from "../../server.js";
import { promisify } from "util";
import { pipeline } from "stream";

const filesRouter = express.Router();

filesRouter.get("/authors", async (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", `attachment; filename=authors.csv`);
    const authorsPath = join(
      process.cwd(),
      "src/services/authors/authors.json"
    );
    const source = fs.createReadStream(authorsPath);
    const transform = new json2csv.Transform({
      fields: ["name", "surname", "email"]
    });
    const destination = res;
    console.log(transform);
    pipeline(source, transform, destination, (err) => {
      if (err) next(err);
    });
  } catch (error) {}
});

filesRouter.post(
  "/blogposts/:id/",
  multer().single("coverPic"),
  async (req, res, next) => {
    try {
      console.log(req.file);
      const { originalname } = req.file;
      const [name, extension] = originalname.split(".");
      const filename = `${req.params.id}.${extension}`;
      const publicFolderPath = join(process.cwd(), "public/img/blogPosts/");
      const filePath = join(publicFolderPath, filename);
      const baseURL = `${req.protocol}://${req.hostname}:${port}`;
      const url = `${baseURL}/img/blogPosts/${filename}`;
      await fs.writeFile(filePath, req.file.buffer);
      overWriteBlogPost(req.params.id, { coverPic: url });
      res.status(200).send("OK");
    } catch (error) {
      next(error);
    }
  }
);

export default filesRouter;
