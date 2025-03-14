'use client';
import { collection, query, addDoc, serverTimestamp, onSnapshot, orderBy, where, doc, setDoc } from "firebase/firestore";
import { firestore } from "../../firebaseConfig";
import { Send, ArrowLeft } from "lucide-react";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";

interface UserType {
  id: string;
  name: string;
  surname?: string;
}

interface SelectedUserProps {
  selectedUser: UserType | null;
  setUserHistory: React.Dispatch<React.SetStateAction<UserType[]>>;
  userHistory: UserType[];
  setSelectedUser: (user: UserType | null) => void;
  isMobile: boolean;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: any;
}

const Chat: React.FC<SelectedUserProps> = ({ selectedUser, setUserHistory, userHistory, setSelectedUser, isMobile }) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  
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
  }, [selectedUser, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  }, [messages]);

const sendMessage = async () => {
  if (!user || !selectedUser || inputValue.trim() === "") return;

  const messageData = {
    senderId: user.id,
    receiverId: selectedUser.id,
    senderReceiverPair: `${user.id}_${selectedUser.id}`,
    text: inputValue,
    timestamp: serverTimestamp(),
  };

  await addDoc(collection(firestore, "messages"), messageData);
  setInputValue("");

  const senderHistoryRef = doc(firestore, `userHistory/${currentUserId}/history/${selectedUser.id}`);
  await setDoc(senderHistoryRef, {
    id: selectedUser.id,
    name: selectedUser.name,
    surname: selectedUser.surname || "",
    lastInteraction: serverTimestamp(),
  });

  const receiverHistoryRef = doc(firestore, `userHistory/${selectedUser.id}/history/${currentUserId}`);
  await setDoc(receiverHistoryRef, {
    id: currentUserId,
    name: user.firstName || user.username || "Unknown",
    surname: user.lastName || "",
    lastInteraction: serverTimestamp(),
  });

  setUserHistory(prevHistory => {
    const filteredHistory = prevHistory.filter(u => u.id !== selectedUser.id);
    return [{ ...selectedUser }, ...filteredHistory];
  });
};


  return (
    <div className={`CHAT-DIV ${selectedUser && isMobile ? "w-full" : "w-4/5" } w-4/5 h-screen bg-gray-100`}>
      {selectedUser ? (
        <div className="SELECTED-CHAT w-full h-full flex flex-col justify-start items-start">
          <div className="w-full h-[10%] bg-gray-200 flex justify-start items-center border-b-2 border-gray-300">
            {isMobile ? (
              <ArrowLeft size={32} className="text-black cursor-pointer ml-[5%]" onClick={()=>setSelectedUser(null)}/>

            ):(
              <></>
            )}

            <h1 className="text-4xl text-black ml-[5%]">
              {selectedUser.name} {selectedUser.surname}
            </h1>
          </div>

          <div className="CHAT-DIV w-full h-[90%] bg-gray-100 flex flex-col justify-end items-start">
            <div className="MESSAGES-CONTAINER w-full h-full overflow-auto">
              {messages.map((message) => (
                
             
              
                <div
                  key={message.id}
                  className={`w-full h-auto flex justify-${message.senderId === currentUserId ? "end" : "start"} items-center p-1`}
                >
                  <div className={`${message.senderId === currentUserId ? "bg-blue-400 text-white" : "bg-gray-200 text-black"} rounded-xl p-4 cursor-default`}>
                    <h1>{message.text}</h1>
                    </div>
                </div>
                
                
                
                
                ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="w-full h-[10%] bg-transparent flex justify-start items-center p-4">
              <input
                type="text"
                autoComplete="off"
                className="w-4/5 h-full rounded-full text-black placeholder:text-black p-3"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
              />
              {isMobile ? (
              <button className="w-[20%] ml-[5%] flex justify-center items-center bg-blue-500 p-1 rounded-lg text-white" onClick={sendMessage}>Send</button>                
              ) : (
                <button className="w-[5%] flex justify-center items-center rotate-45" onClick={sendMessage}>
                  <Send size={32} className="text-black" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center w-full h-full">
          <h1 className="text-4xl text-black">
            Start a conversation by selecting a user.
          </h1>
        </div>
      )}
    </div>
  );
};

export default Chat;
