import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <Loader size={52} className="animate-spin text-black" />
    </div>
  );
};

export default Loading;
