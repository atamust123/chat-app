"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { User } from "@prisma/client";
import { CldUploadButton } from "next-cloudinary";

import Button from "../Button";
import Image from "next/image";
import { toast } from "react-hot-toast";
import Form from "@/app/(site)/components/Form/Form";
import Modal from "../modals/Modal";

interface SettingsModal {
  open?: boolean;
  onClose: () => void;
  currentUser: User;
}

export const SettingsModal: React.FC<SettingsModal> = (props) => {
  const { currentUser, onClose, open } = props || {};
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  console.log(currentUser, "current user");

  const formAttributes = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image,
    },
  });

  const image = formAttributes.watch("image");

  const handleUpload = (res: any) => {
    formAttributes.setValue("image", res.info.secure_url, {
      shouldValidate: true,
    });
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setLoading(true);
    axios
      .post("/api/settings", data)
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setLoading(false));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Form
        onSubmit={formAttributes.handleSubmit(onSubmit)}
        formAttributes={formAttributes}
      >
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2
              className="
                text-base 
                font-semibold 
                leading-7 
                text-gray-900
              "
            >
              Profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Edit your public information.
            </p>

            <div className="mt-10 flex flex-col gap-y-8">
              <Form.Input
                label="Name"
                loading={loading}
                name="name"
                inputProps={{ required: true }}
              />
              <div>
                <label
                  htmlFor="photo"
                  className="
                    block 
                    text-sm 
                    font-medium 
                    leading-6 
                    text-gray-900
                  "
                >
                  Photo
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  <Image
                    width="48"
                    height="48"
                    className="rounded-full"
                    src={image || currentUser?.image || "/img/placeholder.jpg"}
                    alt="Avatar"
                  />
                  <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onUpload={handleUpload}
                    uploadPreset="pgc9ehd5"
                  >
                    <Button disabled={loading} secondary type="button">
                      Change
                    </Button>
                  </CldUploadButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="
            mt-6 
            flex 
            items-center 
            justify-end 
            gap-x-6
          "
        >
          <Button disabled={loading} secondary onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={loading} type="submit">
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
