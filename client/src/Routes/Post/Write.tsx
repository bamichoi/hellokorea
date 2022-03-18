import { useState } from "react";
import { useForm } from "react-hook-form";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Wrapper from "Components/Wrapper";
import Title from "Components/Title";
import Button from "Components/Button";
import Input from "Components/Input";
import axios from "axios";

interface IWritePostForm {
  title: string;
  contents: string;
  serverError?: string;
}
function Write() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const rawContentState = convertToRaw(editorState.getCurrentContent());
  console.log(draftToHtml(rawContentState));
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IWritePostForm>({
    mode: "onBlur",
  });
  const isValid = async (data: IWritePostForm) => {
    await axios
      .post("/api/post", data)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
        const { field, message } = error.response.data;
        setError(field, { message });
      });
  };
  return (
    <Wrapper>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <Title text="Write a post"></Title>
        <form onSubmit={handleSubmit(isValid)} className="h-full px-10 h-">
          <Input
            label="Title"
            id="title"
            type="text"
            errors={errors?.title?.message}
            required
            customCls="border-[1px] border-[gray] px-2 py-1 w-full"
            register={register("title", {
              required: "Title is required",
            })}
          />
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="h-80 mx-10 w-full"
            toolbar={{
              options: [
                "inline",
                "blockType",
                "fontSize",
                "fontFamily",
                "list",
                "textAlign",
                "colorPicker",
                "link",
                "remove",
                "history",
              ],
              inline: {
                options: ["bold", "italic", "underline", "strikethrough"],
              },
              blockType: {
                options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6"],
              },
              list: { inDropdown: true },
              textAlign: { inDropdown: true },
              link: { inDropdown: true },
              history: { inDropdown: false },
            }}
            placeholder="Write a some text.."
          />
          <textarea
            {...register("contents")}
            className="disabled:opacity-0"
            disabled
            value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
          />
          <Button text="submit"></Button>
        </form>
      </div>
    </Wrapper>
  );
}

export default Write;
