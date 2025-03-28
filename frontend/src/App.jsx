import ChatPage from "./components/pages/ChatPage";
import EditProfile from "./components/pages/EditProfile";
import Profile from "./components/pages/Profile/Profile";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoutes from "./components/routing/ProtectedRoutes";
import "./App.css";
import DonateCancel from "./components/features/donate/DonateCancel";
import LoadingSpinner from "./components/core/LoadingSpinner";
import MainLayout from "./components/layouts/MainLayout";
import LandingPage from "./components/pages/LandingPage";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import Home from "./components/pages/Home";
import { SocketProvider } from "./contexts/SocketProvider";
import PostDetail from "./components/features/posts/PostDetail";
import BlogList from "./components/features/blog/BlogList";
import BlogDetail from "./components/features/blog/BlogDetail";
import BlogCreate from "./components/features/blog/BlogCreate";
import BlogEdit from "./components/features/blog/BlogEdit";
import Dashboard from "./components/pages/AdminPages/Dashboard";
import AdminLayout from "./components/layouts/AdminLayout";
import User from "./components/pages/AdminPages/User";
import Donate from "./components/pages/ManagerPages/Donate";
import ManageStaff from "./components/pages/AdminPages/ManageStaff";
import { SubmitPet } from "./components/submitPet";
import { ApprovePet, ManagePet } from "./components/pages/StaffPages";
import StaffSideBarLayout from "./components/layouts/StaffSideBarLayout";
import ManageAdoptionPost from "./components/pages/StaffPages/Services/ManageAdoptionPost";
import ManageAdoptionForms from "./components/pages/StaffPages/Services/ManageAdoptionForms";
import ManageCampaign from "./components/pages/ManagerPages/ManageCampaign";
import ManagePost from "./components/pages/StaffPages/Forum/ManagePost";
import ManageBlog from "@/components/pages/StaffPages/Services/ManageBlog";
import CampaignDetail from "./components/features/donate/CampaignDetail";
import Campaigns from "./pages/Campaigns";
import AdoptionDetail from "./components/features/adoptions/AdoptionDetail";
import { useEffect } from "react";
import { getClientSettingAPI } from "./apis/clientSetting";
import { useDispatch } from "react-redux";
import { setClientSetting } from "./redux/settingSlice";
import ManageSetting from "./components/pages/AdminPages/ManageSetting";
import ManagerLayout from "./components/layouts/ManagerLayout";
import PetList from "./components/pages/PetList";
import ApproveExpense from "./components/pages/ManagerPages/ApproveExpense";
import ManageExpenses from "./components/pages/StaffPages/Services/ManageExpenses";
import ManageExpense from "./components/pages/ManagerPages/ManageExpense";
import ManagePetDonations from "./components/pages/ManagerPages/ManagePetDonations";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/campaigns",
        element: <Campaigns />,
      },
      {
        path: "/adopt",
        element: <Home />,
      },
      {
        path: "/forum",
        element: <Home />,
      },
      {
        path: "/pets",
        element: <PetList />,
      },
      {
        path: "/profile/:username",
        element: <Profile />,
      },
      {
        path: "/blog",
        element: <BlogList />,
      },
      {
        path: "/blog/:id",
        element: <BlogDetail />,
      },
      {
        path: "/donate/:id",
        element: <CampaignDetail />,
      },
      {
        path: "/adoptDetail/:id",
        element: (
          <ProtectedRoutes>
            <AdoptionDetail />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/adopt/:id",
        element: (
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/p/:id",
        element: (
          <ProtectedRoutes>
            <PostDetail />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/account/edit",
        element: (
          <ProtectedRoutes>
            <EditProfile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/chat",
        element: (
          <ProtectedRoutes>
            <ChatPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/chat/:id",
        element: (
          <ProtectedRoutes>
            <ChatPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/donate/cancel",
        element: (
          <ProtectedRoutes>
            <DonateCancel>
              <Home />
            </DonateCancel>
          </ProtectedRoutes>
        ),
      },
      {
        path: "/donate/pet/cancel",
        element: (
          <ProtectedRoutes>
            <DonateCancel>
              <PetList />
            </DonateCancel>
          </ProtectedRoutes>
        ),
      },
      {
        path: "/blog/create",
        element: (
          <ProtectedRoutes>
            <BlogCreate />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/blog/:id/edit",
        element: (
          <ProtectedRoutes>
            <BlogEdit />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/submitPet",
        element: (
          <ProtectedRoutes>
            <SubmitPet />
          </ProtectedRoutes>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoutes allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <User />,
      },
      {
        path: "staff",
        element: <ManageStaff />,
      },
      {
        path: "client-setting",
        element: <ManageSetting />,
      },
    ],
  },
  {
    path: "/manager",
    element: (
      <ProtectedRoutes allowedRoles={["manager"]}>
        <ManagerLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "donate",
        element: <Donate />,
      },
      {
        path: "campaign",
        element: <ManageCampaign />,
      },
      {
        path: "/manager/approve-expense",
        element: <ApproveExpense />,
      },
      {
        path: "/manager/expense",
        element: <ManageExpense />,
      },
      {
        path: "/manager/pets-donation",
        element: <ManagePetDonations />,
      },
    ],
  },
  {
    path: "/staff-forum",
    element: (
      <ProtectedRoutes allowedRoles={["forum_staff"]}>
        <StaffSideBarLayout>
          <ManageStaff />
        </StaffSideBarLayout>
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "managePost",
        element: <ManagePost />,
      },
      {
        path: "manageBlog",
        element: <ManageBlog />,
      },
      {
        path: "approvePost",
        element: <ApprovePet />,
      },
    ],
  },
  {
    path: "/staff-services",
    element: (
      <ProtectedRoutes allowedRoles={["services_staff"]}>
        <StaffSideBarLayout>
          <ManageStaff />
        </StaffSideBarLayout>
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "approvePet",
        element: <ApprovePet />,
      },
      {
        path: "managePet",
        element: <ManagePet />,
      },
      {
        path: "manageAdoptionPost",
        element: <ManageAdoptionPost />,
      },
      {
        path: "manageSendPets",
        element: <ManageAdoptionForms />,
      },
      {
        path: "manageAdoptionForms",
        element: <ManageAdoptionForms />,
      },
      {
        path: "manageExpenses",
        element: <ManageExpenses />,
      },
    ],
  },
]);

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchClientSetting = async () => {
      const { data } = await getClientSettingAPI();
      dispatch(setClientSetting(data));
    };
    fetchClientSetting();
  }, []);
  return (
    <SocketProvider>
      <LoadingSpinner />
      <RouterProvider router={browserRouter} />
    </SocketProvider>
  );
}

export default App;
