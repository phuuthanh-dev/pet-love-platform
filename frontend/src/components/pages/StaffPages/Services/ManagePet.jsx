import { Input, Pagination, Select } from "antd";
import { useEffect, useState } from "react";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-rotate.css";
import "lightgallery/css/lg-share.css";
import "lightgallery/css/lg-autoplay.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import lgRotate from "lightgallery/plugins/rotate";
import lgShare from "lightgallery/plugins/share";
import lgAutoplay from "lightgallery/plugins/autoplay";
import { getPetApprovedAPI } from "@/apis/pet";
import { Button } from "@/components/ui/button";
import EditPetModal from "./EditPetModal";
import CreateAdoptPostModal from "./CreateAdoptPostModal";
import { ExclamationCircleOutlined, SearchOutlined } from "@ant-design/icons";


const ManagePet = () => {
  const [pets, setPets] = useState([]);
  const [totalPets, setTotalPets] = useState(0);
  const { Option } = Select;
  const [itemsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPets, setFilteredPets] = useState([]);
  const [editingPet, setEditingPet] = useState(null);
  const [petCreatePost, setPetCreatePost] = useState(null);
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt:desc"); // Default sort
  const { Search } = Input;


  const fetchPets = async (page = 1, limit = itemsPerPage, sort = sortBy) => {
    try {
      const response = await getPetApprovedAPI(page, limit, sort);
      const fetchedPets = response.data.data.results;
      setPets(fetchedPets);
      setTotalPets(response.data.data.totalResults);
      setFilteredPets(fetchedPets);
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  useEffect(() => {
    fetchPets(currentPage, itemsPerPage, sortBy);
  }, [currentPage, sortBy, editingPet]);

  // Handle sort change
  const handleSortCategory = (value) => {
    setSortBy(value);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  // Handle search
  const handleSearch = (value) => {
    if (!value) {
      setFilteredPets(pets);
      return;
    }
    const newFilteredPets = pets.filter((pet) =>
      pet.breed.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPets(newFilteredPets);
  };

  // Handle post creation completion
  const handlePostCreated = () => {
    setOpenCreatePost(false);
    setPetCreatePost(null);
    fetchPets(currentPage, itemsPerPage, sortBy);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6 bg-gradient-to-b from-pink-50 to-white min-h-screen">
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border-2 border-pink-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🐾</span>
            <h1 className="text-2xl font-bold text-amber-800">
              Quản lý thú cưng
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Search
              placeholder="Tìm kiếm theo giống..."
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 200 }}
              allowClear
              prefix={<SearchOutlined style={{ color: "#f472b6" }} />}
            />
            <Select
              value={sortBy}
              onChange={handleSortCategory}
              style={{ width: "200px" }}
              className="border-pink-200"
            >
              <Option value="createdAt:asc">Sắp xếp theo ngày (Tăng dần)</Option>
              <Option value="createdAt:desc">Sắp xếp theo ngày (Giảm dần)</Option>
            </Select>
          </div>
        </div>

        <div className="bg-pink-50 p-4 mb-6 rounded-lg border border-pink-100">
          <div className="flex items-center gap-2 text-pink-700">
            <ExclamationCircleOutlined />
            <span>
              Tổng số thú cưng: <strong>{totalPets}</strong> | Trang hiện
              tại: <strong>{currentPage}</strong>
            </span>
          </div>
        </div>

        {filteredPets.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Không có thú cưng nào.</p>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="min-w-full bg-white border border-pink-200 rounded-md pet-friendly-table">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase border-b border-pink-200 border-r">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase border-b border-pink-200 border-r">
                    Tên thú cưng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase border-b border-pink-200 border-r">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase border-b border-pink-200 border-r">
                    Tình trạng sức khỏe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase border-b border-pink-200 border-r">
                    Đã tiêm chủng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase border-b border-pink-200 border-r">
                    Hình ảnh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase border-b border-pink-200 border-r">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase border-b border-pink-200 border-r">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPets
                 .map((pet, index) =>(
                    <tr
                      key={pet._id}
                      className={index % 2 === 0 ? "bg-pink-50/30" : "bg-white"}
                    >
                      <td className="px-6 py-4 capitalize text-sm text-gray-700 border-b border-pink-100 border-r">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 capitalize text-sm text-gray-700 border-b border-pink-100 border-r">
                        {pet.name}
                      </td>
                      <td className="px-6 py-4 capitalize text-sm text-gray-700 border-b border-pink-100 border-r">
                        {pet.breed?.name}
                      </td>
                      <td className="px-6 py-4 capitalize text-sm border-b border-pink-100 border-r">
                        <span
                          className={`${pet.health_status === "Healthy"
                              ? "text-green-500 font-bold"
                              : pet.health_status === "Sick"
                                ? "text-red-500 font-bold"
                                : pet.health_status === "Injured"
                                  ? "text-orange-500 font-bold"
                                  : pet.health_status === "Recovering"
                                    ? "text-blue-500 font-bold"
                                    : "text-gray-700 font-bold"
                            }`}
                        >
                          {pet.health_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 capitalize text-sm text-gray-700 border-b border-pink-100 border-r">
                        {pet.vaccinated ? "Có" : "Không"}
                      </td>

                      <td className="px-6 py-4 capitalize text-sm text-gray-700 border-b border-pink-100 border-r">
                        <LightGallery
                          speed={500}
                          plugins={[
                            lgThumbnail,
                            lgZoom,
                            lgRotate,
                            lgShare,
                            lgAutoplay,
                          ]}
                        >
                          <a href={pet.image_url[0]}>
                            <img
                              src={pet.image_url[0]}
                              alt="Pet-0"
                              className="h-12 w-12 object-cover rounded-md cursor-pointer mx-1 border border-pink-200"
                            />
                          </a>
                          {pet.image_url.slice(1).map((image, idx) => (
                            <a
                              href={image}
                              key={idx + 1}
                              style={{ display: "none" }}
                            >
                              <img
                                src={image}
                                alt={`Pet-${idx + 1}`}
                                className="h-12 w-12 object-cover rounded-md cursor-pointer mx-1"
                              />
                            </a>
                          ))}
                        </LightGallery>
                      </td>
                      <td className="px-6 py-4 capitalize text-sm text-gray-700 border-b border-pink-100 border-r">
                        {new Date(pet.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 capitalize text-sm text-gray-700 border-b border-pink-100 border-r">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setEditingPet(pet)}
                            className="border-pink-500 bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white hover:border-pink-600"
                          >
                            Sửa
                          </Button>
                          {!pet.isAddPost ? (
                            <Button
                              onClick={() => {
                                setOpenCreatePost(true);
                                setPetCreatePost(pet);
                              }}
                              className="border-amber-500 bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white hover:border-amber-600"
                            >
                              Tạo bài đăng
                            </Button>
                          ) : null}
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
            total={totalPets}
            onChange={handlePageChange}
            className="custom-pagination"
          />
        </div>

        {editingPet && (
          <EditPetModal
            visible={!!editingPet}
            pet={editingPet}
            onClose={() => setEditingPet(null)}
            onUpdate={() => fetchPets(currentPage, itemsPerPage, sortBy)}
          />
        )}

        <CreateAdoptPostModal
          open={openCreatePost}
          setOpen={setOpenCreatePost}
          pet={petCreatePost}
          onPostCreated={handlePostCreated}
        />
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
        
        .ant-input-affix-wrapper {
          border-color: #f9a8d4 !important;
        }
        
        .ant-input-affix-wrapper:hover {
          border-color: #f472b6 !important;
        }
      `}</style>
    </div>
  );
};

export default ManagePet;
