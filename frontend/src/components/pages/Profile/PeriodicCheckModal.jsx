/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import {
  Modal,
  Form,
  Select,
  Input,
  Button,
  DatePicker,
  Upload,
  Alert,
} from "antd";
import { useState, useEffect } from "react";
import moment from "moment";
import { addPeriodicCheckAPI } from "@/apis/post";
import { toast } from "sonner";
import { UploadOutlined, HeartFilled } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

const PeriodicCheckModal = ({ open, setOpen, form, onSubmit, currentUser }) => {
  const [formInstance] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const isCheckNeeded = () => {
    if (!form.next_check_date) return false;
    const now = moment();
    const checkDate = moment(form.next_check_date);
    return now.isSameOrAfter(checkDate, "day");
  };

  // Reset form khi modal mở/đóng
  useEffect(() => {
    if (open) {
      formInstance.resetFields();
      formInstance.setFieldsValue({
        checkDate: moment(),
        status: "Good",
      });
      setFileList([]);
    }
  }, [open, formInstance]);

  const handleSubmit = async (values) => {
    try {
      // Validate nếu check được phép
      if (!isCheckNeeded() && form.next_check_date) {
        toast.error("Chưa đến thời gian kiểm tra tiếp theo!");
        return;
      }

      setLoading(true);
      const formData = new FormData();
      formData.append("adoptionFormId", form._id);
      formData.append("checkDate", values.checkDate.toISOString());
      formData.append("status", values.status);
      formData.append("notes", values.notes);
      formData.append("checkedBy", currentUser.id);

      // Thêm file vào formData nếu có
      if (fileList.length > 0) {
        formData.append("image_url", fileList[0].originFileObj);
      }

      console.log("Form Data before sending:", {
        adoptionFormId: form._id,
        checkDate: values.checkDate.toISOString(),
        status: values.status,
        notes: values.notes,
        checkedBy: currentUser.id,
        hasImage: fileList.length > 0,
      });

      const { data } = await addPeriodicCheckAPI(form._id, formData);
      if (data.status === 200) {
        toast.success("Periodic check added successfully");
        await onSubmit();
        setOpen(false);
      }
    } catch (error) {
      console.error("Error submitting periodic check:", error);
      toast.error(
        error.response?.data?.message || "Failed to add periodic check"
      );
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi file thay đổi
  const handleImageChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const isCheckButtonDisabled = () => {
    if (!form.next_check_date) return false;
    const now = moment();
    const nextCheck = moment(form.next_check_date);
    return now.isBefore(nextCheck);
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-amber-800">
          <HeartFilled style={{ color: "#f472b6" }} />
          <span className="font-semibold">
            Kiểm tra định kỳ ({form?.periodicChecks.length + 1}/3)
          </span>
        </div>
      }
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      className="periodic-check-modal"
    >
      <div className="space-y-4">
        <div className="mb-4 p-4 bg-pink-50 rounded-lg border border-pink-100">
          <p className="text-gray-700">
            Số lần kiểm tra hiện tại:{" "}
            <span className="font-semibold">{form?.periodicChecks.length}</span>
          </p>
          {form.next_check_date && (
            <>
              <p className="mt-2 text-gray-700">
                Đợt kiểm tra tiếp theo:{" "}
                <span className="font-semibold">
                  {moment(form.next_check_date).format("DD/MM/YYYY")}
                </span>
              </p>
              {isCheckNeeded() && (
                <Alert
                  message="Cần kiểm tra ngay!"
                  description="Đã đến hoặc quá thời hạn kiểm tra định kỳ"
                  type="error"
                  showIcon
                  className="mt-2"
                />
              )}
            </>
          )}
        </div>

        <Form
          form={formInstance}
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={{
            checkDate: moment(),
            status: "Good",
          }}
          className="space-y-4"
        >
          <Form.Item
            name="checkDate"
            label="Ngày kiểm tra"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ngày kiểm tra",
              },
            ]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              className="w-full border-pink-200 hover:border-pink-400"
              disabledDate={(current) =>
                current && current > moment().endOf("day")
              }
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn trạng thái",
              },
            ]}
          >
            <Select
              placeholder="Chọn trạng thái"
              className="border-pink-200 hover:border-pink-400"
            >
              <Option value="Good">Tốt</Option>
              <Option value="Needs Attention">Cần chú ý</Option>
              <Option value="Critical">Nghiêm trọng</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="notes"
            label="Ghi chú"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập ghi chú về tình trạng thú cưng",
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Ghi chú về tình trạng thú cưng..."
              className="border-pink-200 hover:border-pink-400"
            />
          </Form.Item>

          {/* Form.Item cho upload file */}
          <Form.Item
            name="image_url"
            label="Hình ảnh kiểm tra"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e.fileList)}
            rules={[
              {
                validator(_, value) {
                  if (!value || value.length === 0) {
                    return Promise.reject(
                      new Error("Vui lòng tải lên hình ảnh kiểm tra")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Upload
              beforeUpload={() => false}
              onChange={handleImageChange}
              maxCount={1}
              fileList={fileList}
              className="upload-pink"
            >
              <Button
                icon={<UploadOutlined />}
                className="border-pink-300 text-pink-600 hover:border-pink-500 hover:text-pink-700"
              >
                Chọn ảnh
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item className="pt-4 border-t border-pink-100">
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800"
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                danger={isCheckNeeded()}
                disabled={isCheckButtonDisabled()}
                className={
                  isCheckNeeded()
                    ? "bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600"
                    : "bg-pink-500 hover:bg-pink-600 border-pink-500 hover:border-pink-600"
                }
              >
                {isCheckNeeded() ? "Hoàn tất kiểm tra!" : "Lưu"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>

      <style jsx global>{`
        .periodic-check-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
        }

        .periodic-check-modal .ant-modal-header {
          background-color: #fdf2f8;
          border-bottom: 1px solid #fbcfe8;
          padding: 16px 24px;
        }

        .periodic-check-modal .ant-modal-body {
          padding: 20px;
        }

        .periodic-check-modal .ant-form-item-label > label {
          color: #9d174d;
          font-weight: 500;
        }

        .periodic-check-modal .ant-picker:hover,
        .periodic-check-modal .ant-select-selector:hover,
        .periodic-check-modal .ant-input:hover,
        .periodic-check-modal .ant-input-affix-wrapper:hover {
          border-color: #f472b6 !important;
        }

        .periodic-check-modal .ant-picker-focused,
        .periodic-check-modal .ant-select-focused .ant-select-selector,
        .periodic-check-modal .ant-input-focused,
        .periodic-check-modal .ant-input-affix-wrapper-focused {
          border-color: #f472b6 !important;
          box-shadow: 0 0 0 2px rgba(244, 114, 182, 0.2) !important;
        }

        .upload-pink .ant-upload-list-item-card-actions-btn {
          color: #f472b6;
        }

        .upload-pink .ant-upload-list-item {
          border-color: #fbcfe8;
        }
      `}</style>
    </Modal>
  );
};

export default PeriodicCheckModal;
