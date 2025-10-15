import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CarouselButtons({ prevSlide, nextSlide }) {
  return (
    <>
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-700 text-white w-14 h-14 flex items-center justify-center rounded-full hover:bg-gray-600 shadow-lg transition-all duration-300"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-700 text-white w-14 h-14 flex items-center justify-center rounded-full hover:bg-gray-600 shadow-lg transition-all duration-300"
      >
        <ChevronRight className="w-8 h-8" />
      </button>
    </>
  );
}
