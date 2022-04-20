import Post from "../models/Post";
import User from "../models/User";
import Comment from "../models/Comment";
import bcrypt from "bcrypt";

export const createPost = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { category, title, contents },
  } = req;
  try {
    const newPost = await Post.create({
      category,
      title,
      contents,
      owner: _id,
    });
    const user = await User.findById(_id);
    user.posts.push(newPost._id);
    user.save();
    return res.status(200).send({ state: "success", postId: newPost._id });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .send({ field: "serverError", message: "Fail to write a post" });
  }
};

export const getPost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    //   .populate("owner")
    //   .populate("comments");
    // Post.populate({ path: "comments", populate: { path: "recomments" } });
    if (post) {
      return res.status(200).send({ state: "success", post });
    } else {
      return res.status(400).send({ state: "notFound" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ state: "serverError" });
  }
};

export const getPosts = async (req, res) => {
  const { category } = req.query;
  try {
    const posts = await Post.find({ category })
      .sort({ createdAt: "desc" })
      .populate("owner");
    return res.status(200).send({ state: "success", posts });
  } catch {
    return res.satus(400).send({
      state: "serverError",
    });
  }
};

export const editPost = async (req, res) => {
  const {
    session: { user },
    params: { postId },
    body: { title, contents },
  } = req;
  const post = await Post.findById(postId);
  if (!post) {
    return res
      .status(400)
      .send({ field: "serverError", message: "Post not Found" });
  }
  if (String(post.owner) !== user._id) {
    return res
      .status(400)
      .send({ field: "serverError", message: "You can not edit this post" });
  }
  try {
    post.title = title;
    post.contents = contents;
    post.save();
    return res.status(200).send({ state: "success " });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ field: "serverError", message: "Fail to edit this post" });
  }
};

export const deletePost = async (req, res) => {
  const {
    session: {
      user: { _id: userId, password: userPassword },
    },
    params: { postId },
    body: { password },
  } = req;
  const post = await Post.findById(postId);
  if (!post) {
    return res
      .status(404)
      .send({ field: "ServerError", messasge: "Post not Found" }); // Form 에러 표시가 아니라 Not Found 리다이렉트 처리해야함
  }
  if (String(post.owner._id) !== userId) {
    return res
      .status(400)
      .send({ field: "ServerError", messasge: "You can't delete this post" });
  }
  const passwordValidation = await bcrypt.compare(password, userPassword);
  if (!passwordValidation) {
    return res
      .status(400)
      .send({ field: "password", message: "Password is wrong" });
  }
  try {
    const user = await User.findById(userId);
    await Post.findByIdAndDelete(postId);
    console.log(user.posts);
    user.posts.splice(user.posts.indexOf(postId), 1);
    user.save();
    return res.status(200).send({ state: "success" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .send({ field: "serverError", message: "Failed to change password" });
  }
};
