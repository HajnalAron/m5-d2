// GET /authors => returns the list of authors
// GET /authors/123 => returns a single author
// POST /authors => create a new author
// PUT /authors/123 => edit the author with the given id
// DELETE /authors/123 => delete the author with the given id
// Author model:
// name
// surname
// ID (Unique and server-generated)
// email
// date of birth
// avatar (e.g. https://ui-avatars.com/api/?name=John+Doe)

import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const authorsRouter = express.Router();

const currentPath = fileURLToPath(import.meta.url);
const currentDir = dirname(currentPath);
const authorsPath = join(currentDir, "authors.json");

// Get all authors
authorsRouter.get("/", (request, response) => {
  response.send(JSON.parse(fs.readFileSync(authorsPath)));
});

// Get author by ID
authorsRouter.get("/:authorId", (request, response) => {
  const prevAuthors = JSON.parse(fs.readFileSync(authorsPath));
  const targetAuthor = prevAuthors.find(
    (author) => author.id === request.params.authorId
  );
  if (targetAuthor) {
    response.send(targetAuthor);
  } else response.send("Author not found");
});

//Post a new author
authorsRouter.post("/", (request, response) => {
  const newAuthor = { ...request.body, id: uniqid(), createdAt: new Date() };
  const prevAuthors = JSON.parse(fs.readFileSync(authorsPath));
  prevAuthors.push(newAuthor);
  fs.writeFileSync(authorsPath, prevAuthors);
});

//Modify an author
authorsRouter.put("/:authorId", (request, response) => {
  const prevAuthors = JSON.parse(fs.readFileSync(authorsPath));
  const targetAuthorIndex = prevAuthors.findIndex(
    (author) => author.id === request.params.authorId
  );
  prevAuthors[targetAuthorIndex] = {
    ...prevAuthors[targetAuthorIndex],
    ...request.body,
    upDatedAt: new Date()
  };
  fs.writeFileSync(authorsPath, prevAuthors);
});

//Delete an author
authorsRouter.delete("/:authorId", (request, response) => {
  const prevAuthors = JSON.parse(fs.readFileSync(authorsPath));
  const filteredAuthors = prevAuthors.filter(
    (author) => author.id !== request.params.authorId
  );
  fs.writeFileSync(authorsPath, JSON.stringify(filteredAuthors));
});

export default authorsRouter;
