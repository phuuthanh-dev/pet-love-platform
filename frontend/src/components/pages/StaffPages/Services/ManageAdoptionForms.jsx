/* eslint-disable react/no-unknown-property */
import { Button, Pagination, Select, Tag } from "antd";
import { useEffect, useState } from "react";
import ViewAdoptionFormModal from "./ViewAdoptionFormModal";
import PeriodicCheckResultsModal from "./PeriodicCheckResultsModal"; // Import component mới
import { toast } from "sonner";
import {
  alertAdoptionFormStatusAPI,
  fetchAllAdoptionFormsAPI,
} from "@/apis/post";
import moment from "moment";
import { ExclamationCircleOutlined, WarningOutlined } from "@ant-design/icons";

const { Option } = Select;

const ManageAdoptionForms = () => {
  const [forms, setForms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusSort, setStatusSort] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt:desc");
  const [totalResults, setTotalResults] = useState(0);
  const itemsPerPage = 4;
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [resultsModalOpen, setResultsModalOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);

  const fetchForms = async () => {
    try {
      const response = await fetchAllAdoptionFormsAPI(
        currentPage,
        itemsPerPage,
        sortBy,
        statusSort
      );
      const { results, totalResults } = response.data.data;
      setForms(results);
      setTotalResults(totalResults);
    } catch (error) {
      console.error("Error fetching adoption forms:", error);
    }
  };

  useEffect(() => {
    fetchForms();
  }, [currentPage, statusSort, sortBy]);

  const handleSortCategory = (value) => {
    switch (value) {
      case "createdAt_asc":
        setSortBy("createdAt:asc");
        break;
      case "createdAt_desc":
        setSortBy("createdAt:desc");
        break;
      case "status_pending":
        setStatusSort("Pending");
        break;
      case "status_approved":
        setStatusSort("Approved");
        break;
      case "status_rejected":
        setStatusSort("Rejected");
        break;
      default:
        setSortBy("createdAt:desc");
        setStatusSort(null);
        break;
    }
    setCurrentPage(1); // Reset to first page on sort change
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewClick = (form) => {
    setSelectedForm(form);
    setViewModalOpen(true);
  };

  const handleViewResults = (form) => {
    setSelectedForm(form);
    setResultsModalOpen(true);
  };

  const handleRequestCheck = async (formId) => {
    const { data } = await alertAdoptionFormStatusAPI(formId);
    if (data.status === 200) {
      toast.success(`Đã gửi yêu cầu kiểm tra cho đơn ${formId}`);
    }
  };

  const handleStatusUpdate = (formId, newStatus) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form._id === formId ? { ...form, status: newStatus } : form
      )
    );
    setViewModalOpen(false);
    fetchForms();
  };

  const isCheckNeeded = (form) => {
    if (!form.next_check_date || form.status !== "Approved") return false;
    const now = moment();
    const checkDate = moment(form.next_check_date);
    return (
      now.isSameOrAfter(checkDate, "day") && form.periodicChecks.length < 3
    );
  };

  return (
    <div className="p-6 bg-gradient-to-b from-pink-50 to-white min-h-screen">
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border-2 border-pink-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🐾</span>
            <h1 className="text-2xl font-bold text-amber-800">
              Quản lý đơn nhận nuôi
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
            <Option value="status_pending">Chỉ hiện Đang chờ</Option>
            <Option value="status_approved">Chỉ hiện Đã duyệt</Option>
            <Option value="status_rejected">Chỉ hiện Đã từ chối</Option>
          </Select>
        </div>

        <div className="bg-pink-50 p-4 mb-6 rounded-lg border border-pink-100">
          <div className="flex items-center gap-2 text-pink-700">
            <ExclamationCircleOutlined />
            <span>
              Tổng số đơn: <strong>{totalResults}</strong> | Trang hiện tại:{" "}
              <strong>{currentPage}</strong>
            </span>
          </div>
        </div>

        {forms.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Không có đơn nhận nuôi nào
          </p>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="min-w-full bg-white border border-pink-200 rounded-md pet-friendly-table">
              <thead>
                <tr>
                  {[
                    "#",
                    "Tên người nhận",
                    "Email",
                    "Số điện thoại",
                    "Trạng thái",
                    "Thú cưng",
                    "Ngày tạo",
                    "Hành động",
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
                {forms.map((form, index) => (
                  <tr
                    key={form._id}
                    className={index % 2 === 0 ? "bg-pink-50/30" : "bg-white"}
                  >
                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-pink-100 border-r">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-pink-100 border-r">
                      {form.adopter.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-pink-100 border-r">
                      {form.adopter.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-pink-100 border-r">
                      {form.adopter.phone}
                    </td>
                    <td className="px-6 py-4 text-sm border-b border-pink-100 border-r">
                      <Tag
                        color={
                          form.status === "Pending"
                            ? "yellow"
                            : form.status === "Approved"
                            ? "green"
                            : "red"
                        }
                      >
                        {form.status === "Pending"
                          ? "Đang chờ"
                          : form.status === "Approved"
                          ? "Đã duyệt"
                          : "Đã từ chối"}
                      </Tag>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-pink-100 border-r">
                      {form.pet?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-pink-100 border-r">
                      {moment(form.createdAt).format("DD/MM/YYYY")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-pink-100 border-r">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleViewClick(form)}
                          className="border-pink-500 bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white hover:border-pink-600"
                        >
                          Xem
                        </Button>
                        {form.status === "Approved" && (
                          <>
                            {isCheckNeeded(form) && (
                              <Button
                                onClick={() => handleRequestCheck(form._id)}
                                className="border-red-500 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 animate-pulse shadow-md"
                                icon={<WarningOutlined />}
                              >
                                Yêu cầu kiểm tra
                              </Button>
                            )}
                            {form.periodicChecks?.length > 0 && (
                              <Button
                                onClick={() => handleViewResults(form)}
                                className="border-blue-500 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                              >
                                Xem kết quả ({form.periodicChecks.length}/3)
                              </Button>
                            )}
                          </>
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
            className="custom-pagination"
          />
        </div>

        {viewModalOpen && (
          <ViewAdoptionFormModal
            open={viewModalOpen}
            setOpen={setViewModalOpen}
            form={selectedForm}
            onStatusUpdate={handleStatusUpdate}
          />
        )}

        {resultsModalOpen && (
          <PeriodicCheckResultsModal
            open={resultsModalOpen}
            setOpen={setResultsModalOpen}
            form={selectedForm}
            onRequestCheck={handleRequestCheck}
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

        .periodic-check-history-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
        }

        .periodic-check-history-modal .ant-modal-header {
          background-color: #fdf2f8;
          border-bottom: 1px solid #fbcfe8;
          padding: 16px 24px;
        }

        .periodic-check-history-modal .ant-modal-title {
          color: #9d174d;
        }

        .periodic-check-history-modal .ant-modal-close {
          color: #be185d;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default ManageAdoptionForms;
