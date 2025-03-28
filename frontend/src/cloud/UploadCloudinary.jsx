/* eslint-disable react/prop-types */
import { useState } from "react";

const ImageUpload = ({ onAnalysisResult }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [infor, setInfor] = useState(null);

  const uploadImage = async () => {
    setLoading(true);
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "cr2sv2gr");
    data.append("cloud_name", "djfpcyyfe");
    data.append("folder", "Cloudinary-React");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/djfpcyyfe/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const res = await response.json();
      console.log(res);
      await detectImage(res?.secure_url);
      setLoading(false);
    } catch (error) {
      console.error("Upload error:", error);
      setLoading(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      setPreview(reader.result);
    };
  };

  const handleResetClick = () => {
    setPreview(null);
    setImage(null);
    setInfor(null);
  };

  const detectImage = async (imageUrl) => {
    try {
      const response = await fetch("http://localhost:8080/detect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image_url: imageUrl }),
      });

      const result = await response.json();
      setInfor(result?.detected_objects);
      onAnalysisResult(result?.detected_objects);
    } catch (error) {
      console.error("Error detecting image: ", error);
    }
  };

  return (
    <div className="px-4 sm:px-8 md:px-16 py-6">
      <div className="container mx-auto max-w-screen-lg">
        {/* Upload Area */}
        <div className={`${preview ? 'border-pink-400' : 'border-[#eb9ecd]'} border-dashed border-3 rounded-xl bg-pink-50 transition-all duration-300 hover:border-[#d985b9]`} style={{backgroundColor: '#fdf2f8'}}>
          <div className="py-8 flex flex-col justify-center items-center">
            {!preview ? (
              <>
                <div className="mb-4 text-[#eb9ecd]">
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.5 12c0 .28-.05.54-.09.8l1.61 1.25c.35.27.46.75.27 1.12l-1.5 2.6c-.19.35-.64.48-1.02.34l-1.91-.77c-.42.32-.86.58-1.36.78L15 20c-.05.4-.4.73-.8.73h-3c-.41 0-.75-.32-.81-.73l-.39-2.08c-.5-.2-.93-.46-1.35-.78l-1.93.77c-.36.15-.82.02-1.01-.34l-1.5-2.6c-.18-.37-.07-.84.28-1.11l1.61-1.24c-.05-.28-.09-.55-.09-.82 0-.28.04-.56.09-.82L4.5 10.8c-.35-.31-.44-.79-.28-1.16l1.5-2.6c.19-.35.64-.48 1.01-.34l1.93.77c.42-.32.85-.58 1.35-.78L10.4 4c.06-.41.4-.73.81-.73h3c.41 0 .75.32.81.74l.39 2.07c.5.2.93.46 1.35.78l1.92-.77c.36-.15.82-.02 1.01.34l1.5 2.6c.18.37.07.84-.28 1.11l-1.61 1.24c.05.26.09.54.09.82zM11.99 16c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/>
                  </svg>
                </div>
                <p className="mb-3 text-lg font-semibold text-[#c06ba0] flex flex-wrap justify-center">
                  <span className="flex items-center"><span className="mr-2">🐾</span>Tải lên ảnh chó cưng của bạn</span>
                </p>
                <p className="text-[#d985b9] text-sm text-center mb-4">
                  Chúng tôi sẽ phân tích và cho bạn biết thông tin về giống chó
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-4">
                <div className="relative">
                  <img src={preview} alt="preview" className="max-h-64 rounded-lg shadow-md" />
                  <div className="absolute -bottom-3 -right-3 bg-pink-100 rounded-full p-1 shadow-md">
                    <span className="text-2xl">🐶</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col items-center mt-4">
              <input
                id="hidden-input"
                type="file"
                className="hidden"
                onChange={handleImageChange}
                accept="image/*"
              />
              <label htmlFor="hidden-input" className="cursor-pointer mb-2">
                <div className="rounded-full px-6 py-2 text-white font-medium transition-all duration-200 transform hover:scale-105 flex items-center" style={{backgroundColor: '#eb9ecd', boxShadow: '0 2px 4px rgba(235, 158, 205, 0.4)'}}>
                  <span className="mr-2">📷</span>
                  {preview ? 'Chọn ảnh khác' : 'Chọn ảnh'}
                </div>
              </label>
              <p className="text-xs text-[#d985b9] mt-1">
                Hỗ trợ: JPG, PNG, JPEG
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={uploadImage}
            className="rounded-full px-6 py-2 text-white font-medium transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
            disabled={!image}
            style={{backgroundColor: '#eb9ecd', boxShadow: '0 2px 4px rgba(235, 158, 205, 0.4)'}}
          >
            <span className="mr-2">🔍</span>
            Phân tích ngay
          </button>
          <button
            onClick={handleResetClick}
            className="rounded-full px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-all duration-200 flex items-center"
          >
            <span className="mr-2">↺</span>
            Làm mới
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center mt-6 bg-pink-50 p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-8 h-8 border-4 border-pink-200 rounded-full animate-spin" style={{borderTopColor: '#eb9ecd'}}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs">🐾</div>
              </div>
              <span className="text-[#c06ba0] font-medium">Đang phân tích...</span>
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {infor && (
        <div className="mt-8 bg-pink-50 rounded-xl overflow-hidden shadow-lg">
          <div className="p-4 text-white" style={{backgroundColor: '#eb9ecd'}}>
            <h2 className="text-2xl font-bold flex items-center">
              <span className="mr-2">🔎</span> Kết quả phân tích
            </h2>
            <p className="text-pink-100">Chúng tôi đã xác định được giống chó của bạn</p>
          </div>
          
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/2 p-4">
              <div className="relative">
                <img
                  src={infor?.image}
                  alt="Dog"
                  className="w-full h-auto rounded-lg shadow-md"
                />
                <div className="absolute top-4 right-4 text-white rounded-full px-3 py-1 text-sm font-bold shadow-md" style={{backgroundColor: '#eb9ecd'}}>
                  {infor?.breed}
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 flex flex-wrap">
              <div className="w-full md:w-1/2 p-4 text-white rounded-tl-lg md:rounded-none" style={{backgroundColor: '#ee9fd0'}}>
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">📋</span>
                  <h2 className="font-bold text-lg">Giới thiệu</h2>
                </div>
                <p className="mt-2"><span className="font-medium">Thuộc dòng:</span> {infor?.name}</p>
                <p><span className="font-medium">Tuổi thọ:</span> {infor?.life_span} năm</p>
                <p>
                  <span className="font-medium">Kích thước:</span>{" "}
                  {infor?.size === 1
                    ? "Nhỏ"
                    : infor?.size === 2
                    ? "Trung bình"
                    : "Lớn"}
                </p>
                <a href="#" className="mt-3 inline-block px-3 py-1 rounded-full text-sm font-medium text-white no-underline transition-colors" style={{backgroundColor: '#eb9ecd'}}>
                  Xem thêm
                </a>
              </div>
              
              <div className="w-full md:w-1/2 p-4 bg-pink-50 rounded-tr-lg md:rounded-none">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">😊</span>
                  <h2 className="font-bold text-lg text-[#c06ba0]">Tính Cách</h2>
                </div>
                <p className="mt-2 text-[#d985b9]">{infor?.temperament}</p>
                <a href="#" className="mt-3 inline-block px-3 py-1 rounded-full text-sm font-medium text-white no-underline transition-colors" style={{backgroundColor: '#eb9ecd'}}>
                  Xem thêm
                </a>
              </div>
              
              <div className="w-full md:w-1/2 p-4 bg-pink-50 rounded-bl-lg md:rounded-none">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">🧼</span>
                  <h2 className="font-bold text-lg text-[#c06ba0]">Chăm Sóc</h2>
                </div>
                <p className="mt-2 text-[#d985b9]">{infor?.take_care}</p>
                <a href="#" className="mt-3 inline-block px-3 py-1 rounded-full text-sm font-medium text-white no-underline transition-colors" style={{backgroundColor: '#eb9ecd'}}>
                  Xem thêm
                </a>
              </div>
              
              <div className="w-full md:w-1/2 p-4 text-white rounded-br-lg md:rounded-none" style={{backgroundColor: '#ee9fd0'}}>
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">🏥</span>
                  <h2 className="font-bold text-lg">Bệnh Thường Gặp</h2>
                </div>
                <p className="mt-2">{infor?.sick}</p>
                <a href="#" className="mt-3 inline-block px-3 py-1 rounded-full text-sm font-medium text-white no-underline transition-colors" style={{backgroundColor: '#eb9ecd'}}>
                  Xem thêm
                </a>
              </div>
            </div>
            
            <div className="w-full p-6 bg-white">
              <h1 className="font-bold text-xl mb-3 text-[#c06ba0] flex items-center">
                <span className="text-2xl mr-2">📚</span> Thông Tin Thêm
              </h1>
              <p className="text-gray-700 leading-relaxed">{infor?.des}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;