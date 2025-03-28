import { Button, Pagination, Select } from "antd";
import { useEffect, useState } from "react";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import { fetchAllAdoptionPostsAPI } from "@/apis/post";
import EditAdoptPostModal from "./EditAdoptPostModal"; // Adjust path
import CreateAdoptionFormModal from "../../../features/adoptions/CreateAdoptionFormModal"; // Adjust path
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

const ManageSendPets = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusSort, setStatusSort] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt:desc");
  const [totalResults, setTotalResults] = useState(0);
  const itemsPerPage = 4;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAllAdoptionPostsAPI(
          currentPage,
          itemsPerPage,
          sortBy,
          statusSort
        );
        const { results, totalResults } = response.data.data;
        setPosts(results);
        setTotalResults(totalResults);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchData();
  }, [currentPage, statusSort, sortBy]);

  const handleSortCategory = (value) => {
    switch (value) {
      case "createdAt_asc":
        setSortBy("createdAt:asc");
        break;
      case "createdAt_desc":
        setSortBy("createdAt:desc");
        break;
      case "status_available":
        setStatusSort("Available");
        break;
      case "status_pending":
        setStatusSort("Pending");
        break;
      case "status_adopted":
        setStatusSort("Adopted");
        break;
      default:
        setSortBy("createdAt:desc");
        setStatusSort(null);
        break;
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditClick = (post) => {
    setSelectedPost(post);
    setEditModalOpen(true);
  };

  const handleFormClick = (post) => {
    setSelectedPost(post);
    setFormModalOpen(true);
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
    setEditModalOpen(false);
  };

  const handleFormSubmitted = (formData) => {
    console.log("Form submitted:", formData);
    setFormModalOpen(false);
  };

  return (
    <div className="p-6 bg-gradient-to-b from-pink-50 to-white min-h-screen">
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border-2 border-pink-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🐾</span>
            <h1 className="text-2xl font-bold text-amber-800">
              Danh sách thú cưng về nhà mới
            </h1>
          </div>
          <Select
            defaultValue=""
            onChange={handleSortCategory}
            style={{ width: "250px" }}
            className="border-pink-200"
          >
            <Option value="">Không sắp xếp</Option>
            <Option value="createdAt_asc">Ngày tạo (Tăng dần)</Option>
            <Option value="createdAt_desc">Ngày tạo (Giảm dần)</Option>
            <Option value="status_available">Chỉ hiện Chưa nhận nuôi</Option>
            <Option value="status_pending">Chỉ hiện Đã liên hệ</Option>
            <Option value="status_adopted">Chỉ hiện Đã nhận nuôi</Option>
          </Select>
        </div>

        <div className="bg-pink-50 p-4 mb-6 rounded-lg border border-pink-100">
          <div className="flex items-center gap-2 text-pink-700">
            <ExclamationCircleOutlined />
            <span>
              Tổng số bài đăng: <strong>{totalResults}</strong> | Trang hiện
              tại: <strong>{currentPage}</strong>
            </span>
          </div>
        </div>

        {posts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Không có bài đăng nhận nuôi nào
          </p>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="min-w-full bg-white border border-pink-200 rounded-md pet-friendly-table">
              <thead>
                <tr>
                  {[
                    "#",
                    "Post ID",
                    "Caption",
                    "Image",
                    "Status",
                    "Author",
                    "Location",
                    "Created At",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase border-b border-pink-200 border-r"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map((post, index) => (
                  <tr
                    key={post._id}
                    className={index % 2 === 0 ? "bg-pink-50/30" : "bg-white"}
                  >
                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-pink-100 border-r">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-pink-100 border-r"></td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-pink-100 border-r">
                      <div className="line-clamp-2 overflow-hidden">
                        {post.caption}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-pink-100 border-r">
                      <LightGallery speed={500} plugins={[lgThumbnail, lgZoom]}>
                        {post.image?.length ? (
                          <img
                            src={post.image[0]}
                            alt="Post"
                            className="h-12 w-12 object-cover rounded-md cursor-pointer border border-pink-200"
                          />
                        ) : (
                          <span className="text-gray-400">Không có ảnh</span>
                        )}
                      </LightGallery>
                    </td>
                    <td className="px-6 py-4 text-sm border-b border-pink-100 border-r">
                      <span
                        className={`font-bold ${
                          post.adopt_status === "Available"
                            ? "text-green-500"
                            : post.adopt_status === "Pending"
                            ? "text-yellow-500"
                            : "text-blue-500"
                        }`}
                      >
                        {post.adopt_status === "Available"
                          ? "Chưa nhận nuôi"
                          : post.adopt_status === "Pending"
                          ? "Đã liên hệ"
                          : "Đã nhận nuôi"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-pink-100 border-r">
                      {post.author?.username || "Không rõ"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-pink-100 border-r">
                      {post.location || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-pink-100 border-r">
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString("vi-VN")
                        : "Không rõ"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-pink-100 border-r">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEditClick(post)}
                          className="border-pink-500 bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white hover:border-pink-600"
                        >
                          Sửa
                        </Button>
                        {post.adopt_status === "Available" && (
                          <Button
                            onClick={() => handleFormClick(post)}
                            className="border-amber-500 bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white hover:border-amber-600"
                          >
                            Tạo form gửi
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={totalResults}
            onChange={handlePageChange}
            showSizeChanger={false}
            className="custom-pagination"
          />
        </div>

        {editModalOpen && (
          <EditAdoptPostModal
            open={editModalOpen}
            setOpen={setEditModalOpen}
            post={selectedPost}
            onUpdate={handleUpdatePost}
          />
        )}
        {formModalOpen && (
          <CreateAdoptionFormModal
            open={formModalOpen}
            setOpen={setFormModalOpen}
            post={selectedPost}
            onSubmit={handleFormSubmitted}
          />
        )}
      </div>

      <style jsx global>{`
        .pet-friendly-table .ant-table-thead > tr > th {
          background-color: #fdf3f8;
          border-bottom: 2px solid #fecdd3;
        }

        .ant-table-wrapper .ant-table-pagination.ant-pagination {
          margin: 16px 0;
        }

        .custom-pagination .ant-pagination-item-active {
          background-color: #fdf3f8;
          border-color: #f472b6;
        }

        .ant-pagination-item:hover {
          border-color: #f472b6;
        }

        .ant-select-selector {
          border-color: #f9a8d4 !important;
        }

        .ant-select:hover .ant-select-selector {
          border-color: #f472b6 !important;
        }
      `}</style>
    </div>
  );
};

export default ManageSendPets;
