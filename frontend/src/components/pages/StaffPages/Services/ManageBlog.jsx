import { deleteBlogAPI, getAllBlogsAPI } from "@/apis/blog";
import { Button, Input, Pagination, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import BlogCreate from "@/components/features/blog/BlogCreate";
import { useNavigate } from "react-router-dom";

const { Search } = Input;
const { Option } = Select;

const POST_CATEGORIES = [
    { name: "All Blog", value: "All Blog" },
    { name: "Dogs", value: "Dogs" },
    { name: "Cats", value: "Cats" },
];

const ManageBlog = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All Blog");
    const [loading, setLoading] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("");

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 6,
        totalPages: 1,
        totalResults: 0,
    });

    useEffect(() => {
        fetchBlogs();
    }, [selectedCategory, pagination.page, searchQuery, sortOrder]);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            setError(null);
            const params = {
                sortBy: sortOrder === "newest" ? "-createdAt" : sortOrder === "oldest" ? "createdAt" : "-createdAt",
                page: pagination.page,
                limit: pagination.limit,
                ...(selectedCategory !== "All Posts" ? { category: selectedCategory } : {}),
                ...(searchQuery ? { q: searchQuery } : {}),
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

    const handleUpdate = (blogId) => {
        navigate(`/blog/${blogId}/edit`);
    };

    const handleDelete = async (blogId) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await deleteBlogAPI(blogId);
                fetchBlogs();
            } catch (error) {
                console.error("Error deleting blog:", error);
            }
        }
    };

    const handleSearch = (value) => {
        setSearchQuery(value);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleSort = (value) => {
        setSortOrder(value);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Blog</h1>
                <div className="flex gap-4">
                    <Search
                        placeholder="Search by title or content..."
                        onSearch={handleSearch}
                        className="w-72"
                        allowClear
                    />
                    <Select
                        defaultValue=""
                        onChange={handleSort}
                        className="w-52"
                        placeholder="Sort by"
                    >
                        <Option value="">All</Option>
                        <Option value="newest">Newest</Option>
                        <Option value="oldest">Oldest</Option>
                    </Select>
                    <Button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => setOpenCreate(true)}
                    >
                        Create New Blog
                    </Button>
                </div>
            </div>

            <div className="flex gap-4 mb-6">
                {POST_CATEGORIES.map((category) => (
                    <Button
                        key={category.value}
                        className={`px-4 py-2 rounded transition ${selectedCategory === category.value
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        onClick={() => setSelectedCategory(category.value)}
                    >
                        {category.name}
                    </Button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Spin size="large" />
                </div>
            ) : (
                <div className="overflow-x-auto bg-white p-4 shadow-md rounded-lg">
                    <table className="min-w-full border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-3 text-left">#</th>
                                <th className="border p-3 text-left">Image</th>
                                <th className="border p-3 text-left">Title</th>
                                <th className="border p-3 text-left">Category</th>
                                <th className="border p-3 text-left">Day Create</th>
                                <th className="border p-3 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.map((blog, index) => (
                                <tr key={blog._id} className="hover:bg-gray-50 transition">
                                    <td className="border p-3">{index + 1}</td>
                                    <td className="border p-3">
                                        <img
                                            src={blog.thumbnail || "https://via.placeholder.com/100"}
                                            alt={blog.title}
                                            className="w-16 h-16 object-cover rounded-md"
                                        />
                                    </td>
                                    <td className="border p-3">{blog.title}</td>
                                    <td className="border p-3">{blog.category || "Không có"}</td>
                                    <td className="border p-3">{new Date(blog.createdAt).toLocaleDateString()}</td>
                                    <td className="border p-3">
                                        <Button
                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                                            onClick={() => handleUpdate(blog._id)}
                                        >
                                            Update
                                        </Button>
                                        <Button
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            onClick={() => handleDelete(blog._id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="mt-6 flex justify-center">
                <Pagination
                    current={pagination.page}
                    total={pagination.totalResults}
                    pageSize={pagination.limit}
                    onChange={(page) => setPagination((prev) => ({ ...prev, page }))}
                />
            </div>

            <BlogCreate
                open={openCreate}
                setOpen={setOpenCreate}
                onSuccess={() => {
                    fetchBlogs();
                    setOpenCreate(false);
                }}
            />
        </div>
    );
};

export default ManageBlog;
