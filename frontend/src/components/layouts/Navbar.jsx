import { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import ImageUpload from "@/cloud/UploadCloudinary";
import { Button } from "antd";
import { useSelector } from "react-redux";

function Navbar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [detectedBreed, setDetectedBreed] = useState(null);
  const { user } = useSelector((state) => state.auth);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      console.log("hello");
    }
  };

  const handleImageAnalysisResult = (result) => {
    if (result) {
      setDetectedBreed(result);
    }
  };

  const handleNavigateToAdopt = () => {
    if (detectedBreed?.breed) {
      navigate(`/adopt/${detectedBreed.breed}`);
    }
  };

  const navBar = [
    {
      path: "/forum",
      name: "Diễn dàn",
      isArrow: false,
    },
    {
      path: "/blog",
      name: "Blog",
    },
    {
      path: "/adopt",
      name: "Nhận nuôi",
    },
  ];

  return (
    <>
      {navBar.map((item) => {
        return (
          <div className="flex items-center" key={item.name}>
            <div className="relative group">
              <NavLink
                to={item.path}
                className="flex py-7 items-center gap-2 text-lg font-medium text-gray-500 hover:text-gray-900 h-full"
              >
                {item.name}
                {item.isArrow && (
                  <FaChevronDown className="group-hover:rotate-180 transition-all " />
                )}
              </NavLink>
              {item.dropdown && (
                <div className="absolute top-[5.1rem] bg-white p-2  opacity-0 invisible transform translate-y-4 transition-all duration-150 ease-in-out group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                  {item.dropdown.map((subItem) => (
                    <NavLink
                      key={subItem.name}
                      to={subItem.path}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      {subItem.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div className="flex justify-center items-center mt-2 mb-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="p-3 sm:w-[664px] w-[320px] rounded-md outline-none border-none bg-gray-400/30"
          placeholder="Gửi hình thú cưng của bạn để phân tích"
        />

        <div>
          <Dialog>
            <DialogTrigger asChild>
              <div className="w-6 h-6 translate-x-[-36px] cursor-pointer">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 10.9696L11.9628 18.5497C10.9782 19.4783 9.64274 20 8.25028 20C6.85782 20 5.52239 19.4783 4.53777 18.5497C3.55315 17.6211 3 16.3616 3 15.0483C3 13.7351 3.55315 12.4756 4.53777 11.547M14.429 6.88674L7.00403 13.8812C6.67583 14.1907 6.49144 14.6106 6.49144 15.0483C6.49144 15.4861 6.67583 15.9059 7.00403 16.2154C7.33224 16.525 7.77738 16.6989 8.24154 16.6989C8.70569 16.6989 9.15083 16.525 9.47904 16.2154L13.502 12.4254M8.55638 7.75692L12.575 3.96687C13.2314 3.34779 14.1217 3 15.05 3C15.9783 3 16.8686 3.34779 17.525 3.96687C18.1814 4.58595 18.5502 5.4256 18.5502 6.30111C18.5502 7.17662 18.1814 8.01628 17.525 8.63535L16.5 9.601"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1200px] h-[600px] scroll-smooth overflow-y-scroll">
              <DialogHeader>
                <DialogTitle className="text-[#eb9ecd] flex items-center gap-2">
                  <span className="text-2xl">🐕</span> Tải ảnh lên để phân tích
                </DialogTitle>
                <DialogDescription className="text-[#eb9ecd]">
                  Quá trình phân tích có thể mất vài giây vui lòng đợi để có kết
                  quả tốt nhất
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <ImageUpload onAnalysisResult={handleImageAnalysisResult} />
              </div>
              {user && (
                <DialogFooter>
                  <Button
                    onClick={handleNavigateToAdopt}
                    disabled={!detectedBreed?._id}
                    className="bg-[#eb9ecd] hover:bg-amber-600 text-white font-medium px-6 py-2 rounded-full"
                  >
                    <span className="mr-2">🐾</span> Đến trang kết quả
                  </Button>
                </DialogFooter>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}

export default Navbar;
