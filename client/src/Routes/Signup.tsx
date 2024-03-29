import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Title from "Components/Title";
import Wrapper from "Components/Wrapper";
import Input from "Components/Input";
import Button from "Components/Button";
import { useMutation } from "react-query";
import { signupUser } from "api/userApi";

export interface ISignupForm {
  email: string;
  firstname: string;
  lastname: string;
  birthdate: string;
  nickname: string;
  password: string;
  password2: string;
  serverError?: string;
}

interface ISignupError {
  response: {
    data: {
      state: string;
      field: "email" | "password" | "nickname";
      message: string;
    };
  };
}

function Signup() {
  const navigate = useNavigate();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ISignupForm>({ mode: "onBlur" });
  const password = watch("password");
  const { isLoading, mutate } = useMutation(
    (data: ISignupForm) => signupUser(data),
    {
      onSuccess: () => navigate("/login"),
      onError: (error: ISignupError) => {
        const { field, message } = error.response.data;
        setError(field, { message });
      },
    }
  );
  const isValid = async (data: ISignupForm) => {
    mutate(data);
  };
  return (
    <Wrapper>
      <main className="w-full h-full flex flex-col justify-center items-center">
        <Title text="Sign up" />
        <form
          onSubmit={handleSubmit(isValid)}
          className="flex flex-col justify-center px-5 pt-10 pb-8  rounded-md space-y-3 border-2 border-main w-96"
        >
          <Input
            label="Email"
            id="email"
            type="email"
            customCls="border-2 border-main px-2 py-1 w-ful"
            required
            errors={errors?.email?.message}
            register={register("email", {
              required: "Email is required",
              pattern: {
                value:
                  /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
                message: "It is not valid email address",
              },
            })}
          />
          <Input
            label="First name"
            id="firstname"
            type="text"
            errors={errors?.firstname?.message}
            required
            customCls="border-2 border-main px-2 py-1 w-ful"
            register={register("firstname", {
              required: "First name is required",
            })}
          />
          <Input
            label="Last name"
            id="lastname"
            type="text"
            errors={errors?.lastname?.message}
            required
            customCls="border-2 border-main px-2 py-1 w-ful"
            register={register("lastname", {
              required: "Last name is required",
            })}
          />
          <Input
            label="Birthdate"
            id="birthdate"
            type="date"
            errors={errors?.birthdate?.message}
            required
            customCls="border-2 border-main px-2 py-1 w-ful"
            register={register("birthdate", {
              required: "Birtdate is required",
            })}
          />
          <Input
            label="Nickname"
            id="nickname"
            type="text"
            errors={errors?.nickname?.message}
            required
            customCls="border-2 border-main px-2 py-1 w-ful"
            register={register("nickname", {
              required: "Nickname is required",
            })}
          />
          <Input
            label="Password"
            id="password"
            type="password"
            errors={errors?.password?.message}
            required
            customCls="border-2 border-main px-2 py-1 w-ful"
            register={register("password", {
              required: "New password is required",
            })}
          />
          <Input
            label="Confirm Password"
            id="password2"
            type="password"
            errors={errors?.password2?.message}
            required
            customCls="border-2 border-main px-2 py-1 w-ful"
            register={register("password2", {
              required: "Fill this blank for confirming password",
              validate: (value) =>
                value === password || "New Password is not matched",
            })}
          />
          <Button text="Create Account" errors={errors.serverError?.message} />
        </form>
      </main>
    </Wrapper>
  );
}

export default Signup;
