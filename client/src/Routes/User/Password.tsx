import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loggedInUser, logout } from "reducers/auth";
import Title from "Components/Title";
import Wrapper from "Components/Wrapper";
import Button from "Components/Button";
import axios from "axios";

interface IPassword {
  currentPassword: string;
  newPassword: string;
  newPassword2: string;
  serverError?: string;
}

function Password() {
  const user = useSelector(loggedInUser);
  const { id } = user || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    watch,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IPassword>({ mode: "onBlur" });
  const newPassword = watch("newPassword");

  const isValid = async (data: IPassword) => {
    await axios
      .post(`/api/user/${id}/password`, data)
      .then(async (response) => {
        window.alert("Password Change is Done. Please login again");
        await axios
          .get("/api/session")
          .then((response) => {
            dispatch(logout());
            navigate("/login");
          })
          .catch((error) => {
            // ToDo: redirect to Error page
          });
      })
      .catch((error) => {
        const { field, message } = error.response.data;
        setError(field, { message });
      });
  };
  return (
    <Wrapper>
      <div className="w-full flex flex-col items-center justify-center px-10">
        <Title text="Change password"></Title>
        <form
          onSubmit={handleSubmit(isValid)}
          className="h-full px-10 mx-10 rounded-xl w-full bg-cream flex flex-col justify-start items-center py-11 space-y-2"
        >
          <svg
            className="w-32 h-32rounded-md text-powermain"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            ></path>
          </svg>
          <div className="flex flex-col w-full">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              {...register("currentPassword", {
                required: "Current password is required",
              })}
              type="password"
              id="currentPassword"
              className="px-2 py-1 rounded-md"
            ></input>
            <span className="text-warning font-semibold">
              {errors?.currentPassword?.message}
            </span>
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="newPssword">New Password</label>
            <input
              {...register("newPassword", {
                required: "Current password is required",
              })}
              type="password"
              id="newPassword"
              className="px-2 py-1 rounded-md"
            ></input>
            <span className="text-warning font-semibold">
              {errors?.newPassword?.message}
            </span>
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="newPassword2">Confirm New Password</label>
            <input
              {...register("newPassword2", {
                required: "Fill this blank for confirming password",
                validate: (value) =>
                  value === newPassword || "New Password is not matched",
              })}
              type="password"
              id="newPassword2"
              className="px-2 py-1 rounded-md"
            ></input>
            <span className="text-warning font-semibold">
              {errors?.newPassword2?.message}
            </span>
          </div>
          <div className="w-full">
            <Button text="Change Password"></Button>
            <span className="text-warning font-semibold">
              {errors.serverError?.message}
            </span>
          </div>
        </form>
      </div>
    </Wrapper>
  );
}

export default Password;
