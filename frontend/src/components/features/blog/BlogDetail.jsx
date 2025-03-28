import { getBlogByIdAPI } from "@/apis/blog";
import { calculateTimeAgo } from "@/utils/calculateTimeAgo";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VerifiedBadge from "../../core/VerifiedBadge";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

const sharedClasses = {
  textZinc: "text-zinc-",
  textPrimary: "text-primary",
  maxContainer: "max-w-5xl mx-auto p-4  mt-24",
  textSm: "text-sm",
  textLg: "text-lg",
  textXl: "text-xl",
  text2xl: "text-2xl",
  text3xl: "text-3xl",
  fontBold: "font-bold",
  fontSemibold: "font-semibold",
  roundedLg: "rounded-lg",
  wFull: "w-full",
  hAuto: "h-auto",
  mb2: "mb-2",
  mb4: "mb-4",
  textZinc400: "text-zinc-400",
  textZinc500: "text-zinc-500",
  textZinc700: "text-zinc-700",
};

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Kiểm tra location.state trước khi truy xuất blogId
  const blogId = location.state?.blogId || null;

  useEffect(() => {
    if (!blogId) {
      setLoading(false);
      return;
    }

    const fetchBlog = async () => {
      try {
        const res = await getBlogByIdAPI(blogId);
        if (res.data.success) {
          setBlog(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [blogId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!blogId) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Không tìm thấy bài viết!</p>
        <button
          onClick={() => navigate("/blog")}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
        >
          Quay lại danh sách blog
        </button>
      </div>
    );
  }

  if (!blog) {
    return <div className="text-center py-10">Blog not found</div>;
  }

  return (
    <div>
      <div className="sticky top-0 z-30 bg-white shadow-md">
        <Header />
      </div>
      <div className={sharedClasses.maxContainer}>
        {/* Header */}

        {/* Breadcrumb */}
        <div
          className={`${sharedClasses.textZinc500} ${sharedClasses.textSm} ${sharedClasses.mb2}`}
        >
          PET BLOG /{" "}
          <span className={sharedClasses.textPrimary}>{blog.category}</span>
        </div>

        {/* Author Info */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={blog.author.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-medium">{blog.author.username}</span>
              {blog.author.isVerified && <VerifiedBadge size={14} />}
            </div>
            <span
              className={`${sharedClasses.textZinc400} ${sharedClasses.textSm}`}
            >
              {calculateTimeAgo(blog.createdAt)}
            </span>
          </div>
        </div>

        {/* Title */}
        <h1
          className={`${sharedClasses.text3xl} ${sharedClasses.fontBold} ${sharedClasses.mb4}`}
        >
          {blog.title}
        </h1>

        {/* Main Image */}
        <img
          src={blog.thumbnail}
          alt={blog.title}
          className={`${sharedClasses.wFull} ${sharedClasses.hAuto} ${sharedClasses.roundedLg} ${sharedClasses.mb4}`}
        />

        {/* Content */}
        <div
          className={`${sharedClasses.textZinc700} space-y-4 mb-8 blog-content`}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

      </div>
      <Footer />
    </div>
  );
};

export default BlogDetail;
