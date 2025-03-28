import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAdoptionPostById, getUserBehaviorAPI } from "@/apis/post";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { PawPrint, MapPin, HandHeart, Send, Dog } from "lucide-react";
import ShareButton from "./ShareButton";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { getBreedsByIdAPI } from "@/apis/pet";

const AdoptionDetail = () => {
  const { user } = useSelector((store) => store.auth);
  const { id } = useParams();
  const navigate = useNavigate(); // Thêm useNavigate để điều hướng
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const userRole = user?.role;
  const [error, setError] = useState(null);
  const [breed, setBreed] = useState(null);

  useEffect(() => {
    const fetchPostAndBreed = async () => {
      try {
        setLoading(true);
        const res = await getAdoptionPostById(id);
        setPost(res.data.data);

        // Chỉ gọi getBreedById khi có post.pet.breed
        if (res.data.data?.pet?.breed) {
          try {
            const breedRes = await getBreedsByIdAPI(res.data.data.pet.breed);
            setBreed(breedRes.data.data);
          } catch (error) {
            console.error("Lỗi tải giống:", error);
          }
        }
      } catch (error) {
        setError("Không thể tải bài viết. Vui lòng thử lại sau.");
        console.error("Lỗi tải bài viết:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndBreed();
  }, [id]);

  useEffect(() => {
    const fetchUserBehavior = async () => {
      try {
        const res = await getUserBehaviorAPI();
        console.log(res);
      } catch (error) {
        console.error("Error fetching user behavior:", error);
      }
    };
    fetchUserBehavior();
  }, []);

  const handleClose = () => {
    navigate("/adopt"); // Quay lại trang tổng hợp khi nhấp nút "X"
  };

  const renderActionButton = (post) => {
    if (userRole === "services_staff") {
      return (
        <Button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={() => navigate("/staff-services/manageAdoptionPost")}
        >
          Quản lý bài đăng
        </Button>
      );
    } else if (userRole === "user") {
      return (
        <Button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          onClick={() =>
            navigate(`/chat/${post.author?.id}`, {
              state: {
                fromPost: true,
                postId: post._id,
                postTitle: post.caption,
                petName: post.pet?.name,
                location: post.location,
              },
            })
          }
        >
          <div className="flex items-center gap-2">
            <Send className="cursor-pointer hover:text-gray-600" size={16} />
            <span>Liên hệ tư vấn</span>
          </div>
        </Button>
      );
    }
    return null;
  };

  if (loading) return <p className="text-center">Đang tải...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full relative">
        {/* Nút "X" để đóng */}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl"
          onClick={handleClose}
        >
          &times;
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Hình ảnh/video bên trái */}
          <div className="lg:w-1/2 w-full">
            {post?.image?.length > 0 && (
              <img
                src={post?.image[0]}
                alt="Post"
                className="w-full rounded-lg object-cover max-h-[500px]"
              />
            )}
          </div>

          {/* Thông tin bài viết bên phải */}
          <div className="lg:w-1/2 w-full">
            {/* Thông tin người đăng */}
            <div className="flex items-center gap-3 border-b pb-4 mb-4">
              <img
                src={post?.author?.profilePicture}
                alt="Author"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold">{post?.author?.username}</h3>
                <p className="text-gray-500 text-sm">{post?.location}</p>
              </div>
            </div>

            {/* Nội dung bài viết */}
            <h1 className="text-xl font-bold mb-2">{post?.caption}</h1>
            <div className="text-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Dog className="text-[#D64BA0]" />
                <span className="font-medium">Tên: {post?.pet?.name}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <PawPrint className="text-orange-600" />
                <span className="font-medium">Giống: {breed?.name}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="text-blue-600" />
                <span className="font-medium">Vị trí: {post?.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <HandHeart className="text-green-600" />
                <span className="font-medium">
                  Tình trạng:{" "}
                  {post?.adopt_status === "Available"
                    ? "Chưa được nhận nuôi"
                    : post?.adopt_status === "Adopted"
                    ? "Đã được nhận nuôi"
                    : post?.adopt_status === "Pending"
                    ? "Đã được liên hệ nhận nuôi"
                    : "Không xác định"}
                </span>
              </div>
            </div>

            {/* Nút like, share, liên hệ */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-4">
                {liked ? (
                  <FaHeart
                    className="text-red-500 cursor-pointer"
                    size={24}
                    onClick={() => setLiked(false)}
                  />
                ) : (
                  <FaRegHeart
                    className="cursor-pointer hover:text-gray-600"
                    size={24}
                    onClick={() => setLiked(true)}
                  />
                )}
                <ShareButton post={post} />
              </div>

              {renderActionButton(post)}
            </div>

            {/* Số lượt thích */}
            <p className="mt-2 text-gray-600">
              {post?.likes?.length} lượt thích
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdoptionDetail;
