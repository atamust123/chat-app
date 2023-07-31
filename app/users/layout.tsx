import { getUsers } from "../actions/getUsers";
import { Sidebar } from "../components/sidebar/Sidebar";

import { UserList } from "./components/UserList";

interface UserLayout {
  children: React.ReactNode;
}

export default async function UserLayout(props: UserLayout) {
  const { children } = props || {};
  const users = await getUsers();
  return (
    <Sidebar>
      <div className="h-full">
        <UserList items={users} />
        {children}
      </div>
    </Sidebar>
  );
}
