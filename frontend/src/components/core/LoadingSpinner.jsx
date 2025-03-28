import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

const LoadingSpinner = () => {
  const { isLoading } = useSelector((state) => state.loading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      </div>
    </div>
  );
};

export default LoadingSpinner; 