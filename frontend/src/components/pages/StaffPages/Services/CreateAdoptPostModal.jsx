/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { readFileAsDataURL } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";
import { addAdoptPostsAPI } from "@/apis/post"; // Assuming this is correctly defined
import EmojiPicker from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { MdDelete } from "react-icons/md";
import { PawPrint } from "lucide-react";

const CreateAdoptPostModal = ({ open, setOpen, pet, onPostCreated }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);

  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojiPickerRef = useRef(null);
  const imageInputRef = useRef(null);
  const captionRef = useRef(null);

  // Validation schema
  const validationSchema = Yup.object().shape({
    caption: Yup.string().required("Caption is required"),
    location: Yup.string().required("Please select a location"),
  });

  // Initialize image previews from pet data
  // useEffect(() => {
  //   if (pet?.image_url) {
  //     setImagePreviews([...pet.image_url]);
  //   }
  // }, [pet]);

  // Handle file selection
  const handleFileChange = async (event, setFieldValue) => {
    const files = Array.from(event.target.files);
    if (files.length) {
      const previews = await Promise.all(
        files.map((file) => readFileAsDataURL(file))
      );
      setImagePreviews((prev) => [...prev, ...previews]);
      setFieldValue("image_url", files);
    }
  };

  // Remove an image from preview
  const removeImage = (index, setFieldValue) => {
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);
    setFieldValue("image_url", updatedPreviews);
  };

  // Add emoji to caption
  const handleEmojiClick = (emoji, setFieldValue, values, ) => {
    const textarea = captionRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const newCaption =
      values.caption.slice(0, cursorPos) +
      emoji.emoji +
      values.caption.slice(cursorPos);
    setFieldValue("caption", newCaption);

    // Move cursor after the emoji
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd =
        cursorPos + emoji.emoji.length;
      textarea.focus();
    }, 0);
  };

  // Handle form submission
  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();
    formData.append("caption", values.caption);
    formData.append("location", values.location);
    formData.append("petId", pet._id);

    if (values.image_url?.length) {
      values.image_url.forEach((file) => formData.append("media", file));
    }

    try {
      setLoading(true);
      const { data } = await addAdoptPostsAPI(formData);
      console.log(data);
      if (data.status === 201) {
        dispatch(setPosts([data.data, ...posts]));
        resetForm();
        setImagePreviews([]);
        console.log("data", data);
        toast.success(data.message);
        setOpen(false);
        onPostCreated();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating post!");
    } finally {
      setLoading(false);
    }
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-xl">
        <DialogHeader className="border-b pb-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-50 rounded-full">
              <PawPrint className="w-6 h-6 text-pink-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-amber-800 mb-1">
                Tạo bài đăng nhận nuôi mới
              </h2>
            </div>
          </div>
        </DialogHeader>

        <div className="flex items-center gap-3 mb-4 p-3 bg-pink-50/50 rounded-lg border border-pink-100">
          <Avatar className="border-2 border-pink-200">
            <AvatarImage src={user?.profilePicture} alt="Profile" />
            <AvatarFallback className="bg-pink-100 text-pink-700">{user?.username?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-sm text-gray-800">{user?.username}</h1>
            <span className="text-gray-600 text-xs">{user?.bio}</span>
          </div>
        </div>

        <Formik
          initialValues={{ caption: "", location: "", image_url: [] }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form className="space-y-4">
              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute top-1/2 right-0 z-10"
                >
                  <EmojiPicker
                    onEmojiClick={(emoji) =>
                      handleEmojiClick(emoji, setFieldValue, values)
                    }
                  />
                </div>
              )}

              {/* Caption */}
              <div className="relative">
                <Field
                  as="textarea"
                  name="caption"
                  innerRef={captionRef}
                  placeholder="Viết nội dung bài đăng..."
                  className="w-full p-2 border border-pink-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/50"
                  rows={3}
                />
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute bottom-2 right-2 text-2xl hover:bg-pink-100 rounded-full p-1"
                >
                  😊
                </button>
                <ErrorMessage
                  name="caption"
                  component="p"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Location */}
              <div>
                <Field
                  as="select"
                  name="location"
                  className="w-full p-2 border border-pink-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/50"
                >
                  <option value="">Chọn cơ sở tiếp nhận</option>
                  <option value="Cơ sở Hà Nội">Cơ sở Hà Nội</option>
                  <option value="Cơ sở Đà Nẵng">Cơ sở Đà Nẵng</option>
                  <option value="Cơ sở Quy Nhơn">Cơ sở Quy Nhơn</option>
                  <option value="Cơ sở Hồ Chí Minh">Cơ sở Hồ Chí Minh</option>
                </Field>
                <ErrorMessage
                  name="location"
                  component="p"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Image Upload */}
              <input
                ref={imageInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFileChange(e, setFieldValue)}
              />
              <Button
                type="button"
                onClick={() => imageInputRef.current.click()}
                className="w-full bg-pink-100 hover:bg-pink-200 text-pink-700 font-medium"
              >
                Thêm hình ảnh
              </Button>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 p-3 bg-pink-50/50 rounded-lg border border-pink-100">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <motion.img
                        src={preview}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-md border border-pink-200"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, setFieldValue)}
                        className="absolute top-1 right-1 bg-pink-600 text-white rounded-full p-1 hover:bg-pink-700"
                      >
                        <MdDelete size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4 border-t border-pink-100">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                >
                  {loading ? "Đang đăng..." : "Đăng bài"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAdoptPostModal;
