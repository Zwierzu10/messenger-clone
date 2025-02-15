import { SearchIcon } from "lucide-react";

const SideBar = () => {
    return ( 
        <div className="sidebar w-1/5 min-w-40 h-screen bg-gray-800 text-white p-5"> 
            <div className="w-full h-[10%] flex justify-center items-center">
                <div className="INPUT-DIV w-[80%] h-1/2 bg-gray-100 flex rounded-2xl">
                    <input type="text" className="bg-transparent h-full w-[80%] text-black placeholder:text-black p-3"/>
                    <button className="w-[20%] flex justify-center items-center"><SearchIcon size={24} className="text-black"/></button>
                </div>
            </div>
        </div>
     );
}
 
export default SideBar;