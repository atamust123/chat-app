"use client";

import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { CldUploadButton } from "next-cloudinary";
import { useConversation } from "@/app/hooks/useConversation";
import Form from "@/app/(site)/components/Form/Form";

export const ConversationForm = () => {
  const { conversationId } = useConversation();
  const formAttributes = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    axios.post("/api/messages", { ...data, conversationId });
  };

  const handleUpload = (res: any) => {
    axios.post("/api/messages", { image: res.info.secure_url, conversationId });
  };

  return (
    <div
      className="
        py-4 
        px-4 
        bg-white 
        border-t 
        flex 
        items-center 
        gap-2 
        lg:gap-4 
        w-full
      "
    >
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onUpload={handleUpload}
        uploadPreset="ebtx02ct" // cloudinary upload preset name field
      >
        <HiPhoto size={30} className="text-sky-500" />
      </CldUploadButton>
      <Form
        formAttributes={formAttributes}
        onSubmit={formAttributes.handleSubmit(onSubmit)}
        formProps={{ className: "flex items-center gap-2 lg:gap-4 w-full" }}
      >
        <Form.Input
          name="message"
          inputProps={{
            placeholder: "Write a message",
            required: true,
            className:
              "text-black font-light py-2 px-4 bg-neutral-100 w-full rounded-full focus:outline-none",
            autoComplete: "message",
          }}
        />
        <button
          type="submit"
          className="
        rounded-full 
        p-2 
        bg-sky-500 
        cursor-pointer 
        hover:bg-sky-600 
        transition
      "
        >
          <HiPaperAirplane size={18} className="text-white" />
        </button>
      </Form>
    </div>
  );
};
