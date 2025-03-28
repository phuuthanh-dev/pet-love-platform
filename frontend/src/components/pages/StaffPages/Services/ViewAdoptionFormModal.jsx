/* eslint-disable react/no-unknown-property */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import { Modal, Descriptions, Divider, Image, Tag, Select, Button } from "antd";
import { useState } from "react";
import moment from "moment";
import { toast } from "sonner";
import { updateAdoptionFormStatusAPI } from "@/apis/post";
import { HeartFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import VerifiedBadge from "@/components/core/VerifiedBadge";
import { Textarea } from "@/components/ui/textarea";

const ViewAdoptionFormModal = ({ open, setOpen, form, onStatusUpdate }) => {
  if (!form) return null;

  const {
    adopter,
    adoptionPost,
    pet,
    sender,
    reason,
    status,
    periodicChecks,
    createdAt,
  } = form;

  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  const handleSaveStatus = async () => {
    if (!selectedStatus) {
      toast.error("Vui lòng chọn trạng thái!");
      return;
    }
    if (!note.trim()) {
      toast.error("Vui lòng nhập phản hồi cho người đăng ký!");
      return;
    }
    try {
      setLoading(true);
      const response = await updateAdoptionFormStatusAPI(
        form._id,
        selectedStatus,
        note
      );
      if (response.status === 200) {
        toast.success("Cập nhật trạng thái thành công!");
        onStatusUpdate(form._id, selectedStatus);
        setIsEditing(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Lỗi khi cập nhật trạng thái!"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      Pending: { color: "yellow", text: "Đang chờ" },
      Approved: { color: "green", text: "Đã duyệt" },
      Rejected: { color: "red", text: "Đã từ chối" },
    };

    const config = statusConfig[status] || statusConfig.Pending;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-amber-800">
          <HeartFilled style={{ color: "#f472b6" }} />
          <span className="font-semibold">Chi tiết đơn nhận nuôi</span>
        </div>
      }
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={800}
      className="adoption-form-modal"
    >
      <div className="space-y-6">
        {/* Adopter Information */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-amber-800 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-pink-500 rounded-full"></span>
            Thông tin người nhận nuôi
          </h3>
          <Descriptions
            bordered
            column={1}
            size="small"
            className="border-pink-200"
          >
            <Descriptions.Item
              label={<span className="text-pink-700">Họ tên</span>}
            >
              {adopter.name}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="text-pink-700">Email</span>}
            >
              {adopter.email}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="text-pink-700">Số điện thoại</span>}
            >
              {adopter.phone}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="text-pink-700">Địa chỉ</span>}
            >
              {`${adopter.address.detail}, ${adopter.address.ward}, ${adopter.address.district}, ${adopter.address.province}`}
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* Pet Information */}
        <Divider className="border-pink-100" />
        <div>
          <h3 className="text-lg font-semibold mb-2 text-amber-800 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-pink-500 rounded-full"></span>
            Thông tin thú cưng
          </h3>
          <Descriptions
            bordered
            column={1}
            size="small"
            className="border-pink-200"
          >
            <Descriptions.Item
              label={<span className="text-pink-700">Tên</span>}
            >
              {pet.name}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="text-pink-700">Giống</span>}
            >
              {pet.breed.name}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="text-pink-700">Tuổi</span>}
            >
              {pet.age} tuổi
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="text-pink-700">Tình trạng sức khỏe</span>}
            >
              {pet.health_status}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="text-pink-700">Mô tả</span>}
            >
              {pet.description}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="text-pink-700">Hình ảnh</span>}
            >
              {pet.image_url?.[0]?.[0] ? (
                <Image
                  src={pet.image_url[0][0]}
                  alt={pet.name}
                  width={100}
                  height={100}
                  className="object-cover rounded border border-pink-200"
                />
              ) : (
                "Không có ảnh"
              )}
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* Adoption Post Information */}
        <Divider className="border-pink-100" />
        <div>
          <h3 className="text-lg font-semibold mb-2 text-amber-800 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-pink-500 rounded-full"></span>
            Thông tin bài đăng
          </h3>
          <Descriptions
            bordered
            column={1}
            size="small"
            className="border-pink-200"
          >
            <Descriptions.Item
              label={<span className="text-pink-700">Tiêu đề</span>}
            >
              {adoptionPost.caption}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span className="text-pink-700">Trạng thái nhận nuôi</span>
              }
            >
              <Tag
                color={
                  adoptionPost.adopt_status === "Available"
                    ? "green"
                    : adoptionPost.adopt_status === "Pending"
                    ? "yellow"
                    : "blue"
                }
              >
                {adoptionPost.adopt_status === "Available"
                  ? "Chưa nhận nuôi"
                  : adoptionPost.adopt_status === "Pending"
                  ? "Đã liên hệ"
                  : "Đã nhận nuôi"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="text-pink-700">Địa điểm</span>}
            >
              {adoptionPost.location}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="text-pink-700">Hình ảnh bài đăng</span>}
            >
              {adoptionPost.image?.[0] ? (
                <Image
                  src={adoptionPost.image[0]}
                  alt="Adoption Post"
                  width={100}
                  height={100}
                  className="object-cover rounded border border-pink-200"
                />
              ) : (
                "Không có ảnh"
              )}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="text-pink-700">Ngày đăng</span>}
            >
              {moment(adoptionPost.createdAt).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* Form Information */}
        <Divider className="border-pink-100" />
        <div>
          <h3 className="text-lg font-semibold mb-2 text-amber-800 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-pink-500 rounded-full"></span>
            Thông tin đơn
          </h3>
          <Descriptions
            bordered
            column={1}
            size="small"
            className="border-pink-200"
          >
            <Descriptions.Item
              label={<span className="text-pink-700">Người gửi đơn</span>}
            >
              <div className="flex items-center gap-2">
                <Link to={`/profile/${sender?.username}`} target="_blank">
                  <Avatar style={{ border: "1px solid #e0e0e0" }}>
                    <AvatarImage
                      src={sender?.profilePicture}
                      alt="post_image"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <Link to={`/profile/${sender?.username}`} target="_blank">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {sender?.username}
                    </span>
                    {sender?.isVerified && <VerifiedBadge size={14} />}
                  </div>
                </Link>
              </div>
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="text-pink-700">Thông điệp</span>}
            >
              {reason || "Không có"}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="text-pink-700">Trạng thái</span>}
            >
              {isEditing ? (
                <Select
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  style={{ width: 150 }}
                  className="border-pink-200"
                >
                  <Select.Option value="Pending">Đang chờ</Select.Option>
                  <Select.Option value="Approved">Duyệt</Select.Option>
                  <Select.Option value="Rejected">Từ chối</Select.Option>
                </Select>
              ) : (
                getStatusTag(status)
              )}
            </Descriptions.Item>
            {/* Thêm item ghi chú khi isEditing là true */}
            {isEditing && (
              <Descriptions.Item
                label={<span className="text-pink-700">Phản hồi</span>}
              >
                <Textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Nhập phản hồi cho người đăng ký"
                  className="border-pink-200 hover:border-pink-400"
                />
              </Descriptions.Item>
            )}
            <Descriptions.Item
              label={<span className="text-pink-700">Ngày tạo</span>}
            >
              {moment(createdAt).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span className="text-pink-700">Số lần kiểm tra định kỳ</span>
              }
            >
              <Tag color="pink">{periodicChecks.length}/3</Tag>
            </Descriptions.Item>
          </Descriptions>

          <div className="flex justify-end mt-4 gap-2">
            {status === "Pending" && (
              <>
                {isEditing ? (
                  <>
                    <Button
                      onClick={() => setIsEditing(false)}
                      className="border-gray-300 hover:border-gray-400"
                    >
                      Hủy
                    </Button>
                    <Button
                      type="primary"
                      onClick={handleSaveStatus}
                      loading={loading}
                      className="border-pink-500 bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white hover:border-pink-600"
                    >
                      Lưu
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="border-amber-500 bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white hover:border-amber-600"
                  >
                    Chỉnh sửa trạng thái
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .adoption-form-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
        }

        .adoption-form-modal .ant-modal-header {
          background-color: #fdf2f8;
          border-bottom: 1px solid #fbcfe8;
          padding: 16px 24px;
        }

        .adoption-form-modal
          .ant-descriptions-bordered
          .ant-descriptions-item-label {
          background-color: #fdf2f8;
        }

        .adoption-form-modal .ant-descriptions-bordered .ant-descriptions-view {
          border-color: #fbcfe8;
        }

        .adoption-form-modal .ant-descriptions-bordered .ant-descriptions-row {
          border-bottom-color: #fbcfe8;
        }

        .adoption-form-modal
          .ant-descriptions-bordered
          .ant-descriptions-item-label,
        .adoption-form-modal
          .ant-descriptions-bordered
          .ant-descriptions-item-content {
          border-right-color: #fbcfe8;
        }

        .adoption-form-modal .ant-select-selector {
          border-color: #f9a8d4 !important;
        }

        .adoption-form-modal .ant-select:hover .ant-select-selector {
          border-color: #f472b6 !important;
        }
      `}</style>
    </Modal>
  );
};

export default ViewAdoptionFormModal;
