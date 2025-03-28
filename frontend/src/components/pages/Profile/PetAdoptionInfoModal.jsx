/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { Modal, Descriptions, Tag, Image } from "antd";
import moment from "moment";
import { HeartFilled } from "@ant-design/icons";

const PetAdoptionInfoModal = ({ open, setOpen, form }) => {
  if (!form) return null;

  const { adopter, pet, sender, reason, status, periodicChecks, createdAt } =
    form;

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
          <span className="font-semibold">Thông tin yêu cầu nhận nuôi</span>
        </div>
      }
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={600}
      className="pet-adoption-info-modal"
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
              {pet?.name || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="text-pink-700">Giống</span>}
            >
              {pet?.breed.name || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="text-pink-700">Tuổi</span>}
            >
              {pet?.age ? `${pet.age} tuổi` : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="text-pink-700">Tình trạng sức khỏe</span>}
            >
              {pet?.health_status || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="text-pink-700">Mô tả</span>}
            >
              {pet?.description || "Không có"}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="text-pink-700">Hình ảnh</span>}
            >
              {pet?.image_url?.[0]?.[0] ? (
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

        {/* Form Information */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-amber-800 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-pink-500 rounded-full"></span>
            Thông tin yêu cầu
          </h3>
          <Descriptions
            bordered
            column={1}
            size="small"
            className="border-pink-200"
          >
            <Descriptions.Item
              label={<span className="text-pink-700">Người gửi yêu cầu</span>}
            >
              {sender?.username || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="text-pink-700">Thông điệp</span>}
            >
              {reason || "Không có"}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="text-pink-700">Trạng thái</span>}
            >
              {getStatusTag(status)}
            </Descriptions.Item>
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
        </div>
      </div>

      <style jsx global>{`
        .pet-adoption-info-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
        }

        .pet-adoption-info-modal .ant-modal-header {
          background-color: #fdf2f8;
          border-bottom: 1px solid #fbcfe8;
          padding: 16px 24px;
        }

        .pet-adoption-info-modal
          .ant-descriptions-bordered
          .ant-descriptions-item-label {
          background-color: #fdf2f8;
        }

        .pet-adoption-info-modal
          .ant-descriptions-bordered
          .ant-descriptions-view {
          border-color: #fbcfe8;
        }

        .pet-adoption-info-modal
          .ant-descriptions-bordered
          .ant-descriptions-row {
          border-bottom-color: #fbcfe8;
        }

        .pet-adoption-info-modal
          .ant-descriptions-bordered
          .ant-descriptions-item-label,
        .pet-adoption-info-modal
          .ant-descriptions-bordered
          .ant-descriptions-item-content {
          border-right-color: #fbcfe8;
        }
      `}</style>
    </Modal>
  );
};

export default PetAdoptionInfoModal;
