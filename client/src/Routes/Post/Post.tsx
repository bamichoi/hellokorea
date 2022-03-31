import Wrapper from "Components/Wrapper";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";
import { useQuery } from "react-query";
import { getPost } from "api";
import Title from "Components/Title";

interface IComment {
  text: string;
  owner: string;
  upvotes: number;
  downvotes: number;
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
}

interface IPostResponse {
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
        <Title text={category!}></Title>
        {data && data.state === "success" ? (
          <>
            <div className="border-b-4 border-b-main mt-10 px-2">
              <h1>{data?.post.title}</h1>
            </div>
            <div className="mb-1 flex items-center space-x-4 justify-between px-2">
              <div className="flex justify-center items-center py-2 rounded-lg">
                <img
                  alt="writer_avatar"
                  className="bg-white w-8 h-8 rounded-full mr-2"
                  src={"/" + data?.post.owner.avatar}
                />
                <span className="text-lg">{data?.post.owner.nickname}</span>
              </div>
              <span>{data?.post.createdAt}</span>
            </div>
            <div className="mx-2 border-b-2 border-b-main pb-10 pt-10 mb-10">
              {parse(data.post?.contents)}
            </div>
          </>
        ) : null}
      </div>
    </Wrapper>
  );
}

export default Post;
