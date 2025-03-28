/* eslint-disable react/prop-types */
import { Modal, Tag, Alert, Button } from "antd";
import moment from "moment";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  HeartFilled,
} from "@ant-design/icons";

const PeriodicCheckResultsModal = ({ open, setOpen, form, onRequestCheck }) => {
  const isCheckNeeded = () => {
    if (!form.next_check_date) return false;
    const now = moment();
    const checkDate = moment(form.next_check_date);
    return now.isSameOrAfter(checkDate, "day");
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-amber-800">
          <HeartFilled style={{ color: "#f472b6" }} />
          <span className="font-semibold">Lịch sử kiểm tra định kỳ</span>
        </div>
      }
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={800}
      className="periodic-check-history-modal"
    >
      <div className="p-4 bg-pink-50/50 rounded-lg border border-pink-100 mb-6">
        <h3 className="text-lg font-semibold text-amber-800 mb-2">
          Thông tin thú cưng
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <p>
            <span className="font-medium text-pink-700">Tên:</span>{" "}
            {form?.pet?.name || "N/A"}
          </p>
          <p>
            <span className="font-medium text-pink-700">Loài:</span>{" "}
            {form?.pet?.breed?.name || "N/A"}
          </p>
          <p>
            <span className="font-medium text-pink-700">Người nhận nuôi:</span>{" "}
            {form?.adopter?.name || "N/A"}
          </p>
          <p>
            <span className="font-medium text-pink-700">Ngày nhận nuôi:</span>{" "}
            {form?.createdAt
              ? moment(form.createdAt).format("DD/MM/YYYY")
              : "N/A"}
          </p>
        </div>

        {form?.next_check_date && isCheckNeeded() && (
          <Alert
            message="Cần kiểm tra ngay!"
            description={`Đã đến hoặc quá thời hạn kiểm tra định kỳ (${moment(
              form.next_check_date
            ).format("DD/MM/YYYY")})`}
            type="error"
            showIcon
            className="mt-4"
            action={
              <Button
                size="small"
                danger
                onClick={() => onRequestCheck(form._id)}
              >
                Yêu cầu kiểm tra
              </Button>
            }
          />
        )}
      </div>

      <div className="space-y-6">
        {form?.periodicChecks && form.periodicChecks.length > 0 ? (
          form.periodicChecks.map((check, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border border-pink-200"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-amber-800">
                  Kiểm tra #{index + 1}
                </h3>
                <Tag
                  color={
                    check.status === "Good"
                      ? "success"
                      : check.status === "Needs Attention"
                      ? "warning"
                      : "error"
                  }
                  icon={
                    check.status === "Good" ? (
                      <CheckCircleOutlined />
                    ) : check.status === "Needs Attention" ? (
                      <ExclamationCircleOutlined />
                    ) : (
                      <CloseCircleOutlined />
                    )
                  }
                >
                  {check.status === "Good"
                    ? "Tốt"
                    : check.status === "Needs Attention"
                    ? "Cần chú ý"
                    : "Nghiêm trọng"}
                </Tag>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="mb-2">
                    <span className="font-medium text-pink-700">
                      Ngày kiểm tra:
                    </span>{" "}
                    {moment(check.checkDate).format("DD/MM/YYYY")}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium text-pink-700">
                      Người kiểm tra:
                    </span>{" "}
                    {check.checkedBy?.username || "N/A"}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium text-pink-700">Ghi chú:</span>{" "}
                    {check.notes || "Không có"}
                  </p>
                </div>

                {check.image_url && (
                  <div>
                    <p className="font-medium mb-2 text-pink-700">Hình ảnh:</p>
                    <img
                      src={check.image_url}
                      alt="Check result"
                      className="w-full max-w-xs rounded-lg cursor-pointer hover:opacity-90 border border-pink-200"
                      onClick={() => window.open(check.image_url, "_blank")}
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">
            Chưa có kiểm tra định kỳ nào
          </p>
        )}
      </div>
    </Modal>
  );
};

export default PeriodicCheckResultsModal;
