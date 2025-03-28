/* eslint-disable react/no-unknown-property */
import * as XLSX from "xlsx";
import { Table, Button, Tag, Select } from "antd";
import { FileExcelOutlined, HeartOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import Search from "antd/es/input/Search";
import { formatVND } from "@/utils/formatVND";
import { getAllDonateAPI } from "@/apis/donate";
import { fetchCampaignsAPI } from "@/apis/campaign";
import { PawPrintIcon } from "lucide-react";

const Donate = () => {
  const [donations, setDonations] = useState([]);
  const [limit] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    getCampaignOptions();
  }, []);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(donations);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Donations");
    XLSX.writeFile(
      wb,
      `pawsome-donations-${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const getCampaignOptions = async () => {
    try {
      const { data } = await fetchCampaignsAPI(1, "", "");
      setCampaigns(data.data.results);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      return [];
    }
  };

  const columns = [
    {
      title: "Người quyên góp",
      dataIndex: "user",
      key: "user",
      render: (user) => (
        <div className="flex items-center">
          <HeartOutlined style={{ color: "#f87171", marginRight: 8 }} />
          <span>{user?.username || "Người dùng ẩn danh"}</span>
        </div>
      ),
    },
    {
      title: "Mã giao dịch",
      dataIndex: "code",
      key: "code",
      render: (code) => (
        <span className="font-medium text-amber-700">{code}</span>
      ),
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => (
        <div className="font-semibold text-emerald-600">
          {formatVND(amount)}
        </div>
      ),
    },
    {
      title: "Ngày quyên góp",
      dataIndex: "createdAt",
      key: "date",
      render: (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        const hour = String(d.getHours()).padStart(2, "0");
        const minute = String(d.getMinutes()).padStart(2, "0");
        return (
          <span className="text-gray-600">
            {day}-{month}-{year} {hour}:{minute}
          </span>
        );
      },
    },
    {
      title: (
        <div className="flex items-center gap-4">
          <PawPrintIcon style={{ color: "#ea580c" }} />
          <span>Chiến dịch</span>
          <Select
            placeholder="Chọn chiến dịch"
            style={{ 
              width: 200,
              borderRadius: '20px' 
            }}
            options={campaigns?.map((campaign) => ({
              label: campaign.title,
              value: campaign._id,
            }))}
            allowClear
            onChange={(value) => {
              setSelectedCampaign(value);
              getAllDonations(1, "", value);
            }}
            dropdownStyle={{ 
              borderRadius: '12px',
              padding: '4px'
            }}
            className="pet-select"
          />
        </div>
      ),
      dataIndex: "campaign",
      key: "campaign",
      render: (campaign) => (
        <div className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full inline-block">
          {campaign?.title || "Không có chiến dịch"}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "";
        let bgColor = "";
        let text = status;
        
        switch(status) {
          case "completed":
            color = "green";
            bgColor = "bg-green-50";
            text = "Hoàn thành";
            break;
          case "cancelled":
            color = "red";
            bgColor = "bg-red-50";
            text = "Đã hủy";
            break;
          case "pending":
            color = "amber";
            bgColor = "bg-amber-50";
            text = "Đang xử lý";
            break;
          default:
            color = "gray";
            bgColor = "bg-gray-50";
        }
        
        return (
          <Tag 
            color={color}
            className={`${bgColor} border-0 rounded-full px-3 py-1 text-${color}-700`}
          >
            {text}
          </Tag>
        );
      },
    },
    {
      title: (
        <div className="flex items-center gap-4">
          <span>Nội dung</span>
          <Search
            placeholder="Tìm kiếm nội dung..."
            onSearch={(value) => {
              getAllDonations(1, value, selectedCampaign);
            }}
            style={{ 
              width: 200,
              borderRadius: '20px' 
            }}
            allowClear
            className="pet-search"
          />
        </div>
      ),
      dataIndex: "description",
      key: "description",
      width: 400,
      render: (description) => (
        <div className="text-gray-700 italic">
          &quot;{description || "Không có nội dung"}&quot;
        </div>
      ),
    },
  ];

  const getAllDonations = async (page = 1, description = "", campaign = "") => {
    try {
      const { data } = await getAllDonateAPI(
        page,
        limit,
        description,
        campaign
      );
      if (data?.data.results) {
        setTotalResults(data.data.totalResults);
      }

      const donationsData = Array.isArray(data?.data.results)
        ? data.data.results
        : [];

      setDonations(donationsData);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };
  
  useEffect(() => {
    getAllDonations(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate total donation amount
  const totalDonated = donations.reduce((sum, donation) => {
    return donation.status === "completed" ? sum + (donation.amount || 0) : sum;
  }, 0);

  return (
    <div className="p-6 bg-[#fdf2f8] min-h-screen">
      <style jsx>{`
        .ant-table {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(251, 191, 36, 0.1);
        }
        
        .ant-table-thead > tr > th {
          background:rgb(216, 137, 183) !important;
          color:rgb(95, 62, 41) !important;
          font-weight: 600;
          border-bottom: 2px solid #fde68a;
        }
        
        .ant-table-tbody > tr:hover > td {
          background: #fffbeb !important;
        }
        
        .ant-pagination-item-active {
          border-color: #f59e0b !important;
        }
        
        .ant-pagination-item-active a {
          color: #f59e0b !important;
        }
        
        .pet-select .ant-select-selector {
          border-radius: 20px !important;
          border-color: #fcd34d !important;
        }
        
        .pet-search .ant-input {
          border-radius: 20px !important;
          border-color: #fcd34d !important;
        }
        
        .ant-input-search-button {
          border-radius: 0 20px 20px 0 !important;
          background-color: #f59e0b !important;
          border-color: #f59e0b !important;
        }
      `}</style>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
            <PawPrintIcon style={{ fontSize: '28px' }} />
            Quản lý quyên góp
          </h1>
          <p className="text-amber-600 mt-2">
            Tổng số quyên góp: {totalResults} | Tổng tiền: {formatVND(totalDonated)}
          </p>
        </div>
        
        <Button
          type="primary"
          icon={<FileExcelOutlined />}
          onClick={exportToExcel}
          className="mb-4 bg-emerald-500 hover:bg-emerald-600 border-0 rounded-full px-6 py-5 h-auto flex items-center"
          style={{ backgroundColor: "#10b981", borderColor: "#10b981" }}
        >
          <span className="ml-2">Xuất ra file Excel</span>
        </Button>
      </div>
      
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-pink-50 p-4 rounded-xl border border-pink-200">
            <div className="text-pink-500 text-lg font-medium">Số lượng quyên góp</div>
            <div className="text-3xl font-bold text-pink-700 mt-2">{totalResults}</div>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
            <div className="text-amber-500 text-lg font-medium">Tổng số tiền</div>
            <div className="text-3xl font-bold text-amber-700 mt-2">{formatVND(totalDonated)}</div>
          </div>
          
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
            <div className="text-emerald-500 text-lg font-medium">Số chiến dịch</div>
            <div className="text-3xl font-bold text-emerald-700 mt-2">{campaigns.length}</div>
          </div>
        </div>
      </div>
      
      <Table
        columns={columns}
        dataSource={donations}
        rowKey="_id"
        pagination={{
          current: currentPage,
          pageSize: limit,
          total: totalResults,
          onChange: handlePageChange,
          showSizeChanger: false,
          showQuickJumper: true,
          style: { marginTop: 16 }
        }}
        className="custom-table"
        rowClassName="hover:bg-pink-50"
      />
    </div>
  );
};

export default Donate;