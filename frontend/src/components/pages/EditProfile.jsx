import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";
import { editProfileAPI } from "@/apis/user";
import { Button } from "../ui/button";

const EditProfile = () => {
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    profilePicture: user?.profilePicture,
    username: user?.username,
    firstName: user?.firstName,
    lastName: user?.lastName,
    bio: user?.bio,
    gender: user?.gender,
  });
  const [preview, setPreview] = useState(user?.profilePicture || null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      setInput((prevInput) => ({
        ...prevInput,
        profilePicture: file,
      }));
    }
  };

  const selectChangeHandler = (value) => {
    setInput((prevInput) => ({ ...prevInput, gender: value }));
  };

  const createFormData = () => {
    const formData = new FormData();
    formData.append("username", input.username);
    formData.append("firstName", input.firstName);
    formData.append("lastName", input.lastName);
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    if (input.profilePicture) {
      formData.append("profilePicture", input.profilePicture);
      return formData;
    }
  };

  const editProfileHandler = async () => {
    const formData = createFormData();
    try {
      setLoading(true);
      const { data } = await editProfileAPI(formData);
      if (data.status === 200) {
        const updatedUserData = {
          ...user,
          username: data.data?.username,
          firstName: data.data?.firstName,
          lastName: data.data?.lastName,
          bio: data.data?.bio,
          profilePicture: data.data?.profilePicture,
          gender: data.data.gender,
        };
        dispatch(setAuthUser(updatedUserData));
        navigate(`/profile/${data.data?.username}`);
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const resetFileInput = () => {
    if (imageRef.current) {
      imageRef.current.value = "";
    }
    imageRef.current?.click();
  };

  return (
    <div className="flex max-w-2xl mx-auto">
      <section className="flex flex-col gap-6 w-full my-8">
        <h1 className="font-bold text-xl">Chỉnh sửa trang cá nhân</h1>
        <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={preview} alt="post_image" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold text-sm">{user?.username}</h1>
              <span className="text-gray-600">
                {user?.bio || "Bio here..."}
              </span>
            </div>
          </div>
          <input
            ref={imageRef}
            onChange={fileChangeHandler}
            type="file"
            className="hidden"
          />
          <Button
            onClick={resetFileInput}
            className="bg-[#0095F6] h-8 hover:bg-[#318bc7]"
          >
            Đổi ảnh
          </Button>
        </div>
        <div>
          <h1 className="font-bold mb-2">Tên người dùng</h1>
          <input
            type="text"
            value={input.username}
            onChange={(e) => setInput({ ...input, username: e.target.value })}
            name="username"
            disabled
            className="w-full rounded-md border border-input px-3 py-2 text-sm focus-visible:outline-none"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <h1 className="font-bold mb-2">Tên</h1>
            <input
              type="text"
              value={input.firstName}
              onChange={(e) =>
                setInput({ ...input, firstName: e.target.value })
              }
              name="firstName"
              className="w-full rounded-md border border-input px-3 py-2 text-sm focus-visible:outline-none"
            />
          </div>
          <div className="flex-1">
            <h1 className="font-bold mb-2">Họ</h1>
            <input
              type="text"
              value={input.lastName}
              onChange={(e) => setInput({ ...input, lastName: e.target.value })}
              name="lastName"
              className="w-full rounded-md border border-input px-3 py-2 text-sm focus-visible:outline-none"
            />
          </div>
        </div>
        <div>
          <h1 className="font-bold mb-2">Tiểu sử</h1>
          <Textarea
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            name="bio"
            className="focus-visible:ring-transparent"
          />
        </div>
        <div>
          <h1 className="font-bold mb-2">Giới tính</h1>
          <Select
            defaultValue={input.gender}
            onValueChange={selectChangeHandler}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
          {loading ? (
            <Button className="w-fit bg-[#0095F6] hover:bg-[#2a8ccd]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              onClick={editProfileHandler}
              className="w-fit bg-[#0095F6] hover:bg-[#2a8ccd]"
            >
              Submit
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
