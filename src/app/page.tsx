import Chat from "./components/chat";
import SideBar from "./components/sidebar";
import UserSync from "./components/userSync";

export default function Home() {
  return (
   <div className="HOME-DIV w-screen h-screen flex justify-start items-center">
      <UserSync/>
      <SideBar/>
      <Chat/>
   </div>
  );
}
