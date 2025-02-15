'use client';
import { UserButton } from "@clerk/nextjs";
import { SearchIcon, ArrowLeft } from "lucide-react";
import { useState } from "react";


const SideBar = () => {

    const [isFocused,setIsFocused] = useState(false);



    return ( 
        <div className="SIDEBAR-DIV w-1/5 min-w-40 h-screen bg-gray-200 text-white p-1"> 
            <div className={`w-full h-[10%] flex ${isFocused ? "justify-evenly" : "justify-center"} items-center`}>
                {isFocused ? <button><ArrowLeft size={32} className="text-black hover:bg-gray-300 bg-transparent rounded-full transition-all duration-300"/></button> : <></>}
                <div className={`INPUT-DIV ${!isFocused ? "w-[90%]" : "w-[70%]"} max-w-[20rem] h-1/2 bg-gray-100 flex rounded-2xl`}>
                    <input type="text" className="bg-transparent h-full w-[80%] text-black placeholder:text-black p-3" onFocus={(()=>setIsFocused(true))} onBlur={(()=>setIsFocused(false))}/>
                    <button className="w-[20%] flex justify-center items-center"><SearchIcon size={24} className="text-black"/></button>
                </div>
            </div>

            <div className="USERS-LIST">

            </div>


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
}
 
export default SideBar;