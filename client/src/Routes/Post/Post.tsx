import Wrapper from "Components/Wrapper";
import { Link, Outlet, useParams } from "react-router-dom";
import parse from "html-react-parser";
import { useQuery } from "react-query";
import { getPost } from "api";
import Title from "Components/Title";
import Button from "Components/Button";
import WriteComment from "Components/post/WriteComment";
import Comment from "Components/post/Comment";

interface IRecomment {
  _id: string;
  text: string;
  nickname: string;
  avatar: string;
}

export interface IComment {
  _id: string;
  text: string;
  nickname: string;
  avatar: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  recomments: IRecomment[];
}

interface IOwner {
  nickname: string;
  id: string;
  avatar: string;
}

export interface IPost {
  _id: string;
  category: string;
  title: string;
  contents: string;
  owner: IOwner;
  createdAt: Date;
  modifedAt: Date;
  comments: IComment[];
  meta: {
    views: number;
    upvotes: number;
    downvotes: number;
  };
}

export interface IPostResponse {
  state: string;
  post: IPost;
  message?: string;
}

function Post() {
  const { postId, category } = useParams();
  const { isLoading, data, isError, error } = useQuery<IPostResponse>(
    [postId, "getPost"],
    () => getPost(postId!),
    {
      retry: false,
    }
  );
  if (isError) {
    if (error instanceof Error) console.log(error.message);
  }

  return (
    <Wrapper>
      <div className="w-full px-10">
        <div className="flex items-center justify-between">
          <Title text={category!}></Title>
          <Link to={`/${category}/write`}>
            <button className="bg-main px-3 py-2 text-white rounded-md">
              Write
            </button>
          </Link>
        </div>
        {data && data.state === "success" ? (
          <>
            <div className="border-b-4 border-b-main mt-8 px-2 mb-2 pb-2">
              <h1>{data?.post.title}</h1>
            </div>
            <div className="mb-1 flex items-center space-x-4 justify-between px-2">
              <div className="flex justify-between w-full">
                <div className="display flex space-x-4">
                  <div className="disply flex">
                    <img
                      alt="owner_avatar"
                      src={"/" + data?.post.owner.avatar}
                      className="bg-white w-8 h-8 rounded-full mr-2"
                    />
                    <span>{data?.post.owner.nickname}</span>
                  </div>
                  <div className="space-x-1">
                    <span>{data?.post.meta.views} views</span>
                    <span>{data?.post.meta.upvotes} up</span>
                    <span>{data?.post.meta.downvotes} down</span>
                  </div>
                </div>
                <span>{data?.post.createdAt}</span>
              </div>
            </div>
            <div className="mx-2 border-b-2 border-b-main pb-10 pt-10 mb-10">
              {parse(data.post?.contents)}
            </div>
            <div className="flex space-x-4 w-full justify-end">
              <Link to={"edit"}>
                <Button
                  text="Edit"
                  customClassName="w-20 hover:bg-powermain bg-main px-3 py-2 text-white rounded-md"
                ></Button>
              </Link>
              <Link to={"delete"}>
                <Button
                  text="Delete"
                  customClassName="w-20 hover:bg-powermain bg-main px-3 py-2 text-white rounded-md"
                ></Button>
              </Link>
            </div>
            <WriteComment postId={postId!}></WriteComment>
            <ul className="mt-10 space-y-4">
              {data?.post?.comments?.map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  postId={postId!}
                ></Comment>
              ))}
            </ul>
          </>
        ) : null}
      </div>
      <Outlet />
    </Wrapper>
  );
}

export default Post;
