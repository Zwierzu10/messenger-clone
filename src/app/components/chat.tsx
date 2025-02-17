import { Send } from "lucide-react";




interface User {
  id: string;
  name: string;
  surname?: string;
}

interface SelectedUserProps {
  selectedUser: User | null;
}

const Chat: React.FC<SelectedUserProps> = ({ selectedUser }) => {
  return (
    <div className="CHAT-DIV w-4/5 h-screen bg-gray-100">
      {selectedUser ? (
        <div className="SELECTED-CHAT w-full h-full flex flex-col justify-start items-start">
          <div className=" w-full h-[10%] bg-gray-200 flex justify-start items-center border-b-2 border-gray-300">
            <h1 className="text-4xl text-black ml-[5%]">
              {selectedUser.name} {selectedUser.surname}
            </h1>
          </div>

            <div className="CHAT-DIV w-full h-[90%] bg-gray-100 flex flex-col justify-end items-start">
                <div className="w-full h-[10%] bg-transparent flex justify-start items-center p-4">
                    <input type="text" className="w-4/5 h-full rounded-full text-black placeholder:text-black p-3" />
                    <button className="w-[5%] flex justify-center items-center rotate-45"><Send size={32} className="text-black"/></button>
                </div>
            </div>

        </div>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-4xl text-black">
            zrobic zeby ostatni chat sie otworzyl
          </h1>
        </div>
      )}
    </div>
  );
};

export default Chat;
