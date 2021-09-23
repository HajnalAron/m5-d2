// Blogpost modell :
// {
//   "_id": "SERVER GENERATED ID",
//   "category": "ARTICLE CATEGORY",
//   "title": "ARTICLE TITLE",
//   "cover":"ARTICLE COVER (IMAGE LINK)",
//   "readTime": {
//     "value": 2,
//     "unit": "minute"
//    },
//   "author": {
//       "name": "AUTHOR AVATAR NAME",
//       "avatar":"AUTHOR AVATAR LINK"
//       },
//    "content":"HTML",
//    "createdAt": "NEW DATE"
//   }

// Imports
import express from "express";
import {
  readBlogPosts,
  writeBlogPosts,
  filterOutBlogPost,
  makeNewBlogPost,
  getBlogPostById,
  overWriteBlogPost
} from "./blogPostsUtilities.js";

//Global
const blogPostsRouter = express.Router();

// Endpoints

// GET /blogPosts => returns the list of blogposts
blogPostsRouter.get("/", (request, response, next) => {
  try {
    response.status(200).send(readBlogPosts());
  } catch (error) {
    next(error);
  }
});

// GET /blogPosts /123 => returns a single blogpost
blogPostsRouter.get("/:blogPostId", (request, response, next) => {
  try {
    let targetBlogPost = getBlogPostById(request.params.blogPostId);
    response.status(200).send(targetBlogPost);
  } catch (error) {
    next(error);
  }
});

// POST /blogPosts => create a new blogpost
blogPostsRouter.post("/", (request, response, next) => {
  try {
    let newBlogPost = makeNewBlogPost(request.body);
    writeBlogPosts(newBlogPost);
    response.status(200).send(newBlogPost);
  } catch (error) {
    next(error);
  }
});

// PUT /blogPosts /123 => edit the blogpost with the given id
blogPostsRouter.put("/:blogPostId", (request, response, next) => {
  try {
    let updatedPost = overWriteBlogPost(
      request.params.blogPostId,
      request.body
    );
    response.status(200).send(updatedPost);
  } catch (error) {
    next(error);
  }
});

// POST /blogPosts/:id/uploadCover, uploads a picture (save as idOfTheBlogPost.jpg in the public/img/blogPosts folder) for the blog post specified by the id. Store the newly created URL into the corresponding post in blogPosts.json
blogPostsRouter.put("/:blogPostId", (request, response, next) => {
  try {
    overWriteBlogPost(request.params.blogPostId, request.body);
    response
      .status(200)
      .send(
        "Blogpost has been modified with the id of:" + request.params.blogPostId
      );
  } catch (error) {
    next(error);
  }
});

// DELETE /blogPosts /123 => delete the blogpost with the given id
blogPostsRouter.delete("/:blogPostId", (request, response, next) => {
  try {
    console.log(request);
    filterOutBlogPost(request.params.blogPostId);
    response
      .status(200)
      .send(
        "Blogpost has been deleted with the id of:" + request.params.blogPostId
      );
  } catch (error) {
    next(error);
  }
});

export default blogPostsRouter;
