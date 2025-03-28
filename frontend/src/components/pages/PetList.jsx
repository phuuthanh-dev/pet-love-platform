/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { formatDistance } from "date-fns";
import { vi } from "date-fns/locale";
import { getPetsHomePageQuery } from "@/apis/pet";
import { donatePetAPI } from "@/apis/donate";
import { FE_URL } from "@/configs/globalVariables";
import { message } from "antd";
import dayjs from "dayjs";

// Pagination Component
const Pagination = ({ page, total, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="flex justify-center items-center space-x-2 mb-8">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className={`px-4 py-2 rounded-lg ${
          page === 1
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-pink-500 text-white hover:bg-pink-600"
        }`}
      >
        Trang trước
      </button>
      <span className="text-gray-600">
        Trang {page} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className={`px-4 py-2 rounded-lg ${
          page >= totalPages
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-pink-500 text-white hover:bg-pink-600"
        }`}
      >
        Trang sau
      </button>
    </div>
  );
};

function PetList() {
  const pageSize = 10;

  // State for Pet Cards
  const [cardPets, setCardPets] = useState([]);
  const [cardPage, setCardPage] = useState(1);
  const [cardTotal, setCardTotal] = useState(0);
  const [cardLoading, setCardLoading] = useState(false);

  // State for Overview Table
  const [tablePets, setTablePets] = useState([]);
  const [tablePage, setTablePage] = useState(1);
  const [tableTotal, setTableTotal] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);

  // Shared states for modal and donation
  const [selectedPet, setSelectedPet] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [donationAmount, setDonationAmount] = useState(200000);
  const [customAmount, setCustomAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter states (shared between both sections)
  const [filters, setFilters] = useState({
    health_status: "",
    vaccinated: "",
    isAdopted: "",
    breed: "",
    sortBy: "totalDonation:asc",
  });

  // Fetch pets for cards
  useEffect(() => {
    const fetchCardPets = async () => {
      setCardLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: cardPage,
          pageSize,
          ...Object.fromEntries(
            Object.entries(filters).filter(([, value]) => value !== "")
          ),
        });
        const response = await getPetsHomePageQuery(queryParams);
        setCardTotal(response.data.data.totalResults);
        setCardPets(response.data.data.results);
      } catch (error) {
        console.error("Error fetching card pets:", error);
      } finally {
        setCardLoading(false);
      }
    };
    fetchCardPets();
  }, [cardPage, pageSize, filters]);

  // Fetch pets for table
  useEffect(() => {
    const fetchTablePets = async () => {
      setTableLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: tablePage,
          pageSize,
          ...Object.fromEntries(
            Object.entries(filters).filter(([, value]) => value !== "")
          ),
        });
        const response = await getPetsHomePageQuery(queryParams);
        setTableTotal(response.data.data.totalResults);
        setTablePets(response.data.data.results);
      } catch (error) {
        console.error("Error fetching table pets:", error);
      } finally {
        setTableLoading(false);
      }
    };
    fetchTablePets();
  }, [tablePage, pageSize, filters]);

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCardPage(1); // Reset card pagination
    setTablePage(1); // Reset table pagination
  };

  const handleOpenDetails = (pet) => {
    setSelectedPet(pet);
    setOpenDialog(true);
    setDonationAmount("");
    setCustomAmount("");
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAmountSelect = (amount) => {
    setDonationAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setCustomAmount(value);
    if (value) {
      setDonationAmount(parseInt(value, 10));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleDonation = async () => {
    if (!donationAmount || donationAmount < 10000) {
      message.error("Vui lòng nhập số tiền quyên góp tối thiểu 10,000 VND");
      return;
    }
    if (!selectedPet) return;

    setIsProcessing(true);
    try {
      const description = "Pet donation";
      const isAnonymous = false;
      const returnUrl = `${FE_URL}/pets`;
      const cancelUrl = `${FE_URL}/donate/pet/cancel`;

      const response = await donatePetAPI(
        donationAmount,
        description,
        isAnonymous,
        selectedPet._id,
        returnUrl,
        cancelUrl
      );

      if (response.status === 200) {
        window.location.href = response.data.paymentLink.checkoutUrl;
      }
    } catch (error) {
      console.error("Error creating payment link:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-pink-600 font-serif">
              Những người bạn đáng yêu
            </h1>
            <p className="text-lg text-pink-500 mb-8 max-w-3xl mx-auto">
              Mỗi sự đóng góp của bạn sẽ mang lại niềm vui và hạnh phúc cho
              những người bạn bốn chân này 🐾
            </p>
          </div>

          {/* Filter Section */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Bộ lọc tìm kiếm
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <select
                className="border rounded-lg px-3 py-2"
                value={filters.health_status}
                onChange={(e) =>
                  handleFilterChange("health_status", e.target.value)
                }
              >
                <option value="">Tình trạng sức khỏe</option>
                <option value="Healthy">Khỏe mạnh</option>
                <option value="Sick">Bệnh</option>
                <option value="Recovering">Đang hồi phục</option>
                <option value="Injured">Bị thương</option>
              </select>

              <select
                className="border rounded-lg px-3 py-2"
                value={filters.vaccinated}
                onChange={(e) =>
                  handleFilterChange("vaccinated", e.target.value)
                }
              >
                <option value="">Tiêm phòng</option>
                <option value="true">Đã tiêm</option>
                <option value="false">Chưa tiêm</option>
              </select>

              <select
                className="border rounded-lg px-3 py-2"
                value={filters.breed}
                onChange={(e) => handleFilterChange("breed", e.target.value)}
              >
                <option value="">Giống loài</option>
                <option value="dog">Chó</option>
                <option value="cat">Mèo</option>
                <option value="bird">Chim</option>
                <option value="other">Khác</option>
              </select>

              <select
                className="border rounded-lg px-3 py-2"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              >
                <option value="totalDonation:asc">
                  Ưu tiên cần quyên góp nhiều nhất
                </option>
                <option value="totalDonation:desc">
                  Đã quyên góp nhiều nhất
                </option>
                <option value="createdAt:desc">Mới nhất</option>
                <option value="createdAt:asc">Cũ nhất</option>
              </select>
            </div>
          </div>

          {/* Pet Cards Grid */}
          {cardLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
            </div>
          )}
          {!cardLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {cardPets.map((pet) => (
                <div
                  key={pet._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-pink-100 transform hover:-translate-y-1"
                >
                  <div className="h-64 overflow-hidden relative group">
                    <img
                      src={pet.image_url[0][0]}
                      alt={pet.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          pet.isAdopted
                            ? "bg-green-100 text-green-800"
                            : "bg-pink-100 text-pink-800"
                        }`}
                      >
                        {pet.isAdopted
                          ? "Đã được nhận nuôi"
                          : "Đang chờ nhận nuôi"}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-3 text-pink-600">
                      {pet.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-pink-50 text-pink-700">
                        {pet.age} tuổi
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium 
                        ${
                          pet.health_status === "Healthy"
                            ? "bg-green-100 text-green-800"
                            : pet.health_status === "Recovering"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {pet.health_status}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                        {pet.coat}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-6 line-clamp-2 h-12">
                      {pet.description}
                    </p>
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-pink-700">
                          Đã được quyên góp
                        </span>
                        <span className="text-pink-600 font-semibold">
                          {formatCurrency(pet.totalDonation)}
                        </span>
                      </div>
                      <div className="w-full bg-pink-100 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            pet.totalDonation >= pet.donationGoal
                              ? "bg-green-500"
                              : "bg-pink-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              100,
                              (pet.totalDonation / (pet.donationGoal * 1.2)) *
                                100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-xs text-pink-600">
                          Cần: {formatCurrency(pet.donationGoal)}
                        </span>
                        <span className="text-xs text-pink-600">
                          Còn thiếu:{" "}
                          {formatCurrency(
                            Math.max(0, pet.donationGoal - pet.totalDonation)
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-pink-100">
                      <span className="text-xs text-pink-500">
                        {formatDistance(new Date(pet.createdAt), new Date(), {
                          locale: vi,
                          addSuffix: true,
                        })}
                      </span>
                      <button
                        onClick={() => handleOpenDetails(pet)}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full text-sm transition-colors font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-transform duration-200"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!cardLoading && cardTotal === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                Không tìm thấy thú cưng nào phù hợp với bộ lọc
              </p>
            </div>
          )}
          {!cardLoading && cardTotal > 0 && (
            <Pagination
              page={cardPage}
              total={cardTotal}
              pageSize={pageSize}
              onPageChange={setCardPage}
            />
          )}
          {/* Overview Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12 border border-pink-100">
            <h2 className="text-2xl font-bold p-6 bg-pink-50 text-pink-700 border-b border-pink-100">
              Danh sách tổng quan
            </h2>
            {tableLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
              </div>
            )}
            {!tableLoading && (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-pink-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-pink-700">
                        Tên
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-pink-700">
                        Tình trạng
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-pink-700">
                        Mục tiêu quyên góp
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-pink-700">
                        Đã quyên góp
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-pink-700">
                        Đã chi tiêu
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-pink-700">
                        Còn lại
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-pink-700">
                        Chi tiết
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-100">
                    {tablePets.map((pet) => (
                      <tr
                        key={pet._id}
                        className="hover:bg-pink-50 transition-colors"
                      >
                        <td className="flex items-center space-x-2 px-6 py-4 text-sm text-gray-900 font-medium">
                          <img
                            src={
                              pet.image_url?.[0]?.[0] ||
                              "https://via.placeholder.com/40"
                            }
                            alt={pet.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span>{pet.name}</span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              pet.health_status === "Healthy"
                                ? "bg-green-100 text-green-800"
                                : pet.health_status === "Recovering"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {pet.health_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-pink-600 font-medium text-right">
                          {formatCurrency(pet.donationGoal)}
                        </td>
                        <td className="px-6 py-4 text-sm text-pink-600 font-medium text-right">
                          {formatCurrency(pet.totalDonation)}
                        </td>
                        <td className="px-6 py-4 text-sm text-pink-600 font-medium text-right">
                          {formatCurrency(pet.totalExpenses)}
                        </td>
                        <td className="px-6 py-4 text-sm text-right">
                          <span
                            className={
                              pet.totalDonation - pet.totalExpenses > 0
                                ? "text-green-600 font-medium"
                                : "text-red-600 font-medium"
                            }
                          >
                            {formatCurrency(pet.remainingFunds)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-center">
                          <button
                            onClick={() => handleOpenDetails(pet)}
                            className="bg-pink-100 hover:bg-pink-200 text-pink-700 px-4 py-2 rounded-full transition-colors font-medium"
                          >
                            Chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {!tableLoading && tableTotal === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Không tìm thấy thú cưng nào phù hợp với bộ lọc
                </p>
              </div>
            )}
            {!tableLoading && tableTotal > 0 && (
              <Pagination
                page={tablePage}
                total={tableTotal}
                pageSize={pageSize}
                onPageChange={setTablePage}
              />
            )}
          </div>

          {/* Pet Details Modal */}
          {openDialog && selectedPet && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center z-10">
                  <h2 className="text-2xl font-bold text-pink-600">
                    {selectedPet.name}
                  </h2>
                  <button
                    onClick={handleCloseDialog}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <div className="relative rounded-xl overflow-hidden h-64 mb-4">
                        <img
                          src={selectedPet.image_url[0][0]}
                          alt={selectedPet.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${
                              selectedPet.isAdopted
                                ? "bg-green-100 text-green-800"
                                : "bg-pink-100 text-pink-800"
                            }`}
                          >
                            {selectedPet.isAdopted
                              ? "Đã được nhận nuôi"
                              : "Đang chờ nhận nuôi"}
                          </span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800">
                          Mô tả
                        </h3>
                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                          {selectedPet.description}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800">
                          Thông tin cơ bản
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-pink-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </span>
                            <div>
                              <p className="text-sm text-gray-500">Tuổi</p>
                              <p className="font-medium">
                                {selectedPet.age} tuổi
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-pink-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </span>
                            <div>
                              <p className="text-sm text-gray-500">Sức khỏe</p>
                              <p className="font-medium">
                                {selectedPet.health_status}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-pink-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                                />
                              </svg>
                            </span>
                            <div>
                              <p className="text-sm text-gray-500">
                                Kích thước
                              </p>
                              <p className="font-medium">{selectedPet.size}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-pink-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                />
                              </svg>
                            </span>
                            <div>
                              <p className="text-sm text-gray-500">Màu lông</p>
                              <p className="font-medium">{selectedPet.coat}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-pink-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </span>
                            <div>
                              <p className="text-sm text-gray-500">Tính cách</p>
                              <p className="font-medium">
                                {selectedPet.temperament}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-pink-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                />
                              </svg>
                            </span>
                            <div>
                              <p className="text-sm text-gray-500">
                                Tiêm phòng
                              </p>
                              <p className="font-medium">
                                {selectedPet.vaccinated
                                  ? "Đã tiêm"
                                  : "Chưa tiêm"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Donation Box */}
                      <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
                        <h3 className="text-lg font-semibold mb-3 text-pink-700">
                          Quyên góp cho {selectedPet.name}
                        </h3>

                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-sm text-gray-500">
                              Đã quyên góp / Mục tiêu
                            </p>
                            <p className="font-semibold">
                              {formatCurrency(selectedPet.totalDonation)} /{" "}
                              {formatCurrency(selectedPet.donationGoal)}
                            </p>
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                            <div
                              className={`h-2.5 rounded-full ${
                                selectedPet.totalDonation >=
                                selectedPet.donationGoal
                                  ? "bg-green-500"
                                  : "bg-pink-500"
                              }`}
                              style={{
                                width: `${Math.min(
                                  100,
                                  (selectedPet.totalDonation /
                                    selectedPet.donationGoal) *
                                    100
                                )}%`,
                              }}
                            ></div>
                          </div>

                          <p className="text-right text-sm text-gray-500 mb-4">
                            {selectedPet.totalDonation >=
                            selectedPet.donationGoal
                              ? "Đã đạt mục tiêu!"
                              : `Còn thiếu: ${formatCurrency(
                                  selectedPet.donationGoal -
                                    selectedPet.totalDonation
                                )}`}
                          </p>
                          <p>
                            Đã chi tiêu cho {selectedPet.name}:{" "}
                            <span className="font-semibold text-pink-600">
                              {formatCurrency(selectedPet.totalExpenses)}
                            </span>
                          </p>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Chọn số tiền quyên góp:
                          </label>
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            {[50000, 100000, 200000, 500000, 1000000].map(
                              (amount) => (
                                <button
                                  key={amount}
                                  type="button"
                                  onClick={() => handleAmountSelect(amount)}
                                  className={`py-2 px-2 text-center rounded-lg text-sm font-medium transition-colors ${
                                    donationAmount === amount
                                      ? "bg-pink-500 text-white"
                                      : "bg-white text-pink-600 border border-pink-200 hover:bg-pink-50"
                                  }`}
                                >
                                  {formatCurrency(amount)}
                                </button>
                              )
                            )}
                            <button
                              type="button"
                              onClick={() =>
                                handleAmountSelect(
                                  Math.max(
                                    10000,
                                    selectedPet.donationGoal -
                                      selectedPet.totalDonation
                                  )
                                )
                              }
                              className={`py-2 col-span-3 px-4 text-center rounded-lg text-sm font-medium transition-colors ${
                                donationAmount ===
                                Math.max(
                                  10000,
                                  selectedPet.donationGoal -
                                    selectedPet.totalDonation
                                )
                                  ? "bg-green-500 text-white"
                                  : "bg-white text-green-600 border border-green-200 hover:bg-green-50"
                              }`}
                            >
                              {selectedPet.totalDonation >=
                              selectedPet.donationGoal
                                ? "Quyên góp thêm"
                                : `Quyên góp đủ (${formatCurrency(
                                    selectedPet.donationGoal -
                                      selectedPet.totalDonation
                                  )})`}
                            </button>
                          </div>

                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Hoặc nhập số tiền tùy chọn:
                            </label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 pointer-events-none">
                                VND
                              </span>
                              <input
                                type="text"
                                value={customAmount}
                                onChange={handleCustomAmountChange}
                                placeholder="Nhập số tiền quyên góp"
                                className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Số tiền tối thiểu: 10,000 VND
                            </p>
                          </div>

                          <button
                            onClick={handleDonation}
                            disabled={!donationAmount || isProcessing}
                            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                              !donationAmount || isProcessing
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-pink-600 hover:bg-pink-700"
                            }`}
                          >
                            {isProcessing
                              ? "Đang xử lý..."
                              : `Quyên góp ${
                                  donationAmount
                                    ? formatCurrency(donationAmount)
                                    : ""
                                }`}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expense History */}
                  {/* Expense History */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">
                      Lịch sử chi tiêu
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      {selectedPet.expenses?.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                          {selectedPet.expenses.map((expense, index) => (
                            <div
                              key={index}
                              className="py-4 grid grid-cols-[50px_1fr_150px_200px_150px] items-center hover:bg-gray-100 transition-colors rounded-lg px-2"
                            >
                              {/* Icon */}
                              <div className="flex justify-center">
                                <div className="bg-pink-100 p-2 rounded-full">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-pink-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 100-4 2 2 0 000 4z"
                                    />
                                  </svg>
                                </div>
                              </div>

                              {/* Thông tin chi tiêu */}
                              <div>
                                <p className="text-sm font-medium text-gray-800">
                                  {expense.type.name}
                                </p>
                                <p className="text-sm text-gray-800 py-1">
                                  Người thêm: {expense.createdBy.username}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {dayjs(expense.date).format(
                                    "DD/MM/YYYY hh:mm:ss"
                                  )}
                                </p>
                              </div>

                              {/* Trạng thái */}
                              <div
                                className={`text-${
                                  expense?.status === "Pending"
                                    ? "blue"
                                    : expense?.status === "Completed"
                                    ? "green"
                                    : expense?.status === "Waiting for Review"
                                    ? "yellow"
                                    : expense?.status === "Receipt Pending"
                                    ? "orange"
                                    : "red"
                                }-500 text-sm text-center`}
                              >
                                {expense?.status === "Pending"
                                  ? "Chờ duyệt"
                                  : expense?.status === "Completed"
                                  ? "Đã hoàn thành"
                                  : expense?.status === "Waiting for Review"
                                  ? "Chờ kiểm tra hóa đơn"
                                  : expense?.status === "Receipt Pending"
                                  ? "Chờ hóa đơn"
                                  : "Từ chối"}
                              </div>

                              {/* Hóa đơn */}
                              <div className="flex justify-center">
                                {expense.receipt ? (
                                  <img
                                    src={expense.receipt}
                                    alt="Hóa đơn"
                                    className="w-16 h-16 object-cover rounded-lg cursor-pointer"
                                    onClick={() =>
                                      window.open(expense.receipt, "_blank")
                                    }
                                  />
                                ) : (
                                  <span className="text-center">
                                    Không có hóa đơn
                                  </span>
                                )}
                              </div>

                              {/* Số tiền */}
                              <div className="text-sm font-semibold text-pink-600 text-right">
                                {formatCurrency(expense.amount)}
                              </div>
                            </div>
                          ))}

                          {/* Total Expenses Summary */}
                          <div className="pt-4 mt-4 border-t border-gray-200 flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">
                              Tổng chi tiêu
                            </span>
                            <span className="text-lg font-bold text-pink-600">
                              {formatCurrency(selectedPet.totalExpenses)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6 bg-white rounded-lg">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 mx-auto text-pink-300 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                            />
                          </svg>
                          <p className="text-gray-500 italic">
                            Chưa có dữ liệu chi tiêu
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Care Team Feedback */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">
                      Phản hồi từ đội ngũ chăm sóc
                    </h3>
                    {selectedPet.careTeamFeedback?.length > 0 ? (
                      <div className="space-y-4">
                        {selectedPet.careTeamFeedback.map((feedback, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 p-4 rounded-lg border-l-4 border-pink-400"
                          >
                            <p className="text-gray-700">{feedback.message}</p>
                            <p className="text-gray-500 text-sm mt-2">
                              {feedback.date}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic bg-gray-50 p-4 rounded-lg border border-gray-200">
                        Chưa có phản hồi từ đội ngũ chăm sóc
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PetList;
