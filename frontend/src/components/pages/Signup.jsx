import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import {
  Loader2,
  PawPrint,
  Cat,
  Dog,
  Bird,
  PawPrintIcon,
} from "lucide-react";
import { useSelector } from "react-redux";
import { signupAPI } from "@/apis/auth";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await signupAPI(input);
      if (data.status === 201) {
        navigate("/login");
        toast.success(data.message);
        setInput({
          username: "",
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
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div className="flex items-center w-screen h-screen justify-center bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-16 -top-16 w-64 h-64 bg-pink-100 rounded-full opacity-20"></div>
        <div className="absolute right-1/4 top-1/3 w-32 h-32 bg-yellow-100 rounded-full opacity-40"></div>
        <div className="absolute left-1/3 bottom-1/4 w-48 h-48 bg-blue-100 rounded-full opacity-30"></div>
        <div className="absolute right-20 bottom-20 w-24 h-24 bg-green-100 rounded-full opacity-40"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <form
          onSubmit={signupHandler}
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
              Sign up to share adorable moments of your furry companions
            </p>
          </div>

          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg mb-2">
            <div className="space-y-4">
              <div>
                <label className="font-medium text-gray-700 flex items-center gap-2">
                  <span>Username</span>
                  <PawPrint className="w-3 h-3 text-pink-400" />
                </label>
                <Input
                  type="text"
                  name="username"
                  value={input.username}
                  onChange={changeEventHandler}
                  placeholder="Choose a unique username"
                  className="focus-visible:ring-transparent focus:border-purple-400 my-2 bg-white"
                />
              </div>
              <div>
                <label className="font-medium text-gray-700 flex items-center gap-2">
                  <span>Email</span>
                  <PawPrintIcon className="w-3 h-3 text-pink-400" />
                </label>
                <Input
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  placeholder="your.email@example.com"
                  className="focus-visible:ring-transparent focus:border-purple-400 my-2 bg-white"
                />
              </div>
              <div>
                <label className="font-medium text-gray-700 flex items-center gap-2">
                  <span>Password</span>
                  <PawPrint className="w-3 h-3 text-pink-400" />
                </label>
                <Input
                  type="password"
                  name="password"
                  value={input.password}
                  onChange={changeEventHandler}
                  placeholder="Create a secure password"
                  className="focus-visible:ring-transparent focus:border-purple-400 my-2 bg-white"
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center px-2">
            By signing up, you agree to our Terms, Privacy Policy and Cookies
            Policy
          </p>

          {loading ? (
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2"
            >
              <PawPrint className="mr-2 h-4 w-4" />
              Create Account
            </Button>
          )}

          <span className="text-center text-gray-600 mt-2">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-600 font-medium hover:underline"
            >
              Login
            </Link>
          </span>

          <div className="flex flex-col items-center mt-6">
            <p className="text-sm text-gray-500 mb-3">Popular pet categories</p>
            <div className="flex justify-center gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mb-1">
                  <Dog />
                </div>
                <span className="text-xs text-gray-600">Dogs</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                  <Cat />
                </div>
                <span className="text-xs text-gray-600">Cats</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-1">
                  <Bird />
                </div>
                <span className="text-xs text-gray-600">Birds</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
