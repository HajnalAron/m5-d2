import express from "express";
import multer from "multer";
import fs from "fs-extra";
import { join } from "path";
import { overWriteBlogPost } from "../blogPosts/blogPostsUtilities.js";

const filesRouter = express.Router();
const port = ":3001";

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
      const baseURL = `${req.protocol}://${req.hostname}${port}`;
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
