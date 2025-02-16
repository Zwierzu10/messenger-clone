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
        <div className="CHAT-DIV w-4/5 h-screen bg-gray-100 p-5">

        <h1 className="text-black">{`${selectedUser?.name} ${selectedUser?.surname}`}</h1>

        </div>
    );
}
 
export default Chat;