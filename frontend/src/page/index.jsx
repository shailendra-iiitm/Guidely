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
      <div className="bg-gray-50">
        <section className="relative text-center bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden min-h-screen">
          {/* Inverted U Layout - Left side going up */}
          <img className="w-12 sm:w-14 lg:w-16 hidden md:block absolute bottom-32 lg:bottom-40 left-[4%] lg:left-[6%] animate-bounce z-10" src={star} alt="" />
          <img className="w-12 sm:w-14 lg:w-16 hidden md:block absolute top-1/2 left-[6%] lg:left-[8%] animate-pulse z-10" src={graduated} alt="" />
          <img className="w-12 sm:w-14 lg:w-16 hidden md:block absolute top-24 lg:top-32 left-[8%] lg:left-[12%] animate-bounce z-10" src={computerchip} alt="" />
          
          {/* Top center of the U */}
          <img className="w-14 sm:w-16 lg:w-20 hidden md:block absolute top-6 lg:top-8 left-1/2 transform -translate-x-1/2 animate-pulse z-10" src={diamond} alt="" />
          
          {/* Right side going down */}
          <img className="w-12 sm:w-14 lg:w-16 hidden md:block absolute top-24 lg:top-32 right-[8%] lg:right-[12%] animate-pulse z-10" src={trophy} alt="" />
          <img className="w-12 sm:w-14 lg:w-16 hidden md:block absolute top-1/2 right-[6%] lg:right-[8%] animate-bounce z-10" src={coding} alt="" />
          <img className="w-12 sm:w-14 lg:w-16 hidden md:block absolute bottom-32 lg:bottom-40 right-[4%] lg:right-[6%] animate-pulse z-10" src={star} alt="" />

          <div className="relative z-20 px-4 py-24 lg:py-32 mx-auto max-w-7xl sm:px-6 lg:px-8 flex items-center min-h-screen">
            <div className="max-w-4xl mx-auto w-full">
              <h1 className="mb-6 text-4xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-2xl">
                Find Your Perfect{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00DFBD] to-blue-400 drop-shadow-lg">
                  Guide
                </span>
              </h1>
              <p className="mb-8 text-xl lg:text-2xl text-gray-200 drop-shadow-xl leading-relaxed">
                Connect with experienced professionals who can mentor and guide
                you to success in your chosen field.
              </p>
              <div className="space-y-4 sm:space-y-0 sm:space-x-6 sm:flex sm:justify-center">
                <NavLink to="/signup/learner">
                  <button className="w-full sm:w-auto px-10 py-4 text-lg font-semibold text-white transition bg-gradient-to-r from-[#00DFBD] to-blue-500 rounded-xl hover:from-[#00C9A3] hover:to-blue-600 transform hover:scale-105 shadow-2xl hover:shadow-[#00DFBD]/25">
                    Get Started as Learner
                  </button>
                </NavLink>
                <NavLink to="/signup/guide">
                  <button className="w-full sm:w-auto px-10 py-4 text-lg font-semibold text-white transition border-2 border-white/80 rounded-xl hover:bg-white hover:text-gray-900 transform hover:scale-105 shadow-2xl backdrop-blur-sm">
                    Become a Guide
                  </button>
                </NavLink>
              </div>
            </div>
          </div>

          {/* Hero Video Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-80 z-10"></div>
            <video
              className="object-cover w-full h-full scale-105"
              src={heroVideo}
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </section>

        {/* How It Works Section */}
        <section className="px-8 py-20 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                How Guidely Works
              </h2>
              <p className="text-xl text-gray-600">
                Get personalized guidance in just a few simple steps
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div>
                    <div className="flex items-center justify-center w-10 h-10 border rounded-full">
                      <svg
                        className="w-4 text-gray-400 opacity-60"
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
                  <div className="w-px h-full bg-gray-200 opacity-50" />
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
                        className="w-4 text-gray-400 opacity-60"
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
                  <div className="w-px h-full bg-gray-200 opacity-50" />
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
                        className="w-4 text-gray-400 opacity-60"
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
                  <div className="w-px h-full bg-gray-200 opacity-50" />
                </div>
                <div className="pt-1 pb-8 text-start">
                  <p className="mb-2 text-lg font-bold">Start Learning</p>
                  <p className="text-gray-700">
                    Begin your customized journey and achieve your goals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Top Guides Section */}
        <TopGuides />

        {/* Features Section */}
        <section className="px-8 py-20 bg-gray-100">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                Why Choose Guidely?
              </h2>
              <p className="text-xl text-gray-600">
                We provide the best platform for professional guidance
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="p-6 text-center bg-white rounded-lg shadow-lg">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
                  <svg className="w-8 h-8 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">Verified Guides</h3>
                <p className="text-gray-600">
                  All our guides are carefully vetted and verified professionals with proven expertise.
                </p>
              </div>
              <div className="p-6 text-center bg-white rounded-lg shadow-lg">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
                  <svg className="w-8 h-8 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">Flexible Scheduling</h3>
                <p className="text-gray-600">
                  Book sessions at your convenience with our easy-to-use scheduling system.
                </p>
              </div>
              <div className="p-6 text-center bg-white rounded-lg shadow-lg">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
                  <svg className="w-8 h-8 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">Fast Results</h3>
                <p className="text-gray-600">
                  Get personalized guidance that helps you achieve your goals faster.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-8 py-20 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Get answers to common questions about Guidely
              </p>
            </div>
            <div className="space-y-4">
              {[
                {
                  question: "How do I find the right guide for me?",
                  answer: "Browse our guide profiles, read reviews, and check their expertise areas. You can also use our matching system to find guides that align with your goals."
                },
                {
                  question: "What if I'm not satisfied with my guide?",
                  answer: "We offer a satisfaction guarantee. If you're not happy with your first session, we'll help you find a better match or provide a refund."
                },
                {
                  question: "How much does it cost?",
                  answer: "Pricing varies by guide and session type. Most guides offer competitive rates, and you can see pricing upfront before booking."
                },
                {
                  question: "Can I reschedule sessions?",
                  answer: "Yes, you can reschedule sessions up to 24 hours in advance through your dashboard."
                },
                {
                  question: "How do sessions work?",
                  answer: "Sessions are conducted via video call through our platform. You'll receive a meeting link before your scheduled time."
                }
              ].map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="flex items-center justify-between w-full p-6 text-left"
                  >
                    <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 transition-transform opacity-70 ${
                        isOpen[index] ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  {isOpen[index] && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="px-8 py-20 text-center text-white bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600">
          <h2 className="mb-6 text-4xl font-bold">
            Ready to Find Your Guide?
          </h2>
          <p className="mb-8 text-xl">
            Join Guidely today and connect with experienced professionals who
            can guide you through your journey!
          </p>
          <NavLink to="/signup/learner">
            <button className="px-8 py-3 font-semibold text-purple-600 transition bg-white rounded-lg hover:bg-gray-200">
              Get Started Now
            </button>
          </NavLink>
        </section>

        {/* Footer */}
        <footer className="px-8 py-10 text-white bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="max-w-6xl mx-auto text-center">
            <p>Follow us on social media for updates and tips!</p>
            <p className="mt-4">
              <a href="#" className="hover:text-[#00DFBD]">
                Facebook
              </a>{" "}
              |{" "}
              <a href="#" className="hover:text-[#00DFBD]">
                Twitter
              </a>{" "}
              |{" "}
              <a href="#" className="hover:text-[#00DFBD]">
                LinkedIn
              </a>
            </p>
            <p className="mt-4 text-gray-300">
              Contact us: <a href="mailto:guidely.iiit@gmail.com" className="text-blue-400 hover:text-blue-300">guidely.iiit@gmail.com</a>
            </p>
            <p className="mt-4">© 2024 Guidely. All Rights Reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;