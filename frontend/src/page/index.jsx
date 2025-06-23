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

       {/* Features Section */}
        <section className="px-8 py-20 bg-white">
          <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
            <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
              <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
                <span className="relative inline-block">
                  <svg viewBox="0 0 52 24" fill="currentColor" className="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-blue-gray-100 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block">
                    <defs>
                      <pattern id="ea469ae8-e6ec-4aca-8875-fc402da4d16e" x="0" y="0" width=".135" height=".30">
                        <circle cx="1" cy="1" r=".7" />
                      </pattern>
                    </defs>
                    <rect fill="url(#ea469ae8-e6ec-4aca-8875-fc402da4d16e)" width="52" height="24" />
                  </svg>
                </span>{" "}
                "Real Guidance, Real Results"
              </h2>
              <p className="text-base text-gray-700 md:text-lg">
                At Guidely, you’re matched with real guides for your goals—career, skills, wellness, and more. Everything is built to be personal, accessible, and impactful.
              </p>
            </div>

            <div className="grid gap-8 row-gap-10 lg:grid-cols-2">
              <div className="max-w-md sm:mx-auto sm:text-center">
                <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-50 sm:mx-auto sm:w-24 sm:h-24">
                  <svg
                    className="w-12 h-12 text-purple-600 sm:w-16 sm:h-16"
                    stroke="currentColor"
                    viewBox="0 0 52 52"
                  >
                    <polygon
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      points="29 13 14 29 25 29 23 39 38 23 27 23"
                    />
                  </svg>
                </div>
                <h6 className="mb-3 text-xl font-bold leading-5">
                  Expert Guidance
                </h6>
                <p className="mb-3 text-sm text-gray-900">
                  Get one-on-one guidance from professionals who have years of
                  experience in their fields. They are here to help you navigate
                  your career with personalized advice.
                </p>
                <a
                  href="/"
                  aria-label=""
                  className="inline-flex items-center font-semibold text-purple-400 transition-colors duration-200 hover:text-deep-purple-800"
                >
                  Learn more
                </a>
              </div>
              <div className="max-w-md sm:mx-auto sm:text-center">
                <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-50 sm:mx-auto sm:w-24 sm:h-24">
                  <svg
                    className="w-12 h-12 text-purple-600 sm:w-16 sm:h-16"
                    stroke="currentColor"
                    viewBox="0 0 52 52"
                  >
                    <polygon
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      points="29 13 14 29 25 29 23 39 38 23 27 23"
                    />
                  </svg>
                </div>
                <h6 className="mb-3 text-xl font-bold leading-5">
                  Tailored Learning Paths
                </h6>
                <p className="mb-3 text-sm text-gray-900">
                  Choose from a variety of expert guides that specialize in what you
                  need. Your learning goals and challenges will be the priority
                  in a guidance plan designed just for you.
                </p>
                <a
                  href="/"
                  aria-label=""
                  className="inline-flex items-center font-semibold text-purple-400 transition-colors duration-200 hover:text-deep-purple-800"
                >
                  Learn more
                </a>
              </div>
              <div className="max-w-md sm:mx-auto sm:text-center">
                <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-50 sm:mx-auto sm:w-24 sm:h-24">
                  <svg
                    className="w-12 h-12 text-purple-600 sm:w-16 sm:h-16"
                    stroke="currentColor"
                    viewBox="0 0 52 52"
                  >
                    <polygon
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      points="29 13 14 29 25 29 23 39 38 23 27 23"
                    />
                  </svg>
                </div>
                <h6 className="mb-3 text-xl font-bold leading-5">
                  Flexible Scheduling
                </h6>
                <p className="mb-3 text-sm text-gray-900">
                  Set your sessions based on your availability. Our Guides
                  offer flexible timings so you can fit learning into your
                  schedule without hassle.
                </p>
                <a
                  href="/"
                  aria-label=""
                  className="inline-flex items-center font-semibold text-purple-400 transition-colors duration-200 hover:text-deep-purple-800"
                >
                  Learn more
                </a>
              </div>
              <div className="max-w-md sm:mx-auto sm:text-center">
                <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-50 sm:mx-auto sm:w-24 sm:h-24">
                  <svg
                    className="w-12 h-12 text-purple-600 sm:w-16 sm:h-16"
                    stroke="currentColor"
                    viewBox="0 0 52 52"
                  >
                    <polygon
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      points="29 13 14 29 25 29 23 39 38 23 27 23"
                    />
                  </svg>
                </div>
                <h6 className="mb-3 text-xl font-bold leading-5">
                  Goal-Oriented Sessions
                </h6>
                <p className="mb-3 text-sm text-gray-900">
                  Our Guides are dedicated to helping you achieve tangible
                  results. Whether you're aiming to learn a new skill, get
                  career advice, or grow professionally, your success is our
                  goal.
                </p>
                <a
                  href="/"
                  aria-label=""
                  className="inline-flex items-center font-semibold text-purple-400 transition-colors duration-200 hover:text-deep-purple-800"
                >
                  Learn more
                </a>
              </div>
              <div className="max-w-md sm:mx-auto sm:text-center">
                <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-50 sm:mx-auto sm:w-24 sm:h-24">
                  <svg
                    className="w-12 h-12 text-purple-600 sm:w-16 sm:h-16"
                    stroke="currentColor"
                    viewBox="0 0 52 52"
                  >
                    <polygon
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      points="29 13 14 29 25 29 23 39 38 23 27 23"
                    />
                  </svg>
                </div>
                <h6 className="mb-3 text-xl font-bold leading-5">
                  Guide Reviews & Ratings
                </h6>
                <p className="mb-3 text-sm text-gray-900">
                  Browse verified reviews and ratings from other students to
                  find the Guide that matches your learning style and
                  expectations.
                </p>
                <a
                  href="/"
                  aria-label=""
                  className="inline-flex items-center font-semibold text-purple-400 transition-colors duration-200 hover:text-deep-purple-800"
                >
                  Learn more
                </a>
              </div>
              <div className="max-w-md sm:mx-auto sm:text-center">
                <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-50 sm:mx-auto sm:w-24 sm:h-24">
                  <svg
                    className="w-12 h-12 text-purple-600 sm:w-16 sm:h-16"
                    stroke="currentColor"
                    viewBox="0 0 52 52"
                  >
                    <polygon
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      points="29 13 14 29 25 29 23 39 38 23 27 23"
                    />
                  </svg>
                </div>
                <h6 className="mb-3 text-xl font-bold leading-5">
                  Seamless Onboarding
                </h6>
                <p className="mb-3 text-sm text-gray-900">
                  Easily create an account, browse Guides, and schedule your
                  first session in just a few clicks. Start your learning
                  journey in no time.
                </p>
                <a
                  href="/"
                  aria-label=""
                  className="inline-flex items-center font-semibold text-purple-400 transition-colors duration-200 hover:text-deep-purple-800"
                >
                  Learn more
                </a>
              </div>
            </div>
          </div>
        </section>

         {/* How It Works Section */}
        <section className="px-8 py-20 text-center bg-gray-50">
          <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
            <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
              <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
                <span className="relative inline-block">
                  <svg
                    viewBox="0 0 52 24"
                    fill="currentColor"
                    className="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-blue-gray-100 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block"
                  >
                    <defs>
                      <pattern
                        id="ea469ae8-e6ec-4aca-8875-fc402da4d16e"
                        x="0"
                        y="0"
                        width=".135"
                        height=".30"
                      >
                        <circle cx="1" cy="1" r=".7" />
                      </pattern>
                    </defs>
                    <rect
                      fill="url(#ea469ae8-e6ec-4aca-8875-fc402da4d16e)"
                      width="52"
                      height="24"
                    />
                  </svg>
                </span>{" "}
                "Your Path to Success, Step by Step"
              </h2>
              <p className="text-base text-gray-700 md:text-lg">
                Guidely makes finding and connecting with the right Guides
                simple and effective. Follow these easy steps to start your
                personalized guidance journey today, and unlock the guidance
                and expertise you need to achieve your goals.
              </p>
            </div>
            <div className="grid gap-6 row-gap-10 lg:grid-cols-2">
              <div className="lg:py-6 lg:pr-16">
                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div>
                      <div className="flex items-center justify-center w-10 h-10 border rounded-full">
                        <svg
                          className="w-4 text-gray-600"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          viewBox="0 0 24 24"
                        >
                          <line
                            fill="none"
                            strokeMiterlimit="10"
                            x1="12"
                            y1="2"
                            x2="12"
                            y2="22"
                          />
                          <polyline
                            fill="none"
                            strokeMiterlimit="10"
                            points="19,15 12,22 5,15"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="w-px h-full bg-gray-300" />
                  </div>
                  <div className="pt-1 pb-8 text-start">
                    <p className="mb-2 text-lg font-bold">Sign Up</p>
                    <p className="text-gray-700">
                      Start the journey by creating a profile.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div>
                      <div className="flex items-center justify-center w-10 h-10 border rounded-full">
                        <svg
                          className="w-4 text-gray-600"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          viewBox="0 0 24 24"
                        >
                          <line
                            fill="none"
                            strokeMiterlimit="10"
                            x1="12"
                            y1="2"
                            x2="12"
                            y2="22"
                          />
                          <polyline
                            fill="none"
                            strokeMiterlimit="10"
                            points="19,15 12,22 5,15"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="w-px h-full bg-gray-300" />
                  </div>
                  <div className="pt-1 pb-8 text-start">
                    <p className="mb-2 text-lg font-bold">Browse Guides</p>
                    <p className="text-gray-700">
                      Search and explore Guides based on your specific needs.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div>
                      <div className="flex items-center justify-center w-10 h-10 border rounded-full">
                        <svg
                          className="w-4 text-gray-600"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          viewBox="0 0 24 24"
                        >
                          <line
                            fill="none"
                            strokeMiterlimit="10"
                            x1="12"
                            y1="2"
                            x2="12"
                            y2="22"
                          />
                          <polyline
                            fill="none"
                            strokeMiterlimit="10"
                            points="19,15 12,22 5,15"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="w-px h-full bg-gray-300" />
                  </div>
                  <div className="pt-1 pb-8 text-start">
                    <p className="mb-2 text-lg font-bold">Select Your Guide</p>
                    <p className="text-gray-700">
                      Check Guide profiles and reviews to find the perfect fit.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div>
                      <div className="flex items-center justify-center w-10 h-10 border rounded-full">
                        <svg
                          className="w-4 text-gray-600"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          viewBox="0 0 24 24"
                        >
                          <line
                            fill="none"
                            strokeMiterlimit="10"
                            x1="12"
                            y1="2"
                            x2="12"
                            y2="22"
                          />
                          <polyline
                            fill="none"
                            strokeMiterlimit="10"
                            points="19,15 12,22 5,15"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="w-px h-full bg-gray-300" />
                  </div>
                  <div className="pt-1 pb-8 text-start">
                    <p className="mb-2 text-lg font-bold">Book a Session</p>
                    <p className="text-gray-700">
                      Schedule sessions at a time that works for you.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div>
                      <div className="flex items-center justify-center w-10 h-10 border rounded-full">
                        <svg
                          className="w-4 text-gray-600"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          viewBox="0 0 24 24"
                        >
                          <line
                            fill="none"
                            strokeMiterlimit="10"
                            x1="12"
                            y1="2"
                            x2="12"
                            y2="22"
                          />
                          <polyline
                            fill="none"
                            strokeMiterlimit="10"
                            points="19,15 12,22 5,15"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="w-px h-full bg-gray-300" />
                  </div>
                  <div className="pt-1 pb-8 text-start">
                    <p className="mb-2 text-lg font-bold">Start Learning</p>
                    <p className="text-gray-700">
                      Begin your customized  journey and achieve your
                      goals.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div>
                      <div className="flex items-center justify-center w-10 h-10 border rounded-full">
                        <svg
                          className="w-6 text-gray-600"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <polyline
                            fill="none"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeMiterlimit="10"
                            points="6,12 10,16 18,8"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="pt-1">
                    <p className="mb-2 text-lg font-bold">Success</p>
                    <p className="text-gray-700" />
                  </div>
                </div>
              </div>
              <div className="relative">
                <img
                  className="inset-0 object-cover object-bottom w-full rounded shadow-lg h-96 lg:absolute lg:h-full"
                  src="https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=1260"
                  alt=""
                />
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