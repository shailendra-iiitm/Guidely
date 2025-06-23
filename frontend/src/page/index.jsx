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

               {/* About Section */}
        <section className="bg-[#F5EEE9]">
          <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
            <div className="flex flex-col max-w-screen-xl overflow-hidden bg-white border rounded shadow-sm lg:flex-row sm:mx-auto">
              <div className="relative lg:w-1/2">
                <img
                  src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=1260"
                  alt=""
                  className="object-cover w-full lg:absolute h-80 lg:h-full"
                />
                <svg
                  className="absolute top-0 right-0 hidden h-full text-white lg:inline-block"
                  viewBox="0 0 20 104"
                  fill="currentColor"
                >
                  <polygon points="17.3036738 5.68434189e-14 20 5.68434189e-14 20 104 0.824555778 104" />
                </svg>
              </div>
              <div className="p-8 bg-white lg:p-16 lg:pl-10 lg:w-1/2">
                <h5 className="mb-3 text-3xl font-extrabold leading-none sm:text-4xl">
                  What is Guidely?
                </h5>
                <p className="mb-5 text-gray-800">
                  <span className="font-bold">Guidely</span> is a platform
                  designed to connect learners and working people with  expert Guides
                  who can help them through their personal and professional
                  development. Whether you're looking to master a new skill or
                  get career advice, we have the right Guide for you.
                </p>
                <div className="flex items-center">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide text-white transition duration-200 bg-purple-600 rounded shadow-md hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
                  >
                    Get started
                  </button>
                  <a
                    href="/"
                    aria-label=""
                    className="inline-flex items-center font-semibold text-purple-600 transition-colors duration-200 hover:text-deep-purple-800"
                  >
                    Learn More
                    <svg
                      className="inline-block w-3 ml-2"
                      fill="currentColor"
                      viewBox="0 0 12 12"
                    >
                      <path d="M9.707,5.293l-5-5A1,1,0,0,0,3.293,1.707L7.586,6,3.293,10.293a1,1,0,1,0,1.414,1.414l5-5A1,1,0,0,0,9.707,5.293Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>








      </div>





    </>
  );
};



export default Home;
// Home Page