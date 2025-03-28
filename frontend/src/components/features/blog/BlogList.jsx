import { getAllBlogsAPI } from "@/apis/blog";
import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import { Button, Card, Pagination, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const POST_CATEGORIES = [
  { name: "All Blogs", color: "bg-secondary text-secondary-foreground" },
  { name: "Dogs", color: "bg-blue-500 text-white" },
  { name: "Cats", color: "bg-green-500 text-white" },
];

const BlogList = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Blogs");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 7,
    totalPages: 1,
    totalResults: 0,
  });

  useEffect(() => {
    fetchBlogs();
  }, [selectedCategory, pagination.page]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        sortBy: "-createdAt",
        page: pagination.page,
        limit: pagination.limit,
        ...(selectedCategory !== "All Blog" ? { category: selectedCategory } : {}),
      };
      const res = await getAllBlogsAPI(params);
      if (res.data.success || res.data.status === 200) {
        setBlogs(res.data.data.results);
        setPagination({
          page: res.data.data.page,
          limit: res.data.data.limit,
          totalPages: res.data.data.totalPages,
          totalResults: res.data.data.totalResults,
        });
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Có lỗi xảy ra khi tải bài viết. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleOnClickDetails = (id, title) => {
    const slug = title.toLowerCase().replace(/\s+/g, "-");
    navigate(`/blog/${slug}`, {
      state: { blogId: id },
    });
  };

  return (
    <div className="container-fluid mx-auto min-h-screen">
      <div className="sticky top-0 z-30 bg-white shadow-md mb-4">
        <Header />
      </div>
      <div className="max-w-7xl mx-auto mt-24">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-center text-primary mb-2">
            PET BLOG
          </h1>
        </div>

        {/* Danh mục bài viết */}
        <div className="flex flex-wrap justify-left gap-4 mb-6">
          {POST_CATEGORIES.map((category) => (
            <Button
              key={category.name}
              type={selectedCategory === category.name ? "primary" : "default"}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : blogs.length > 0 ? (
          <>
            {/* Bài viết nổi bật */}
            {pagination.page === 1 && blogs.length > 0 && (
              <div className="relative w-full mb-10">
                <div
                  className="text-blue-300 font-semibold cursor-pointer"
                  onClick={() =>
                    handleOnClickDetails(blogs[0]._id, blogs[0].title)
                  }
                >
                  <Card
                    hoverable
                    className="h-full"
                    cover={
                      <img
                        alt={blogs[0].title}
                        src={blogs[0].thumbnail}
                        className="w-full h-[500px] object-cover"
                      />
                    }
                    bodyStyle={{ padding: 0 }}
                  >
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h2 className="text-3xl font-bold">{blogs[0].title}</h2>
                      <p
                        className="text-lg mt-2 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: blogs[0].content }}
                      ></p>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* Danh sách bài viết mới nhất */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4">
                NEWEST POSTS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogs
                  .slice(
                    pagination.page === 1 ? 1 : 0,
                    pagination.limit + (pagination.page === 1 ? 1 : 0)
                  )
                  .map((blog) => (
                    <Card
                      key={blog._id}
                      hoverable
                      cover={
                        <img
                          src={blog.thumbnail}
                          alt={blog.title}
                          className="w-full h-[250px] object-cover cursor-pointer"
                          onClick={() =>
                            handleOnClickDetails(blog._id, blog.title)
                          }
                        />
                      }
                    >
                      <div className="p-4">
                        <h3 className="text-xl font-semibold">{blog.title}</h3>
                        <p
                          className="text-gray-600 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: blog.content }}
                        ></p>
                        <Button
                          type="link"
                          onClick={() =>
                            handleOnClickDetails(blog._id, blog.title)
                          }
                          className="border border-blue-500 text-blue-500 px-4 py-1 rounded-md hover:bg-blue-500 hover:text-white transition-all duration-300 mt-4"
                          >
                          Read More
                        </Button>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-10">
            Không có bài viết nào trong danh mục này
          </div>
        )}

        {/* Phân trang */}
        <Pagination
          current={pagination.page}
          total={pagination.totalResults}
          pageSize={pagination.limit}
          onChange={(page) => setPagination((prev) => ({ ...prev, page }))}
          className="mt-6 flex justify-center mb-4"
        />
      </div>

      <Footer />
    </div>
  );
};

export default BlogList;
