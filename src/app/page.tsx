import Chat from "./components/chat";
import SideBar from "./components/sidebar";


export default function Home() {
  return (
   <div className="HOME-DIV w-screen h-screen flex justify-start items-center">
      <SideBar/>
      <Chat/>
   </div>
  );
}
