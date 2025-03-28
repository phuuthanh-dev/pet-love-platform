import { Outlet, useLocation } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";
import Chatbox from "../features/chatbox/ChatBox";

const MainLayout = () => {
  const location = useLocation();
  const isRootRoute = location.pathname === "/";
  const isBlogRoute = location.pathname.includes("/blog");

  return (
    <div className="min-h-screen">
      {!isRootRoute && !isBlogRoute && (
        <div className="grid grid-cols-[auto,1fr]">
          <LeftSidebar />
          <main className="min-h-screen w-full">
            <Outlet />
          </main>
        </div>
      )}
      {(isRootRoute || isBlogRoute) && (
        <main className="min-h-screen w-full">
          <Outlet />
        </main>
      )}
      <div className="fixed bottom-3 right-2 z-50">
        <Chatbox />
      </div>
    </div>
  );
};

export default MainLayout;
