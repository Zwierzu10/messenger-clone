'use client';
import { UserButton } from "@clerk/nextjs";
import { SearchIcon, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { firestore } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

interface User {
    id: string;
    name: string;
    surname?: string; 
}

interface SideBarProps {
  setSelectedUser: (user: User | null) => void;
  userHistory: User[];
  selectedUser: User | null;
}


const SideBar: React.FC<SideBarProps> = ({ setSelectedUser, userHistory,selectedUser }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(firestore, "users");
                const querySnapshot = await getDocs(usersCollection);
                const usersData: User[] = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as User[];

                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const normalizeString = (str: string) => str.replace(/\s+/g, ' ').trim().toLowerCase();

        const normalizedInput = normalizeString(inputValue);

        if (normalizedInput === "") {
            setFilteredUsers([]);
            return;
        }

        const results = users
            .filter(user => {
                const name = normalizeString(user.name || ""); 
                const surname = normalizeString(user.surname || ""); 
                const fullName = normalizeString(`${user.name} ${user.surname || ""}`);

                return name.includes(normalizedInput) || surname.includes(normalizedInput) || fullName.includes(normalizedInput);
            })
            .slice(0, 7);

        setFilteredUsers(results);
    }, [inputValue, users]);


    


    return ( 
        <div className="SIDEBAR-DIV w-1/5 min-w-40 h-screen bg-gray-200 text-white p-1 flex flex-col justify-start items-start border-r-2 border-gray-300"> 
            <div className={`w-full h-[10%] flex ${isFocused ? "justify-evenly" : "justify-center"} items-center`}>
                {isFocused && (
                    <button onClick={() => { setInputValue(""); setIsFocused(false); }}>
                        <ArrowLeft size={32} className="text-black hover:bg-gray-300 bg-transparent rounded-full transition-all duration-300"/>
                    </button>
                )}
                <div className={`INPUT-DIV w-[90%] max-w-[20rem] h-1/2 bg-gray-100 flex rounded-full`}>
                    <input 
                        type="text" 
                        className="bg-transparent h-full w-[80%] text-black placeholder:text-black p-3" 
                        placeholder="Search users..." 
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)} 
                        onFocus={() => setIsFocused(true)} 
                    />
                    <button className="w-[20%] flex justify-center items-center">
                        <SearchIcon size={24} className="text-black"/>
                    </button>
                </div>
            </div>

            {isFocused ? (
                <div className="USERS-LIST-SEARCH w-full h-[80%] overflow-y-auto flex flex-col justify-start items-start">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                        <button
                        key={user.id}
                        className={`p-2 hover:bg-gray-300 text-black cursor-pointer w-full flex justify-start items-center`}
                        onClick={() => {
                            setSelectedUser(user);
                            setIsFocused(false);
                            setInputValue("");
                        }}
                        >                                
                                {user.name} {user.surname}
                            </button>
                        ))
                    ) : (
                        <p className="text-black p-2">No users found</p>
                    )}
                </div>
            ) : (
                <div className="USERS-HISTORY w-full h-[80%]">
                    {userHistory.map(user=> (
                        <button 
                            key={user.id}
                            className={`p-2 hover:bg-gray-300 text-black cursor-pointer w-full flex justify-start items-center ${selectedUser?.id === user.id ? "bg-gray-300" : ""}`}
                            onClick={() => setSelectedUser(user)}
                        >
                            {user.name} {user.surname}
                        </button>
                    ))}
                </div>
            )}

            <UserButton
                appearance={{
                    elements: {
                        userButtonAvatarBox: {
                            width: '100%', 
                            height: '100%',
                            minWidth: '1.5rem',
                            minHeight: '1.5rem',
                            maxWidth: '3.5rem',
                            maxHeight: '3.5rem' 
                        },
                    },
                }}
            />
        </div>
    );
};

export default SideBar;
