/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Upload } from "antd";
import Search from "antd/es/input/Search";
import {
  createClientSettingAPI,
  getClientSettingAPI,
  updateClientSettingAPI,
} from "@/apis/clientSetting";
import { PlusOutlined, UserAddOutlined } from "@ant-design/icons";

function ManageSetting() {
  const [settings, setSettings] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Replace with actual API call
        const response = await getClientSettingAPI();
        if (response?.status === 200) {
          setSettings(response.data);
        }
      } catch (error) {
        setSettings([]);
      }
    };
    fetchSettings();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSubmit = async (values, isUpdate = false) => {
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (key === "image" && value?.length)
          formData.append("image", value[0].originFileObj);
        else if (value !== undefined) formData.append(key, value);
      });

      const res = isUpdate
        ? await updateClientSettingAPI(values._id, formData)
        : await createClientSettingAPI(formData);
      if (res?.status === (isUpdate ? 200 : 201)) {
        setSettings(
          isUpdate
            ? settings.map((s) => (s._id === values._id ? res.data : s))
            : [...settings, res.data]
        );
        message.success(
          `Setting ${isUpdate ? "updated" : "created"} successfully!`
        );
        isUpdate ? setIsUpdateModalVisible(false) : setIsModalVisible(false);
      }
    } catch {
      message.error(`Failed to ${isUpdate ? "update" : "create"} setting`);
    }
  };

  const renderModal = (
    title,
    visible,
    setVisible,
    formInstance,
    isUpdate = false
  ) => (
    <Modal
      title={title}
      open={visible}
      onCancel={() => setVisible(false)}
      footer={null}
    >
      <Form
        form={formInstance}
        layout="vertical"
        onFinish={(values) => handleSubmit(values, isUpdate)}
      >
        {isUpdate && (
          <Form.Item name="_id" hidden>
            <Input />
          </Form.Item>
        )}
        <Form.Item name="name" label="Setting Key" rules={[{ required: true }]}>
          <Input disabled={isUpdate} />
        </Form.Item>
        <Form.Item name="value" label="Setting Value">
          <Input />
        </Form.Item>
        <Form.Item
          name="image"
          label="Upload Image"
          valuePropName="fileList"
          getValueFromEvent={(e) => e?.fileList}
        >
          <Upload
            listType="picture-card"
            maxCount={1}
            beforeUpload={() => false}
          >
            <PlusOutlined />
            <div>Upload</div>
          </Upload>
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {isUpdate ? "Update" : "Save"} Setting
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );

  const columns = [
    {
      title: (
        <div className="flex items-center gap-10">
          Key
          <Search
            placeholder="Search settings..."
            onSearch={(value) => console.log(value)}
            style={{ width: 200 }}
            allowClear
          />
        </div>
      ),
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            style={{
              background: "#fdf2f8",
              borderColor: "#fbcfe8",
              color: "#db2777",
            }}
            className="hover:bg-pink-200 hover:border-pink-300 hover:text-pink-800"
            onClick={() => {
              updateForm.setFieldsValue({
                ...record,
                image: record.value?.startsWith("https://res.cloudinary")
                  ? [{ url: record.value }]
                  : [],
              });
              setIsUpdateModalVisible(true); // Show modal instead of submitting
            }}
          >
            Edit
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gradient-to-b from-pink-50 to-white min-h-screen">
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border-2 border-pink-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🐾</span>
            <h1 className="text-2xl font-bold text-amber-800">
              Cài đặt cho Website
            </h1>
          </div>
          <Button
            onClick={() => setIsModalVisible(true)}
            className="flex items-center gap-2 bg-pink-500 text-white border-0 hover:bg-pink-600 hover:border-0"
            icon={<UserAddOutlined />}
          >
            Create Setting
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={settings}
          rowKey="_id"
          pagination={{
            current: currentPage,
            pageSize: limit,
            showSizeChanger: false,
            total: settings.length,
            onChange: handlePageChange,
            className: "custom-pagination",
            itemRender: (page, type) => {
              if (type === "page") {
                return (
                  <span
                    className={`${
                      page === currentPage
                        ? "text-pink-600 font-bold"
                        : "text-gray-600"
                    }`}
                  >
                    {page}
                  </span>
                );
              }
              return null;
            },
          }}
          className="pet-friendly-table"
          rowClassName={(record, index) =>
            index % 2 === 0 ? "bg-pink-50/30" : "bg-white"
          }
        />

        {renderModal("Manage Setting", isModalVisible, setIsModalVisible, form)}
        {renderModal(
          "Update Setting",
          isUpdateModalVisible,
          setIsUpdateModalVisible,
          updateForm,
          true
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
      `}</style>
    </div>
  );
}

export default ManageSetting;
