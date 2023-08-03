"use client";

import clsx from "clsx";

import { useConversation } from "../hooks/useConversation";
import { EmptyState } from "../components/EmptyState";

const Home = () => {
  const { open } = useConversation();

  return (
    <div
      className={clsx("lg:pl-80 h-full lg:block", open ? "block" : "hidden")}
    >
      <EmptyState />
    </div>
  );
};

export default Home;
