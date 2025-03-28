/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { readFileAsDataURL } from "@/lib/utils";
import { Loader2, SmilePlus } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";
import { addPostsAPI } from "@/apis/post";
import EmojiPicker from "emoji-picker-react";
import { Button } from "@/components/ui/button";

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState([]);
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contentCheckResult, setContentCheckResult] = useState(null);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  const [emojiPicker, setOpenEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const textareaRef = useRef(null);

  const onEmojiClick = (emoji) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const cursorPosition = textarea.selectionStart;
      const textBefore = caption.substring(0, cursorPosition);
      const textAfter = caption.substring(cursorPosition);
      const newCaption = `${textBefore}${emoji.emoji}${textAfter}`;
      setCaption(newCaption);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd =
          cursorPosition + emoji.emoji.length;
        textarea.focus();
      }, 0);
    }
  };

  const fileChangeHandler = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setFile(files);
      const filePreviews = [];
      for (let i = 0; i < files.length; i++) {
        const dataUrl = await readFileAsDataURL(files[i]);
        filePreviews.push(dataUrl);
      }
      setImagePreview(filePreviews);
    }
  };

  const createPostHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("caption", caption);
    if (file && file.length > 0) {
      Array.from(file).forEach((fileItem) => {
        formData.append("media", fileItem);
      });
    }
    try {
      setLoading(true);
      const { data } = await addPostsAPI(formData);
      if (data.status === 201) {
        dispatch(setPosts([data.data, ...posts]));
        setCaption("");
        setImagePreview([]);
        toast.success(data.message);
        setOpen(false);
        setContentCheckResult(null);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      setContentCheckResult(error.response.data.reason);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setOpenEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="sm:max-w-md md:max-w-lg w-full mx-auto p-6 bg-white rounded-lg shadow-xl"
      >
        <DialogHeader className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Tạo bài viết mới
          </h2>
        </DialogHeader>

        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-10 h-10 border border-gray-200">
            <AvatarImage src={user?.profilePicture} alt="User"/>
            <AvatarFallback className="bg-gray-200 text-gray-600">
              {user?.username?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">
              {user?.username}
            </h3>
            <p className="text-xs text-gray-500">
              {user?.bio || "Không có tiểu sử"}
            </p>
          </div>
        </div>

        <div className="relative mb-4">
          <div
            className={`absolute z-10 transition-all duration-300 ease-in-out ${
              emojiPicker
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
            style={{ bottom: "100%", left: "0" }} // Position above textarea
            ref={emojiPickerRef}
          >
            <EmojiPicker open={emojiPicker} onEmojiClick={onEmojiClick} />
          </div>

          <div className="relative flex items-center gap-2 border border-gray-200 rounded-md shadow-sm bg-gray-50">
            <Textarea
              value={caption}
              ref={textareaRef}
              onChange={(e) => setCaption(e.target.value)}
              className="min-h-[80px] resize-none border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 text-gray-800"
              placeholder="Bạn đang nghĩ gì?"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 hover:bg-gray-200"
              onClick={() => setOpenEmojiPicker(!emojiPicker)}
            >
              <SmilePlus
                size={18}
                strokeWidth={1.5}
                className="text-gray-600"
              />
            </Button>
          </div>
        </div>

        {imagePreview.length > 0 && (
          <div className="mb-4 max-h-64 overflow-y-auto rounded-md border border-gray-200 p-2 bg-gray-50">
            <div className="flex flex-wrap gap-2">
              {imagePreview.map((preview, index) => (
                <div
                  key={index}
                  className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden shadow-sm"
                >
                  <img
                    src={preview}
                    alt={`preview_img_${index}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {contentCheckResult && (
          <div className="mb-4 text-red-500 text-sm">{contentCheckResult}</div>
        )}

        <input
          ref={imageRef}
          type="file"
          multiple
          className="hidden"
          onChange={fileChangeHandler}
        />

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => imageRef.current.click()}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md py-2 transition-colors"
          >
            Chọn ảnh từ máy tính
          </Button>

          <Button
            onClick={createPostHandler}
            disabled={loading || (!caption && imagePreview.length === 0)}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium rounded-md py-2 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang đăng...
              </>
            ) : (
              "Đăng bài"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
