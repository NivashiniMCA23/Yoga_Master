import React from "react";
import bgImg from "../../../assets/home/banner-1.jpg";

const Hero = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="min-h-screen flex items-center text-white bg-black bg-opacity-60 px-5 md:px-11">
        <div className="text-center md:text-left w-full">
          <div className="space-y-4">
            <p className="text-lg md:text-4xl">We Provide</p>
            <h1 className="text-3xl md:text-7xl font-bold">
              Best Yoga Course Online
            </h1>
            <div className="w-full md:w-1/2 mx-auto md:mx-0">
              <p className="text-sm md:text-base">
                Engaging in yoga practice not only benefits the physical body
                but also nourishes the mind with peace and mindfulness, easing
                the stresses of daily life. To inspire and encourage all yoga
                enthusiasts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
