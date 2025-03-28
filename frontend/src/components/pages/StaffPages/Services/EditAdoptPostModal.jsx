/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, PawPrint } from "lucide-react";
import { toast } from "sonner";
import { readFileAsDataURL } from "@/lib/utils";
import { MdDelete } from "react-icons/md";
import { updateAdoptPostsAPI } from "@/apis/post";

const EditAdoptPostModal = ({ open, setOpen, post, onUpdate }) => {
  const [caption, setCaption] = useState(post?.caption || "");
  const [imagePreview, setImagePreview] = useState(post?.image || []);
  const [newFiles, setNewFiles] = useState([]);
  const [location, setLocation] = useState(post?.location || "");
  const [adoptStatus, setAdoptStatus] = useState(
    post?.adopt_status || "Available"
  );
  const [loading, setLoading] = useState(false);
  const imageRef = useRef();

  const fileChangeHandler = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setNewFiles((prev) => [...prev, ...files]);
      const filePreviews = await Promise.all(
        files.map((file) => readFileAsDataURL(file))
      );
      setImagePreview((prev) => [...prev, ...filePreviews]);
    }
  };

  const removeImage = (index) => {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
    setNewFiles((prev) =>
      prev.filter((_, i) => i !== index - (post?.image?.length || 0))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("location", location);
    formData.append("adopt_status", adoptStatus);
    formData.append("postId", post._id);

    const existingImages = imagePreview.filter(
      (img) => typeof img === "string"
    );
    if (existingImages.length) {
      formData.append("existingImages", JSON.stringify(existingImages));
    }

    if (newFiles.length) {
      newFiles.forEach((file) => formData.append("media", file));
    }

    try {
      setLoading(true);
      const response = await updateAdoptPostsAPI(post._id, formData);
      const data = response.data;
      if (data.status === 200) {
        onUpdate();
        toast.success("Cập nhật bài đăng thành công!");
        setOpen(false);
      } else {
        throw new Error(data.message || "Failed to update post");
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi cập nhật bài đăng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md md:max-w-lg w-full mx-auto p-6 bg-white rounded-lg shadow-xl">
        <DialogHeader className="border-b pb-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-50 rounded-full">
              <PawPrint className="w-6 h-6 text-pink-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-amber-800 mb-1">
                Chỉnh sửa bài đăng nhận nuôi
              </h2>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Caption */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nội dung
            </label>
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="min-h-[80px] resize-none border-pink-200 bg-pink-50/50 focus-visible:ring-pink-400 focus-visible:ring-offset-0 placeholder:text-gray-400 text-gray-800"
              placeholder="Viết nội dung..."
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Khu vực
            </label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-full border-pink-200 bg-pink-50/50 focus:ring-pink-400">
                <SelectValue placeholder="Chọn khu vực" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-pink-100">
                <SelectItem value="Cơ sở Hà Nội">Cơ sở Hà Nội</SelectItem>
                <SelectItem value="Cơ sở Đà Nẵng">Cơ sở Đà Nẵng</SelectItem>
                <SelectItem value="Cơ sở Quy Nhơn">Cơ sở Quy Nhơn</SelectItem>
                <SelectItem value="Cơ sở Hồ Chí Minh">
                  Cơ sở Hồ Chí Minh
                </SelectItem>
                <SelectItem value="Thanh Pho Ho Chi Minh">
                  Thành Phố Hồ Chí Minh
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Adopt Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tình trạng nhận nuôi
            </label>
            <Select value={adoptStatus} onValueChange={setAdoptStatus}>
              <SelectTrigger className="w-full border-pink-200 bg-pink-50/50 focus:ring-pink-400">
                <SelectValue placeholder="Chọn tình trạng" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-pink-100">
                <SelectItem value="Available">Chưa được nhận nuôi</SelectItem>
                <SelectItem value="Pending">
                  Đã được liên hệ nhận nuôi
                </SelectItem>
                <SelectItem value="Adopted">Đã được nhận nuôi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Image Previews */}
          {imagePreview.length > 0 && (
            <div className="max-h-64 overflow-y-auto rounded-md border border-pink-200 p-2 bg-pink-50/50">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh
              </label>
              <div className="flex flex-wrap gap-2">
                {imagePreview.map((preview, index) => (
                  <div
                    key={index}
                    className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden shadow-sm border border-pink-100"
                  >
                    <img
                      src={preview}
                      alt={`preview_${index}`}
                      className="object-cover w-full h-full"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full bg-pink-600 hover:bg-pink-700"
                      onClick={() => removeImage(index)}
                    >
                      <MdDelete size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Input */}
          <input
            ref={imageRef}
            type="file"
            multiple
            className="hidden"
            onChange={fileChangeHandler}
          />

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-4 border-t border-pink-100">
            <Button
              type="button"
              onClick={() => imageRef.current.click()}
              className="w-full bg-pink-100 hover:bg-pink-200 text-pink-700 font-medium rounded-md py-2"
            >
              Thêm ảnh mới
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-md py-2 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                "Cập nhật bài đăng"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAdoptPostModal;
