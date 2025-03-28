import { useEffect, useState } from "react";
import { getPetNotApprovedAPI, approvePetAPI } from "@/apis/pet";
import { Button } from "@/components/ui/button";
import { Pagination, Select } from "antd";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-rotate.css";
import "lightgallery/css/lg-share.css";
import "lightgallery/css/lg-autoplay.css";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import lgRotate from "lightgallery/plugins/rotate";
import lgShare from "lightgallery/plugins/share";
import lgAutoplay from "lightgallery/plugins/autoplay";
const ApprovePet = () => {
  const [pets, setPets] = useState([]);
  const { Option } = Select;
  const [itemsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPetNotApprovedAPI();
        setPets(response.data.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };
    fetchData();
  }, []);

  const handleApprove = async (petId) => {
    try {
      await approvePetAPI(petId);
      setPets((prevPets) => prevPets.filter((pet) => pet._id !== petId));
    } catch (error) {
      console.error("Error approving pet:", error);
    }
  };

  const handleSortCategory = (value) => {
    if (value === "asc") {
      setPets((prevPets) =>
        [...prevPets].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      );
    } else if (value === "desc") {
      setPets((prevPets) =>
        [...prevPets].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      );
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-pink-50 to-white min-h-screen">
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border-2 border-pink-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🐾</span>
            <h1 className="text-2xl font-bold text-amber-800">
              Danh sách thú cưng chờ duyệt
            </h1>
          </div>
          <Select
            defaultValue=""
            onChange={handleSortCategory}
            style={{ width: "200px" }}
            className="border-pink-200"
          >
            <Option value="">Không sắp xếp</Option>
            <Option value="asc">Sắp xếp theo ngày (Tăng dần)</Option>
            <Option value="desc">Sắp xếp theo ngày (Giảm dần)</Option>
          </Select>
        </div>

        <div className="bg-pink-50 p-4 mb-6 rounded-lg border border-pink-100">
          <div className="flex items-center gap-2 text-pink-700">
            <ExclamationCircleOutlined />
            <span>
              Tổng số thú cưng chờ duyệt: <strong>{pets.length}</strong> | Trang hiện
              tại: <strong>{currentPage}</strong>
            </span>
          </div>
        </div>

        {pets.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Không có thú cưng nào đang chờ duyệt.</p>
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
                {pets
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((pet, index) => (
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
                        {pet.breed.name}
                      </td>
                      <td className="px-6 py-4 capitalize text-sm border-b border-pink-100 border-r">
                        <span className={`font-bold ${
                          pet.health_status === "Healthy" ? "text-green-500" :
                          pet.health_status === "Sick" ? "text-red-500" :
                          pet.health_status === "Injured" ? "text-orange-500" :
                          pet.health_status === "Recovering" ? "text-blue-500" :
                          "text-gray-700"
                        }`}>
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
                        <Button
                          onClick={() => handleApprove(pet._id)}
                          className="border-pink-500 bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white hover:border-pink-600"
                        >
                          Duyệt
                        </Button>
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
            total={pets.length}
            onChange={setCurrentPage}
            className="custom-pagination"
          />
        </div>
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
      `}</style>
    </div>
  );
};

export default ApprovePet;
