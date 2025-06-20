import React, { useState } from "react";
import heroVideo from "../assets/hero.mp4";
import star from "../assets/star.png";
import trophy from "../assets/trophy.png";
import diamond from "../assets/diamond.png";
import computerchip from "../assets/computer-chip.png";
import graduated from "../assets/graduated.png";
import coding from "../assets/coding.png";
import TopGuides from "../components/TopGuides";
import { Nav } from "../components/Nav";
import { NavLink } from "react-router-dom";

const Home = () => {
  const [isOpen, setIsOpen] = useState({});

  const toggleFAQ = (index) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <>
      <Nav />
      <div className="bg-white">
        <section className="relative text-center bg-black">
          <img className="w-14 hidden md:block absolute top-10 left-[15%]" src={star} alt="" />
          <img className="w-14 absolute md:block hidden top-[20%] left-48" src={graduated} alt="" />
          <img className="w-20 absolute md:block hidden top-16 right-[15%]" src={diamond} alt="" />

          <div className="relative py-10 md:py-20 ">
            <h1 className="mb-4 text-2xl font-bold text-white md:text-6xl">
              Welcome to{" "}
              <span className="text-3xl border-b-8 md:text-7xl">Guidely</span>
            </h1>
            <p className="my-10 text-base text-gray-200 md:my-16 md:text-2xl">
              Unlock your potential with expert guidance from real guides.
            </p>
            <NavLink to="/guides">
              <button className="px-8 py-3 text-white transition bg-purple-600 rounded-lg hover:bg-purple-800">
                Find Your Guide
              </button>
            </NavLink>
            <img className="absolute hidden md:block w-14 left-1/3" src={computerchip} alt="" />
          </div>
          <div className="relative">
            <img className="absolute hidden md:block w-14 top-56 left-28" src={coding} alt="" />
            <img className="absolute hidden md:block w-14 top-3 right-28" src={trophy} alt="" />
            <video
              autoPlay
              loop
              muted
              className="inset-0 object-cover w-full p-2 mx-auto rounded md:p-0 md:w-2/3 h-2/3"
            >
              <source src={heroVideo} type="video/mp4" />
            </video>
            <img className="absolute hidden md:block w-14 bottom-96 right-28 " src={star} alt="" />
          </div>
        </section>
      </div>
    </>
  );
};



export default Home;
// Home Page