"use client";
import { User } from "@prisma/client";
import { useActiveList } from "../hooks/useActiveLists";
import Image from "next/image";

interface Avatar {
  user?: User;
}

export const Avatar: React.FC<Avatar> = (props) => {
  const { user } = props || {};
  const { members } = useActiveList();
  const active = user?.email ? members.indexOf(user?.email) !== -1 : false;
  return (
    <div className="relative">
      <div
        className="
        relative 
        inline-block 
        rounded-full 
        overflow-hidden
        h-9 
        w-9 
        md:h-11 
        md:w-11
      "
      >
        <Image fill src={user?.image || "/img/placeholder.jpg"} alt="Avatar" />
      </div>
      {active ? (
        <span
          className="
            absolute 
            block 
            rounded-full 
            bg-green-500 
            ring-2 
            ring-white 
            top-0 
            right-0
            h-2 
            w-2 
            md:h-3 
            md:w-3
          "
        />
      ) : null}
    </div>
  );
};
