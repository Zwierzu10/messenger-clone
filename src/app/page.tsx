'use client'
import Chat from "./components/chat";
import SideBar from "./components/sidebar";
import UserSync from "./components/userSync";
import { useState } from "react";

interface User {
  id: string;
  name: string;
  surname?: string; 
}


export default function Home() {

  const [SelectedUser, SetSelectedUser] = useState<User | null>(null);

  return (
   <div className="HOME-DIV w-screen h-screen flex justify-start items-center">
      <UserSync/>
      <SideBar setSelectedUser={SetSelectedUser}/>
      <Chat selectedUser={SelectedUser}/>
   </div>
  );
}
