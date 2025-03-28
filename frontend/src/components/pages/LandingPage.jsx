import { useEffect, useState } from "react";
import SimpleSlider from "../core/Carousel";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
// import { SimpleSlider } from "./Carousel";
// import { CenterMode, SimpleSlider } from "./Carousel";

function LandingPage() {
  const [currentIndex, setCurrentIndex] = useState(1);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentIndex(currentIndex === 1 ? 2 : 1);
    }, 6000);

    return () => clearTimeout(timeoutId);
  }, [currentIndex]);

  return (
    <div>
      {/* Discount */}
      <div
        className={`relative flex flex-row justify-center overflow-hidden text-xs text-center text-white font-bold bg-[#6e1d99] md:text-base`}
      >
        <div className="flex flex-col items-center justify-center w-full h-10 md:h-12">
          <div
            data-index={currentIndex}
            className={`h-full flex items-center px-8 absolute duration-1000 transition-all z-10 ${
              currentIndex === 1 ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex items-center">
              <p>
                Nhận nuôi không chỉ cứu một con vật, mà còn làm giàu trái tim
                bạn!
              </p>
            </div>
          </div>
          <div
            data-index={currentIndex}
            className={`h-full flex items-center px-8 absolute duration-1000 transition-all z-10 ${
              currentIndex === 2 ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex items-center">
              <p>Trao yêu thương, nhận lại niềm vui!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-30 bg-white shadow-md">
        <Header />
      </div>

      {/* Banner */}
      <div className="bg-[url('https://iandloveandyou.com/cdn/shop/files/Hero_Image-min.jpg?v=1710510387&width=2800')] w-full h-[711px] bg-cover">
        <div className="flex items-center justify-start h-full">
          <div className="w-1/2">
            <h2 className="text-white text-6xl font-bold mx-10 px-10">
              {"Yêu thú cưng – Trọn đời gắn kết!"}
            </h2>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-[#af1685] my-8 py-8">
        <div className="flex flex-col items-center justify-center text-white">
          <h2 className="text-3xl md:text-5xl font-semibold font-display text-[#f1b434]">
            YÊU THƯƠNG TRỌN VẸN & KHÔNG LO LẮNG
          </h2>
          <p className="w-1/2 text-center text-xl mt-4">
            Chúng tôi kết nối bạn với những người bạn bốn chân đang cần một mái
            ấm. Mỗi thú cưng đều xứng đáng có một gia đình yêu thương. Hãy mở
            lòng và mang đến cho chúng một cơ hội mới!
          </p>
        </div>
        <div>
          <ul className="flex flex-row justify-center mt-8 gap-7">
            <li className="w-40 h-40 text-center">
              <img src="/assets/images/content-1.png" alt="" />
            </li>
            <li className="w-40 h-40 text-center">
              <img src="/assets/images/content-2.png" alt="" />
            </li>
            <li className="w-40 h-40 text-center">
              <img src="/assets/images/content-3.png" alt="" />
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-[#f1b434] text-center mb-5">
        <h2 className="text-2xl font-bold text-black pt-5">FOUNDER</h2>
        <div className="w-2/3 mx-auto">
          <SimpleSlider />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default LandingPage;
