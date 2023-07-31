import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { Avatar } from "@/app/components/Avatar";
import { LoadingModal } from "@/app/components/modals/LoadingModal";

interface UserBox {
  data: User;
}

export const UserBox: React.FC<UserBox> = (props) => {
  const { data } = props || {};
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(() => {
    setLoading(true);
    axios
      .post("/api/conversations", { userId: data.id })
      .then((res) => router.push(`/conversations/${res.data.id}`))
      .finally(() => setLoading(false));
  }, [data, router]);

  return (
    <>
      {loading && <LoadingModal />}
      <div
        onClick={handleClick}
        className="
        w-full 
        relative 
        flex 
        items-center 
        space-x-3 
        bg-white 
        p-3 
        hover:bg-neutral-100
        rounded-lg
        transition
        cursor-pointer
      "
      >
        <Avatar user={data} />
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-gray-900">{data.name}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
