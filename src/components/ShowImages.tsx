// show images for puzzles, hunts(after hunt images) etc.

import React, { useEffect, useState } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";
import axios from "../utils/axios/AxiosSetup";
import { Image } from "../types";
import Loading from "../utils/Loading";
import { rootUrl } from "../utils/axios/AxiosSetup";

const ShowImages: React.FC<{ url: string | null; imageInterval: number }> = ({
  url,
  imageInterval,
}) => {
  const [images, setImages] = useState<Image[]>([]);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${url}`);
        setImages(response.data);
        setImageLoaded(true);
        // console.log(response);
      } catch (error) {
        console.log(error);
        setImageLoaded(true);
      }
    };

    if (url) {
      fetchImages();
    }
  }, [url]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const prevImage = () => {
    if (currentIndex === 0) {
      setCurrentIndex(images.length - 1);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };
  const nextImage = () => {
    if (currentIndex === images.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const autoSlide = () => {
    if (currentIndex === images.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (images.length > 1) {
        autoSlide();
      }
    }, imageInterval);
    return () => clearInterval(interval);
  }, [currentIndex, images]);

  return (
    <div>
      {!imageLoaded && <Loading />}
      {images.length !== 0 && (
        <div className="relative group duration-500">
          <div className="flex justify-center items-center">
            <div className="flex justify-center items-center w-[350px] sm:w-[400px] md:w-[600px] lg:w-[800px] h-[280px] sm:h-[310px] md:h-[400px] lg:h-[520px] overflow-hidden transition-transform duration-500 ease-in-out transform scale-100 hover:scale-105">
              <img
                src={`${rootUrl}${images[currentIndex].image}`}
                alt="puzzle img"
                className="h-full w-full object-contain rounded-md bg-[#f0cead] bg-opacity-50"
              />
            </div>
          </div>

          <div>
            <BsChevronCompactLeft
              onClick={prevImage}
              size={30}
              className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer"
            />
          </div>
          <div>
            <BsChevronCompactRight
              onClick={nextImage}
              size={30}
              className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer"
            />
          </div>
          <div className="flex top-4 py-2 justify-center">
            {images.map((image, index) => (
              <div key={index} className="2xl cursor-pointer">
                <RxDotFilled onClick={() => setCurrentIndex(index)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowImages;
