import { fetchAllPostsAPI, updatePostAPI } from "@/apis/post";
import { Table, Button, Dropdown, Menu } from "antd";
import { useEffect, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { toast } from "sonner";

function ManagePost() {
  const [posts, setPosts] = useState([]);
  const [limit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const fetchPosts = async (page = 1) => {
    try {
      const response = await fetchAllPostsAPI(page,limit);
      setPosts(response.data.data.results);
      setTotalResults(response.data.data.totalResults);
    } catch (error) {
      console.error("Lỗi khi tải bài viết:", error);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const handleAction = async (postId, data, successMessage) => {
    try {
      await updatePostAPI(postId, data);
      await fetchPosts(currentPage);
      toast.success(successMessage);
    } catch (error) {
      console.error("Lỗi khi cập nhật bài viết:", error);
      toast.error("Thao tác thất bại. Vui lòng thử lại.");
    }
  };

  const getStatusColor = (record) => {
    if (record.isBlocked) return "bg-gray-500 text-white"; // Bị chặn
    if (record.isRejected) return "bg-red-500 text-white"; // Bị từ chối
    if (record.isApproved) return "bg-green-500 text-white"; // Đã duyệt
    return "bg-blue-500 text-white"; // Chờ duyệt
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image && image.length > 0 ? (
          <img
            src={image[0]}
            alt="Bài viết"
            width={50}
            height={50}
            className="rounded object-cover"
            onError={(e) => (e.target.src = "/default-thumbnail.jpg")}
          />
        ) : (
          "Không có hình"
        ),
    },
    {
      title: "Chú thích",
      dataIndex: "caption",
      key: "caption",
      render: (caption) => (
        <p className="overflow-hidden overflow-ellipsis whitespace-nowrap max-w-[200px]">
          {caption}
        </p>
      ),
    },
    {
      title: "Tác giả",
      dataIndex: ["author", "username"],
      key: "author",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item
              key="approve"
              disabled={record.isApproved}
              onClick={() =>
                handleAction(
                  record._id,
                  { isApproved: true, isRejected: false },
                  "Bài viết đã được duyệt"
                )
              }
            >
              Duyệt bài
            </Menu.Item>
            <Menu.Item
              key="reject"
              disabled={record.isRejected}
              onClick={() =>
                handleAction(
                  record._id,
                  { isRejected: true, isApproved: false },
                  "Bài viết đã bị từ chối"
                )
              }
            >
              Từ chối
            </Menu.Item>
            <Menu.Item
              key="block"
              danger={record.isBlocked}
              onClick={() =>
                handleAction(
                  record._id,
                  { isBlocked: !record.isBlocked },
                  record.isBlocked
                    ? "Bài viết đã được bỏ chặn"
                    : "Bài viết đã bị chặn"
                )
              }
            >
              {record.isBlocked ? "Bỏ chặn" : "Chặn"}
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button
              className={`flex items-center gap-2 ${getStatusColor(record)}`}
            >
              {record.isBlocked
                ? "Đã chặn"
                : record.isRejected
                ? "Bị từ chối"
                : record.isApproved
                ? "Đã duyệt"
                : "Chờ duyệt"}
              <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý bài viết</h1>
      <Table
        columns={columns}
        dataSource={posts}
        rowKey="_id"
        pagination={{
          current: currentPage,
          pageSize: limit,
          total: totalResults,
          onChange: handlePageChange,
        }}
      />
    </div>
  );
}

export default ManagePost;
