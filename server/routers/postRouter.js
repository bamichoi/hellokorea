import express from "express";
import {
  createPost,
  getPost,
  getPosts,
  editPost,
  deletePost,
  countVote,
  countView,
} from "../controllers/postController";

const postRouter = express.Router();

postRouter.route("/").get(getPosts).post(createPost);
postRouter.route("/:postId").get(getPost).put(editPost).post(deletePost);
postRouter.route("/:postId/votes").post(countVote);
postRouter.route("/:postId/views").post(countView);
export default postRouter;
