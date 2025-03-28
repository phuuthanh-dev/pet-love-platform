import { useEffect, useState } from "react";
import SubmittedPetTable from "./SubmittedPetTable";
import { getPetBySubmittedIdAPI } from "@/apis/pet";

const SubmittedPetList = () => {
  const [petData, setPetData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 5; // Giới hạn mỗi trang, khớp với response

  // Hàm gọi API
  const fetchPets = async (currentPage) => {
    setLoading(true);
    try {
      const response = await getPetBySubmittedIdAPI(
        "678c9f1df7e89c3a0a9c1a67",
        {
          page: currentPage,
          limit,
        }
      );
      setPetData(response.data); // Lưu dữ liệu từ API
    } catch (error) {
      console.error("Error fetching submitted pets:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi page thay đổi
  useEffect(() => {
    fetchPets(page);
  }, [page]);

  // Hàm xử lý chuyển trang
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading) {
    return <div className="text-center py-4">Đang tải...</div>;
  }

  if (!petData) {
    return <div className="text-center py-4">Không có dữ liệu</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Danh sách thú cưng đã gửi</h2>
      <SubmittedPetTable data={petData} onPageChange={handlePageChange} />
    </div>
  );
};

export default SubmittedPetList;
