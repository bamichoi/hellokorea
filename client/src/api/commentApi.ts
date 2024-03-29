import axios from "axios";
import { ICreateCommentForm } from "Components/comment/CreateForm";
import { IEditCommentForm } from "Components/comment/EditForm";
import { VoteToComment } from "Components/comment/Comment";

export const createComment = async (data: ICreateCommentForm) => {
  return await axios.post(`/api/comments`, data);
};

export const editComment = async (data: IEditCommentForm) => {
  return await axios.put(`/api/comments/${data.commentId}`, data);
};

export const deleteComment = async (commentId: string) => {
  return await axios.delete(`/api/comments/${commentId}`);
};

export const countVote = async (data: VoteToComment) => {
  return axios.post(`/api/comments/${data.commentId}/vote`, data);
};
