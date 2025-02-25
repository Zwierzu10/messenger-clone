'use client';
import Chat from "./components/chat";
import SideBar from "./components/sidebar";
import UserSync from "./components/userSync";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { firestore } from "../firebaseConfig";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { useMediaQuery } from "react-responsive";

interface User {
  id: string;
  name: string;
  surname?: string; 
}

export default function Home() {
  const IsMobile = useMediaQuery({ query: "(max-width: 1079px)" });

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
    <>
      {IsMobile ? (
        <div className="HOME-DIV-MOBILE w-screen h-screen flex justify-start items-center">
          <UserSync/>
          {SelectedUser ? (
            <Chat 
              selectedUser={SelectedUser} 
              setUserHistory={SetUserHistory} 
              userHistory={UserHistory} 
              setSelectedUser={SetSelectedUser} 
              isMobile={IsMobile}
            />
          ) : (
            <SideBar 
              setSelectedUser={SetSelectedUser} 
              userHistory={UserHistory} 
              selectedUser={SelectedUser} 
              isMobile={IsMobile}
            />
          )}
        </div>
      ) : (
        <div className="HOME-DIV-PC w-screen h-screen flex justify-start items-center">
          <UserSync />
          <SideBar 
            setSelectedUser={SetSelectedUser} 
            userHistory={UserHistory} 
            selectedUser={SelectedUser} 
            isMobile={IsMobile}
          />
          <Chat 
            selectedUser={SelectedUser} 
            setUserHistory={SetUserHistory} 
            userHistory={UserHistory} 
            setSelectedUser={SetSelectedUser} 
            isMobile={IsMobile}
          />
        </div>
      )}
    </>
  );
}
