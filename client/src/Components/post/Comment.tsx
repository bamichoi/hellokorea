import { useEffect, useState } from "react";
import DeleteModal from "../comment/DeleteModal";
import Button from "Components/Button";
import { IComment, IVoteState } from "Routes/Post/Post";
import EditForm from "../comment/EditForm";
import CreateForm from "../recomment/CreateForm";
import Recomment from "./Recomment";
import { useSelector } from "react-redux";
import { loggedInUser } from "reducers/auth";
import { useMutation } from "react-query";
import { countVote } from "api/commentApi";
import { queryClient } from "index";

interface ICommentProps {
  comment: IComment;
  postId: string;
}

export interface IOnDeleteCommentState {
  onDelete: boolean;
  commentId?: string;
}

export interface IOnEditCommentState {
  onEdit: boolean;
  commentId?: string;
}

export interface IOnCreateRecommentState {
  onCreate: boolean;
  parentsCommentId?: string;
}

export interface IVoteRequest {
  commentId: string;
  votedState: IVoteState;
}

function Comment({ comment, postId }: ICommentProps) {
  const user = useSelector(loggedInUser);
  const [onDeleteComment, setOnDeleteComment] = useState<IOnDeleteCommentState>(
    {
      onDelete: false,
    }
  );
  const [onEditComment, setOnEditComment] = useState<IOnEditCommentState>({
    onEdit: false,
  });
  const [onCreateRecomment, setOnCreateRecomment] =
    useState<IOnCreateRecommentState>({
      onCreate: false,
    });
  const onClickDeleteComment = (commentId: string) => {
    setOnDeleteComment({ onDelete: true, commentId });
  };
  const onClickEditComment = (commentId: string) => {
    setOnEditComment({ onEdit: true, commentId });
  };
  const onClickCreateRecomment = (parentsCommentId: string) => {
    setOnCreateRecomment({ onCreate: true, parentsCommentId });
  };
  const [votedState, setVotedState] = useState<IVoteState>({ voted: false });
  const { mutate } = useMutation((data: IVoteRequest) => countVote(data), {
    onSuccess: () => {
      queryClient.invalidateQueries([postId, "getPost"]);
    },
  });
  const onClickVote = (action: "up" | "down") => {
    const data = { commentId: comment._id, votedState, action };
    mutate(data);
  };

  useEffect(() => {
    const upvotedUser = comment.meta.upvotes.indexOf(user.id);
    const downvotedUser = comment.meta.downvotes.indexOf(user.id);
    const isUpvoted = upvotedUser === -1 ? false : true;
    const isDownvoted = downvotedUser === -1 ? false : true;
    if (isUpvoted) {
      setVotedState({ voted: true, type: "up" });
    } else if (isDownvoted) {
      setVotedState({ voted: true, type: "down" });
    } else if (!isUpvoted) {
      setVotedState({ voted: false });
    } else if (!isDownvoted) {
      setVotedState({ voted: false });
    }
  }, [user.id, comment.meta.upvotes, comment.meta.downvotes]);
  return (
    <>
      <li className="bg-cream p-4 rounded-md">
        <div className="flex justify-between">
          <div className="disply flex">
            <img
              alt="owner_avatar"
              src={"/" + comment.avatar}
              className="bg-white w-8 h-8 rounded-full mr-2"
            />
            <span>{comment.nickname}</span>
          </div>
          <div className="space-x-2">
            {user ? (
              <>
                <Button
                  onClick={() => onClickVote("up")}
                  text="upvote"
                  customClassName=" "
                />
                <span>|</span>
                <Button
                  onClick={() => onClickVote("down")}
                  text="downvote"
                  customClassName=" "
                />
                <span>|</span>
                <Button
                  onClick={() => onClickCreateRecomment(comment._id)}
                  text="reply"
                  customClassName=" "
                />
              </>
            ) : null}
            {user && user.id === comment.owner ? (
              <>
                <span>|</span>
                <Button
                  onClick={() => onClickEditComment(comment._id)}
                  text="edit"
                  customClassName=" "
                ></Button>
                <span>|</span>
                <Button
                  onClick={() => onClickDeleteComment(comment._id)}
                  text="delete"
                  customClassName=" "
                ></Button>
              </>
            ) : null}
          </div>
        </div>
        {onEditComment.onEdit && comment._id === onEditComment.commentId ? (
          <EditForm
            postId={postId}
            commentId={comment._id}
            commentText={comment.text}
            setOnEditComment={setOnEditComment}
          />
        ) : (
          <span>{comment.text}</span>
        )}
        <div className="flex justify-between mt-2">
          <div className="space-x-2">
            <span>{comment.meta.upvotes.length} upvotes</span>
            <span>{comment.meta.downvotes.length} downvotes</span>
          </div>
          <span>{comment.createdAt}</span>
        </div>
        {onDeleteComment.onDelete ? (
          <DeleteModal
            postId={postId!}
            commentId={onDeleteComment.commentId!}
            setOnDeleteComment={setOnDeleteComment}
          />
        ) : null}
      </li>
      {onCreateRecomment.onCreate ? (
        <CreateForm
          postId={postId!}
          parentsCommentId={comment._id}
          setOnCreateRecomment={setOnCreateRecomment}
        />
      ) : null}
      <ul className="space-y-4">
        {comment.recomments.map((recomment) => (
          <Recomment
            postId={postId}
            key={recomment._id}
            recomment={recomment}
          />
        ))}
      </ul>
    </>
  );
}

export default Comment;
