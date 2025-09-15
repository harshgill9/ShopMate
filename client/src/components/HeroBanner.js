import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

// Apni images ko import karo
import bannerImage1 from '../assets/img-1.jpeg';
import bannerImage2 from '../assets/img-2.jpeg';
import bannerImage3 from '../assets/img-3.jpeg';
import bannerImage4 from '../assets/img-4.jpeg';
import bannerImage5 from '../assets/img-5.jpeg';
import bannerImage6 from '../assets/img-6.jpeg';
import bannerImage7 from '../assets/img-7.jpeg';
import bannerImage8 from '../assets/img-8.jpeg';
import bannerImage9 from '../assets/img-9.jpeg';

const HeroBanner = () => {
  const bannerImages = [
    { text: "Sale Is Live!", url: bannerImage1 },
    { text: "New Collection!", url: bannerImage2 },
    { text: "Special Discounts!", url: bannerImage3 },
    { text: "Limited Time Offer!", url: bannerImage4 },
    { text: "Best Sellers!", url: bannerImage5 },
    { text: "Trending Now!", url: bannerImage6 },
    { text: "Just Arrived!", url: bannerImage7 },
    { text: "Exclusive Deals!", url: bannerImage8 },
    { text: "Shop the Look!", url: bannerImage9 },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    let intervalId;
    if (isPlaying) {
      intervalId = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
      }, 5000);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, bannerImages.length]);

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    setIsPlaying(false);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + bannerImages.length) % bannerImages.length);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-md shadow-lg my-9 bg-gray-900">
      {/* Carousel */}
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
      >
        {bannerImages.map((image, index) => (
          <div key={index} className="w-full h-full flex-shrink-0 relative">
            {/* Blurred Background */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${image.url})`,
                filter: 'blur(10px) brightness(0.7)',
                transform: 'scale(1.1)',
              }}
            />
            {/* Main Image */}
            <img
              src={image.url}
              alt={image.text}
              className="w-full h-full object-contain relative z-10 p-4"
            />
            {/* Overlay Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-start p-12 z-20">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white drop-shadow-xl">
                {image.text}
              </h1>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPreviousImage}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 p-3 
        bg-gray-800/60 hover:bg-gray-700/80 text-white rounded-full shadow-lg transition-colors duration-300 z-30"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={goToNextImage}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 p-3 
        bg-gray-800/60 hover:bg-gray-700/80 text-white rounded-full shadow-lg transition-colors duration-300 z-30"
      >
        <ChevronRight size={24} />
      </button>

      {/* Play / Pause */}
      <button
        onClick={togglePlay}
        className="absolute bottom-4 right-4 p-3 
        bg-gray-800/60 hover:bg-gray-700/80 text-white rounded-full shadow-lg transition-colors duration-300 z-30"
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>
    </div>
  );
};

export default HeroBanner;
