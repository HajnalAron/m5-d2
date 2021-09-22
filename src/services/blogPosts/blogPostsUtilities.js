import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const blogPostsPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogPosts.json"
);

export const readBlogPosts = () => {
  return JSON.parse(fs.readFileSync(blogPostsPath));
};

export const writeBlogPosts = (dataToWrite) => {
  const currentBlogPosts = readBlogPosts();
  const newBlogPostsContent = [...currentBlogPosts, dataToWrite];
  fs.writeFileSync(blogPostsPath, JSON.stringify(newBlogPostsContent));
};

export const overWriteBlogPost = (idToOverWrite, dataToWrite) => {
  const targetBlogPostIndex = getBlogPostIndex(idToOverWrite);
  const prevBlogPosts = readBlogPosts();
  prevBlogPosts[targetBlogPostIndex] = {
    ...prevBlogPosts[targetBlogPostIndex],
    ...dataToWrite,
    upDatedAt: new Date()
  };
  fs.writeFileSync(blogPostsPath, JSON.stringify(prevBlogPosts));
  return prevBlogPosts[targetBlogPostIndex];
};

export const getBlogPostById = (idToFind) => {
  let prevBlogPosts = readBlogPosts();
  let targetBlogPost = prevBlogPosts.find((post) => post.id === idToFind);
  return targetBlogPost;
};

export const getBlogPostIndex = (idToFind) => {
  let targetBlogPost = readBlogPosts().findIndex(
    (blogPost) => blogPost.id === idToFind
  );
  return targetBlogPost;
};

export const filterOutBlogPost = (idToFind) => {
  const filteredOutBlogPosts = readBlogPosts().filter(
    (blogPost) => blogPost.id !== idToFind
  );
  fs.writeFileSync(blogPostsPath, JSON.stringify(filteredOutBlogPosts));
};

export const makeNewBlogPost = (blogPostBody) => {
  return {
    ...blogPostBody,
    id: uniqid(),
    createdAt: new Date()
  };
};

export const filterBlogPostsByAuthorId = (authorId) => {
  return readBlogPosts().find(
    (blogPost) => blogPost.author.authorId === idToFind
  );
};

export const filterBlogPostsByTitle = (title) => {};
