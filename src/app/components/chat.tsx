'use client';
import { collection, query, addDoc, serverTimestamp, onSnapshot, orderBy, where } from "firebase/firestore";
import { firestore } from "../../firebaseConfig";
import { Send } from "lucide-react";

import { useState, useEffect } from "react";


import { useUser } from "@clerk/nextjs";

interface UserType {
  id: string;
  name: string;
  surname?: string;
}

interface SelectedUserProps {
  selectedUser: UserType | null;
}


interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: any;
}



const Chat: React.FC<SelectedUserProps> = ({ selectedUser }) => {

  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const { user } = useUser();
  const currentUserId = user?.id;

  useEffect(() => {
    if (!selectedUser) {
      setMessages([]);
      return;
    }

    const messagesRef = collection(firestore, "messages");
    const messagesQuery = query(
      messagesRef,
      where("senderReceiverPair", "in", [
        `${currentUserId}_${selectedUser.id}`,
        `${selectedUser.id}_${currentUserId}`
      ]),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [selectedUser]);




  const sendMessage = async () => {
    console.log("first")
    if (!user || !selectedUser || inputValue.trim() === ""){
      console.log(user, selectedUser, inputValue);
      return;
    } 

    await addDoc(collection(firestore, "messages"), {
      senderId: user.id,
      receiverId: selectedUser.id,
      senderReceiverPair: `${user.id}_${selectedUser.id}`,
      text: inputValue,
      timestamp: serverTimestamp(),
    });
    setInputValue("");
  }



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
              <div className="MESSAGES-CONTAINER w-full h-[full] overflow-auto">
                {messages.map((message) => (
                      <div key={message.id} className={`w-full h-auto flex justify-${message.senderId === currentUserId ? "end" : "start"} items-center p-1`}>
                          <div className={`bg-${message.senderId === currentUserId ? "blue-400" : "gray-200"} rounded-xl p-4`}>
                              <h1 className="text-black">{message.text}</h1>
                          </div>
                      </div>
                  ))}
              </div>

                <div className="w-full h-[10%] bg-transparent flex justify-start items-center p-4">
                    <input type="text" className="w-4/5 h-full rounded-full text-black placeholder:text-black p-3" value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
                    <button className="w-[5%] flex justify-center items-center rotate-45" onClick={sendMessage}><Send size={32} className="text-black"/></button>
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
