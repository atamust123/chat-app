"use client";

import { useConversation } from "@/app/hooks/useConversation";
import { User } from "@prisma/client";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import { find } from "lodash";
import { pusherClient } from "@/app/libs/pusher";
import { FullConversationType } from "@/app/types";
import { GroupChatModal } from "@/app/components/modals/GroupChatModal";
import ConversationBox from "./ConversationBox";

interface ConversationList {
  initialItems: FullConversationType[];
  users: User[];
  title?: string;
}

export const ConversationList: React.FC<ConversationList> = (props) => {
  const { initialItems, users, title } = props || {};
  const [items, setItems] = useState(initialItems);
  const [modalOpen, setModalOpen] = useState(false);

  const router = useRouter();
  const session = useSession();

  const { conversationId, open } = useConversation();

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    pusherClient.subscribe(pusherKey);

    const updateHandler = (conversation: FullConversationType) => {
      setItems((prev) =>
        prev.map((p) => {
          if (p.id === conversation.id) {
            return {
              ...p,
              messages: conversation.messages,
            };
          }
          return p;
        })
      );
    };

    const newHanler = (conversation: FullConversationType) => {
      setItems((prev) => {
        if (find(prev, { id: conversation.id })) {
          return prev;
        }
        return [conversation, ...prev];
      });
    };

    const removeHandler = (conversation: FullConversationType) => {
      setItems((prev) => {
        return [...prev.filter((convo) => convo.id !== conversation.id)];
      });
    };

    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:new", newHanler);
    pusherClient.bind("conversation:remove", removeHandler);
  }, [pusherKey, router]);

  return (
    <>
      <GroupChatModal
        users={users}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
      <aside
        className={clsx(
          `
        fixed 
        inset-y-0 
        pb-20
        lg:pb-0
        lg:left-20 
        lg:w-80 
        lg:block
        overflow-y-auto 
        border-r 
        border-gray-200 
      `,
          open ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-800">Messages</div>
            <div
              onClick={() => setModalOpen(true)}
              className="
                rounded-full 
                p-2 
                bg-gray-100 
                text-gray-600 
                cursor-pointer 
                hover:opacity-75 
                transition
              "
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
          {items.map((item) => (
            <ConversationBox
              key={item.id}
              data={item}
              selected={conversationId === item.id}
            />
          ))}
        </div>
      </aside>
    </>
  );
};
