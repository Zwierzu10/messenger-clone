'use client';
import Chat from "./components/chat";
import SideBar from "./components/sidebar";
import UserSync from "./components/userSync";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { firestore } from "../firebaseConfig";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

interface User {
  id: string;
  name: string;
  surname?: string; 
}

export default function Home() {
  const [SelectedUser, SetSelectedUser] = useState<User | null>(null);
  const [UserHistory, SetUserHistory] = useState<User[]>([]);
  const { user } = useUser();
  const currentUserId = user?.id;

  useEffect(() => {
    if (!currentUserId) return;

    const userHistoryRef = collection(firestore, `userHistory/${currentUserId}/history`);
    const userHistoryQuery = query(userHistoryRef, orderBy("lastInteraction", "desc"));

    const unsubscribe = onSnapshot(userHistoryQuery, (snapshot) => {
      const history = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          surname: data.surname,
        } as User;
      });
      
      SetUserHistory(history);
    });

    return () => unsubscribe();
  }, [currentUserId]);

  return (
    <div className="HOME-DIV w-screen h-screen flex justify-start items-center">
      <UserSync/>
      <SideBar setSelectedUser={SetSelectedUser} userHistory={UserHistory} selectedUser={SelectedUser}/>
      <Chat selectedUser={SelectedUser} setUserHistory={SetUserHistory} userHistory={UserHistory}/>
    </div>
  );
}
