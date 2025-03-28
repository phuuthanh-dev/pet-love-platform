/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";

const Carousel = ({
  children: slides,
  autoSlide = false,
  autoSlideInterval = 3000,
}) => {
  const [curr, setCurr] = useState(0);

  const prev = () =>
    setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1));

  const next = () =>
    setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1));

  useEffect(() => {
    if (!autoSlide) return;
    const slideInterval = setInterval(next, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, [autoSlide, autoSlideInterval]);

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex w-full transition-transform ease-out duration-500"
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="w-full flex-shrink-0 flex-grow-0">
            {slide}
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <>
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <button
              onClick={prev}
              className="p-1 rounded-full shadow bg-white/90 text-gray-800 hover:bg-white"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={next}
              className="p-1 rounded-full shadow bg-white/90 text-gray-800 hover:bg-white"
            >
              <ChevronRight />
            </button>
          </div>
          <div className="absolute bottom-4 right-0 left-0">
            <div className="flex items-center justify-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurr(i)}
                  className={`transition-all w-3 h-3 rounded-full ${
                    curr === i ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Carousel;
