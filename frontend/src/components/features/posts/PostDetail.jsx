/* eslint-disable react/prop-types */
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { getPostById } from "@/apis/post";
import VerifiedBadge from "@/components/core/VerifiedBadge";
import { calculateTimeAgo } from "@/utils/calculateTimeAgo";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState({});

  useEffect(() => {
    const getPost = async () => {
      const { data } = await getPostById(id);
      if (data.status === 200) {
        setPost(data.data);
      }
    };
    getPost();
  }, [id]);

  return (
    <div className="my-8 w-full max-w-[850px] ml-[15%] border">
      <div className="flex h-[600px] bg-white">
        {/* Left side - Image */}
        <div className="w-[60%] bg-black ">
          <img
            src={post?.image}
            alt="Post"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right side - Details */}
        <div className="w-[40%] flex flex-col border-l">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Avatar
                className="w-8 h-8"
                style={{ border: "1px solid #e0e0e0" }}
              >
                <AvatarImage
                  src={post.author?.profilePicture}
                  alt="post_image"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {post.author?.username}
                </span>
                {post.author?.isVerified && <VerifiedBadge size={14} />}
              </div>
            </div>
            <button className="text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
            </button>
          </div>

          {/* Comments section */}
          <div className="flex-grow overflow-y-auto p-4">
            {/* Caption */}
            <div className="flex items-center gap-2">
              <Avatar
                className="w-8 h-8"
                style={{ border: "1px solid #e0e0e0" }}
              >
                <AvatarImage
                  src={post.author?.profilePicture}
                  alt="post_image"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {post.author?.username}
                </span>
                {post.author?.isVerified && <VerifiedBadge size={14} />}
              </div>
              <span className="text-sm text-gray-500">
                {calculateTimeAgo(post.createdAt)}
              </span>
              <div className="text-sm">{post.caption}</div>
            </div>

            {/* Comments */}
            <div className="text-center text-sm py-4">
              <p className="font-semibold">Chưa có bình luận nào.</p>
              <p className="text-gray-500">Bắt đầu trò chuyện.</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="border-t p-4">
            <div className="flex justify-between mb-4">
              <div className="flex space-x-4">
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                </button>
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                    />
                  </svg>
                </button>
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                    />
                  </svg>
                </button>
              </div>
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                  />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Avatar
                  className="w-5 h-5"
                  style={{ border: "1px solid #e0e0e0" }}
                >
                  <AvatarImage
                    src={post?.likes?.[0]?.profilePicture}
                    alt="post_image"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="text-sm ml-2 font-semibold">
                  {post?.likes?.length || 5} lượt thích
                </span>
              </div>
              <div className="text-xs text-gray-500">19 Tháng 2 2024</div>
            </div>

            {/* Comment input */}
            <div className="flex items-center border-t pt-4">
              <button className="mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                  />
                </svg>
              </button>
              <input
                type="text"
                placeholder="Bình luận..."
                className="flex-grow text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
