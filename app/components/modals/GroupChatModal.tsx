"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { User } from "@prisma/client";

import Modal from "./Modal";
import Button from "../Button";
import { toast } from "react-hot-toast";
import Form from "@/app/(site)/components/Form/Form";

interface GroupChatModalProps {
  open?: boolean;
  onClose: () => void;
  users: User[];
}

export const GroupChatModal: React.FC<GroupChatModalProps> = ({
  open,
  onClose,
  users = [],
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formAttributes = useForm<FieldValues>({
    defaultValues: {
      name: "",
      members: [],
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setLoading(true);

    axios
      .post("/api/conversations", {
        ...data,
        isGroup: true,
      })
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => toast.error("Something went wrong!"))
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
              Create a group chat
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Create a chat with more than 2 people.
            </p>
            <div className="mt-10 flex flex-col gap-y-8">
              <Form.Input
                label="Name"
                loading={loading}
                name="name"
                inputProps={{ required: true }}
              />
              <Form.Select
                name="members"
                label="Members"
                options={users.map((user) => ({
                  value: user.id,
                  label: user.name,
                }))}
                disabled={loading}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button disabled={loading} onClick={onClose} type="button" secondary>
            Cancel
          </Button>
          <Form.Button disabled={loading}>Create</Form.Button>
        </div>
      </Form>
    </Modal>
  );
};
