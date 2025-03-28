import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Bird, Cat, Dog, Loader2, PawPrint, PawPrintIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { loginAPI } from "@/apis/auth";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await loginAPI(input);

      if (res.status === 200) {
        const { access_token, refresh_token, user } = res.data.data;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        dispatch(setAuthUser(user));
        navigate("/");
        toast.success(res.data.message);
        setInput({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const access_token = localStorage.getItem("access_token");

      if (!access_token) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
      } else {
        navigate("/");
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="flex items-center w-screen h-screen justify-center bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-pink-100 rounded-full opacity-20"></div>
        <div className="absolute left-1/4 top-1/3 w-32 h-32 bg-yellow-100 rounded-full opacity-40"></div>
        <div className="absolute right-1/3 bottom-1/4 w-48 h-48 bg-blue-100 rounded-full opacity-30"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <form
          onSubmit={loginHandler}
          className="bg-white shadow-xl rounded-xl flex flex-col gap-5 p-8 mx-4 border border-gray-100"
        >
          <div className="my-4 flex flex-col items-center">
            <Link to="/" className="mb-4 transition-transform hover:scale-105">
              <div className="relative">
                <img
                  src="/assets/images/logo.png"
                  width={200}
                  alt="PetPals Logo"
                  className="mb-2"
                />
                <PawPrint className="absolute -right-4 -top-4 text-pink-400 w-8 h-8 transform rotate-12" />
              </div>
            </Link>
            <p className="text-sm text-center text-gray-600">
              Login to see pawsome photos & videos of your furry friends
            </p>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg mb-2">
            <div className="space-y-4">
              <div>
                <label className="font-medium text-gray-700 flex items-center gap-2">
                  <span>Email</span>
                </label>
                <Input
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  placeholder="your.email@example.com"
                  className="focus-visible:ring-transparent focus:border-blue-400 my-2 bg-white"
                />
              </div>
              <div>
                <label className="font-medium text-gray-700">Password</label>
                <Input
                  type="password"
                  name="password"
                  value={input.password}
                  onChange={changeEventHandler}
                  placeholder="••••••••"
                  className="focus-visible:ring-transparent focus:border-blue-400 my-2 bg-white"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2"
            >
              <PawPrintIcon className="mr-2 h-4 w-4" />
              Login
            </Button>
          )}

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-gray-200 w-full"></div>
            <div className="bg-white px-3 text-sm text-gray-500 absolute">
              or
            </div>
          </div>

          <Link to="/forum">
            <Button
              variant="outline"
              className="border border-gray-200 text-gray-700 hover:bg-gray-50 w-full"
            >
              Continue as Guest
            </Button>
          </Link>

          <span className="text-center text-gray-600 mt-4">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign up
            </Link>
          </span>

          <div className="flex justify-center gap-4 mt-6">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Cat />
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Dog />
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Bird />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
