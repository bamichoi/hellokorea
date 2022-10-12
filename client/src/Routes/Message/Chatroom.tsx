import { sendMessage } from "api/chatApi";
import Title from "Components/Title";
import Username from "Components/username";
import Wrapper from "Components/Wrapper";
import { queryClient } from "index";
import { useMessages } from "libs/useMessages";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useLocation, useParams } from "react-router-dom";
import { IUser } from "reducers/user";
import { IOwner } from "Routes/Post/Post";

export interface ISendMessageForm {
  chatRoomId: string;
  text: string;
  to: string;
  serverError?: string;
}

export interface IMessage {
  from: IOwner;
  to: string;
  message: string;
  createdAt: Date;
  _id: string;
}

interface ISendMessageResponse {
  data: {
    state: string;
    message: IMessage;
  };
}

// To Do: 따로 만들어진 Error 인터페이스들 통일할 것.
interface ISendMessageError {
  response: {
    data: {
      state: string;
      field: "serverError";
      message: string;
    };
  };
}

function Chatroom() {
  const toUser = useLocation().state as IUser;
  const { chatRoomId } = useParams();
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ISendMessageForm>();
  const { isLoading, data, errorMessage } = useMessages(chatRoomId!);
  const messages = data?.data.messages;
  const { isLoading: isMutateLoading, mutate } = useMutation(
    (data: ISendMessageForm) => sendMessage(data),
    {
      onSuccess: (data: ISendMessageResponse) => {
        const message = data.data.message.message; // To Do: text가 더 적합, 이후 네이밍 점검시 참고
        const createdAt = data.data.message.createdAt;
        queryClient.invalidateQueries([chatRoomId, "getMessasges"]);
      },
      onError: (error: ISendMessageError) => {
        const { field, message } = error.response.data;
        setError(field, { message });
      },
    }
  );
  const isValid = async (data: ISendMessageForm) => {
    mutate(data);
    reset();
  };
  useEffect(() => {
    setValue("to", toUser._id);
    setValue("chatRoomId", chatRoomId!);
  }, [toUser._id, chatRoomId, setValue]);
  return (
    <Wrapper>
      <main className="w-full flex flex-col items-center justify-center px-10">
        <Title text={`${toUser.nickname}님과의 대화`} />
        <div className="bg-main flex justify-center w-full p-4 rounded-3xl shadow-lg">
          <Username user={toUser} size="md" />
        </div>
        <ul>
          {messages?.map((message) => (
            <li>
              <span>
                {message.from.nickname} : {message.message}
              </span>
            </li>
          ))}
        </ul>
        <form
          onSubmit={handleSubmit(isValid)}
          className="bg-main p-4  w-full flex fixed bottom-16 justify-center"
        >
          <input
            {...register("text", { required: "Text is required" })}
            placeholder="메세지를 입력해주세요."
            className="rounded-md w-4/5 mr-5 p-2"
            type="text"
          />
          <button className="bg-point px-4 py-1 rounded-md">보내기</button>
        </form>
      </main>
    </Wrapper>
  );
}

export default Chatroom;
