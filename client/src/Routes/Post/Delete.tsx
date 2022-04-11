import Button from "Components/Button";
import Input from "Components/Input";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Overlay from "Components/Overlay";

export interface IDeletePostFrom {
  password: string;
  serverError?: string;
}

function Delete() {
  const { postId, category } = useParams();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IDeletePostFrom>();
  const onClickOverlay = () => {
    navigate(-1);
  };
  const navigate = useNavigate();
  const isValid = async (data: IDeletePostFrom) => {
    await axios
      .post(`/api/posts/${postId}`, data)
      .then((response) => {
        console.log(response.data);
        navigate(`/${category}`);
      })
      .catch((error) => {
        const { field, message } = error.response.data;
        setError(field, { message });
      });
  };

  return (
    <>
      <Overlay onClick={onClickOverlay}></Overlay>
      <div className="fixed top-40 z-50 bg-white opacity-100 w-2/3 h-2/5 rounded-md flex flex-col justify-center items-center">
        <span className="text-lg">Do u wanna delete this post?</span>
        <form
          onSubmit={handleSubmit(isValid)}
          className="px-10 mx-10 rounded-xl bg-cream flex flex-col justify-start items-center py-11 space-y-2"
        >
          <Input
            label="Password"
            id="password"
            type="password"
            errors={errors?.password?.message}
            required
            register={register("password", {
              required: "Password is required to delete it.",
            })}
          />
          <Button text="Delete" errors={errors?.serverError?.message}></Button>
        </form>
      </div>
    </>
  );
}

export default Delete;
