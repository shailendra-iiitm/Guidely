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
import feedbackAPI from "../apiManger/feedback";

const Home = () => {
  const [isOpen, setIsOpen] = useState({});
  const [showSupport, setShowSupport] = useState(false);
  const [trackingToken, setTrackingToken] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: '',
    subject: '',
    message: ''
  });

  const toggleFAQ = (index) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const toggleSupport = () => {
    setShowSupport(!showSupport);
    if (!showSupport) {
      // Use setTimeout to ensure the element is rendered before scrolling
      setTimeout(() => {
        const supportSection = document.getElementById('support-section');
        if (supportSection) {
          supportSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.type || !formData.subject || !formData.message) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit to backend
      const response = await feedbackAPI.submitFeedback(formData);
      
      if (response.data.success) {
        const token = response.data.data.token;
        
        // Clear form
        setFormData({
          name: '',
          email: '',
          type: '',
          subject: '',
          message: ''
        });

        // Show success message with tracking token
        alert(`✅ Thank you for your feedback!\n\n🎫 Your tracking token: ${token}\n\n📝 Save this token to track your feedback status at any time.\n\n✉️ You can also email us directly at guidely.iiit@gmail.com`);
        
        // Close support form
        setShowSupport(false);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const trackFeedbackStatus = async () => {
    if (!trackingToken.trim()) {
      alert('Please enter a valid tracking token');
      return;
    }

    try {
      const response = await feedbackAPI.trackFeedback(trackingToken.trim());
      if (response.data.success) {
        setFeedbackStatus(response.data.data);
      }
    } catch (error) {
      console.error('Error tracking feedback:', error);
      alert('Invalid tracking token or feedback not found');
    }
  };

  return (
    <>
      <Nav />
      <div className="bg-gray-50">
        <section className="relative text-center bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden">
          {/* Inverted U Layout - Left side going up */}
          <img className="w-14 hidden md:block absolute bottom-40 left-[6%] animate-bounce" src={star} alt="" />
          <img className="w-14 hidden md:block absolute top-1/2 left-[8%] animate-pulse" src={graduated} alt="" />
          <img className="w-14 hidden md:block absolute top-32 left-[12%] animate-bounce" src={computerchip} alt="" />
          
          {/* Top center of the U */}
          <img className="w-16 hidden md:block absolute top-8 left-1/2 transform -translate-x-1/2 animate-pulse" src={diamond} alt="" />
          
          {/* Right side going down */}
          <img className="w-14 hidden md:block absolute top-32 right-[12%] animate-pulse" src={trophy} alt="" />
          <img className="w-14 hidden md:block absolute top-1/2 right-[8%] animate-bounce" src={coding} alt="" />
          <img className="w-14 hidden md:block absolute bottom-40 right-[6%] animate-pulse" src={star} alt="" />

          <div className="relative py-10 md:py-20 z-10">
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
          </div>
          <div className="relative">
            <video
              autoPlay
              loop
              muted
              className="inset-0 object-cover w-full p-2 mx-auto rounded md:p-0 md:w-2/3 h-2/3"
            >
              <source src={heroVideo} type="video/mp4" />
            </video>
          </div>
        </section>

               {/* About Section */}
        <section className="bg-gradient-to-r from-blue-50 to-purple-50">
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
                  <NavLink to="/signup/learner">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide text-white transition duration-200 bg-purple-600 rounded shadow-md hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
                    >
                      Get started
                    </button>
                  </NavLink>
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
        <section className="px-8 py-20 bg-gradient-to-b from-white to-gray-100">
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
                  Browse verified reviews and ratings from other our past learneres to
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
        <section className="px-8 py-20 text-center bg-gradient-to-r from-gray-100 to-blue-50">
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

        {/* Guide Categories Section */}
        <section className="px-8 py-20 bg-gradient-to-b from-white to-purple-50">
          <div>
            <div className="flex flex-col px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20 lg:flex-row">
              <div className="mb-5 lg:w-1/3 lg:mb-0 lg:mr-20">
                <h2 className="relative mb-4 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">
                  <span className="relative inline-block">
                    <svg
                      viewBox="0 0 52 24"
                      fill="currentColor"
                      className="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-blue-gray-100 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block"
                    >
                      <defs>
                        <pattern
                          id="6bfa0e57-faa2-4bb2-ac0e-310782e5eb2d"
                          x="0"
                          y="0"
                          width=".135"
                          height=".30"
                        >
                          <circle cx="1" cy="1" r=".7" />
                        </pattern>
                      </defs>
                      <rect
                        fill="url(#6bfa0e57-faa2-4bb2-ac0e-310782e5eb2d)"
                        width="52"
                        height="24"
                      />
                    </svg>
                  </span>{" "}
                  Find the Perfect Guide for Your Journey
                </h2>
                <p className="mb-4 text-gray-900 lg:mb-6">
                  Explore a wide range of guide categories to find the perfect
                  match for your personal or professional growth. Our guides
                  are ready to guide you in mastering new skills, overcoming
                  challenges, and achieving your goals.
                </p>
                <a
                  href="/"
                  aria-label=""
                  className="inline-flex items-center font-semibold text-purple-400 transition-colors duration-200 hover:text-purple-800"
                >
                  Learn more
                  <svg
                    className="inline-block w-3 ml-2"
                    fill="currentColor"
                    viewBox="0 0 12 12"
                  >
                    <path d="M9.707,5.293l-5-5A1,1,0,0,0,3.293,1.707L7.586,6,3.293,10.293a1,1,0,1,0,1.414,1.414l5-5A1,1,0,0,0,9.707,5.293Z" />
                  </svg>
                </a>
              </div>
              <div className="flex-grow pt-1">
                <div className="flex items-center mb-3">
                  <span className="font-bold tracking-wide text-gray-900">
                    Categories
                  </span>
                  <span className="ml-1">
                    <svg
                      className="w-5 h-5 mt-px text-purple-400"
                      stroke="currentColor"
                      viewBox="0 0 52 52"
                    >
                      <polygon
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        points="29 13 14 29 25 29 23 39 38 23 27 23"
                      />
                    </svg>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-10 gap-y-40 sm:grid-cols-3">
                  <ul className="space-y-4">
                    <li>
                      <a
                        href="/"
                        className="text-purple-400 transition-colors duration-300 hover:text-purple-700 hover:underline"
                      >
                        Career Growth Guides
                      </a>
                    </li>
                    <li>
                      <a
                        href="/"
                        className="text-purple-400 transition-colors duration-300 hover:text-purple-700 hover:underline"
                      >
                        Skill Development Guides
                      </a>
                    </li>
                    <li>
                      <a
                        href="/"
                        className="text-purple-400 transition-colors duration-300 hover:text-purple-700 hover:underline"
                      >
                        Entrepreneurship Guides
                      </a>
                    </li>
                    <li>
                      <a
                        href="/"
                        className="text-purple-400 transition-colors duration-300 hover:text-purple-700 hover:underline"
                      >
                        Freelancing & Gig Economy Guides
                      </a>
                    </li>
                  </ul>
                  <ul className="space-y-4">
                    <li>
                      <a
                        href="/"
                        className="text-purple-400 transition-colors duration-300 hover:text-purple-700 hover:underline"
                      >
                        Tech & Engineering Guides
                      </a>
                    </li>
                    <li>
                      <a
                        href="/"
                        className="text-purple-400 transition-colors duration-300 hover:text-purple-700 hover:underline"
                      >
                        Creative Arts Guides
                      </a>
                    </li>
                    <li>
                      <a
                        href="/"
                        className="text-purple-400 transition-colors duration-300 hover:text-purple-700 hover:underline"
                      >
                        Marketing & Sales Guides
                      </a>
                    </li>
                    <li>
                      <a
                        href="/"
                        className="text-purple-400 transition-colors duration-300 hover:text-purple-700 hover:underline"
                      >
                        Finance & Investment Guides
                      </a>
                    </li>
                  </ul>
                  <ul className="space-y-4">
                    <li>
                      <a
                        href="/"
                        className="text-purple-400 transition-colors duration-300 hover:text-purple-700 hover:underline"
                      >
                        Health & Wellness Guides
                      </a>
                    </li>
                    <li>
                      <a
                        href="/"
                        className="text-purple-400 transition-colors duration-300 hover:text-purple-700 hover:underline"
                      >
                        Education & Teaching Guides
                      </a>
                    </li>
                    <li>
                      <a
                        href="/"
                        className="text-purple-400 transition-colors duration-300 hover:text-purple-700 hover:underline"
                      >
                        Personal Development Guides
                      </a>
                    </li>

                    <li>
                      <a
                        href="/"
                        className="text-purple-400 transition-colors duration-300 hover:text-purple-700 hover:underline"
                      >
                        Social Impact Guides
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                className="object-cover w-full h-56 sm:h-96"
                src="https://images.pexels.com/photos/3184419/pexels-photo-3184419.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=1260"
                alt=""
              />
              <div className="absolute inset-0 bg-gray-900 bg-opacity-50" />
            </div>
          </div>
        </section>


         {/* Pricing Section */}
        <section className="px-8 py-20 text-center bg-gradient-to-r from-purple-50 to-blue-50">
          <h2 className="mb-12 text-4xl font-bold">Affordable Pricing</h2>
          <p className="max-w-4xl mx-auto mb-6 text-xl text-gray-700">
            We offer affordable plans for both learners and Guides. Get started
            with a free account and explore paid  options that fit
            your needs.
          </p>
          <button className="px-6 py-3 text-white transition bg-purple-600 rounded-lg hover:bg-purple-800">
            Learn More About Pricing
          </button>
        </section>

        {/* FAQs Section */}
        <section className="px-6 py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-screen-lg mx-auto">
            <h2 className="mb-10 text-4xl font-bold text-center text-gray-900">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              <div className="pb-4 border-b border-gray-300">
                <button
                  className="flex items-center justify-between w-full text-lg font-medium text-gray-900 transition-colors hover:text-purple-600"
                  onClick={() => toggleFAQ(1)}
                >
                  What is Guidely?
                  <span className="ml-4 transition-transform transform rotate-0 group-hover:rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      fill="none"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  className={`mt-2 text-gray-700 transition-height duration-300 ease-in-out ${
                    isOpen[1] ? "max-h-screen" : "max-h-0 overflow-hidden"
                  }`}
                >
                  <p>
                    Guidely is an online platform connecting mentees with
                    experienced Guides across various fields like technology,
                    business, health, and more, to help them grow and achieve
                    their goals.
                  </p>
                </div>
              </div>

              <div className="pb-4 border-b border-gray-300">
                <button
                  className="flex items-center justify-between w-full text-lg font-medium text-gray-900 transition-colors hover:text-purple-600"
                  onClick={() => toggleFAQ(2)}
                >
                  How do I sign up as a Guide?
                  <span className="ml-4 transition-transform transform rotate-0 group-hover:rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      fill="none"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  className={`mt-2 text-gray-700 transition-height duration-300 ease-in-out ${
                    isOpen[2] ? "max-h-screen" : "max-h-0 overflow-hidden"
                  }`}
                >
                  <p>
                    Signing up as a Guide is simple! Just click on the "Become
                    a Guide" button, fill in your details, and select your
                    areas of expertise. Once approved, you'll be able to start
                    guiding.
                  </p>
                </div>
              </div>

              <div className="pb-4 border-b border-gray-300">
                <button
                  className="flex items-center justify-between w-full text-lg font-medium text-gray-900 transition-colors hover:text-purple-600"
                  onClick={() => toggleFAQ(3)}
                >
                  Can I choose my Guide?
                  <span className="ml-4 transition-transform transform rotate-0 group-hover:rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      fill="none"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  className={`mt-2 text-gray-700 transition-height duration-300 ease-in-out ${
                    isOpen[3] ? "max-h-screen" : "max-h-0 overflow-hidden"
                  }`}
                >
                  <p>
                    Yes! You can browse through available Guides, check their
                    expertise, and select the one that fits your goals and
                    preferences.
                  </p>
                </div>
              </div>

              <div className="pb-4 border-b border-gray-300">
                <button
                  className="flex items-center justify-between w-full text-lg font-medium text-gray-900 transition-colors hover:text-purple-600"
                  onClick={() => toggleFAQ(4)}
                >
                  What are the costs involved?
                  <span className="ml-4 transition-transform transform rotate-0 group-hover:rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      fill="none"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  className={`mt-2 text-gray-700 transition-height duration-300 ease-in-out ${
                    isOpen[4] ? "max-h-screen" : "max-h-0 overflow-hidden"
                  }`}
                >
                  <p>
                    Guidely offers both free and paid  options. The
                    pricing varies depending on the Guide's experience and
                    session length, which will be displayed upfront.
                  </p>
                </div>
              </div>

              <div className="pb-4 border-b border-gray-300">
                <button
                  className="flex items-center justify-between w-full text-lg font-medium text-gray-900 transition-colors hover:text-purple-600"
                  onClick={() => toggleFAQ(5)}
                >
                  How does the Knowledge flow  work?
                  <span className="ml-4 transition-transform transform rotate-0 group-hover:rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      fill="none"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  className={`mt-2 text-gray-700 transition-height duration-300 ease-in-out ${
                    isOpen[5] ? "max-h-screen" : "max-h-0 overflow-hidden"
                  }`}
                >
                  <p>
                    Once you select a Guide, you can schedule sessions directly
                    through the platform. Meeting can be conducted via video
                    calls, messages, or email, based on your mutual preferences.
                  </p>
                </div>
              </div>

              <div className="pb-4 border-b border-gray-300">
                <button
                  className="flex items-center justify-between w-full text-lg font-medium text-gray-900 transition-colors hover:text-purple-600"
                  onClick={() => toggleFAQ(6)}
                >
                  Is there a support system if I face issues?
                  <span className="ml-4 transition-transform transform rotate-0 group-hover:rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      fill="none"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  className={`mt-2 text-gray-700 transition-height duration-300 ease-in-out ${
                    isOpen[6] ? "max-h-screen" : "max-h-0 overflow-hidden"
                  }`}
                >
                  <p>
                    Yes! Guidely has a dedicated support team to help you with
                    any issues you may face, whether it's regarding finding a
                    Guide, payment issues, or platform queries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support Section */}
        {showSupport && (
          <section id="support-section" className="px-8 py-20 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="mb-6 text-4xl font-bold text-gray-900">Need Support?</h2>
                <p className="text-xl text-gray-700 mb-8">
                  We're here to help! Share your feedback, suggestions, or report any issues you're experiencing.
                </p>
                <button
                  onClick={() => setShowSupport(false)}
                  className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
                >
                  Close Support
                </button>
              </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <form className="space-y-6" onSubmit={handleSubmitFeedback}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Type of Feedback
                  </label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select feedback type</option>
                    <option value="suggestion">Suggestion</option>
                    <option value="complaint">Complaint</option>
                    <option value="bug-report">Bug Report</option>
                    <option value="feature-request">Feature Request</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Brief description of your feedback"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows="6"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Please provide detailed information about your feedback, complaint, or suggestion..."
                    required
                  ></textarea>
                </div>
                
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-8 py-3 font-semibold rounded-lg transition duration-300 transform ${
                      isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:scale-105'
                    }`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </div>
              </form>
              
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <p className="text-sm text-blue-800">
                      <strong>Direct Contact:</strong> You can also reach us directly at{" "}
                      <a href="mailto:guidely.iiit@gmail.com" className="text-blue-600 hover:text-blue-500 underline">
                        guidely.iiit@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Feedback Tracking */}
              <div className="mt-8 bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Track Your Feedback</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Have a tracking token? Enter it below to check the status of your feedback.
                </p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter tracking token (e.g., FB12AB34)"
                    value={trackingToken}
                    onChange={(e) => setTrackingToken(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={trackFeedbackStatus}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                  >
                    Track
                  </button>
                </div>
                
                {feedbackStatus && (
                  <div className="mt-4 p-4 bg-white rounded-lg border">
                    <h4 className="font-medium text-gray-800 mb-2">Feedback Status</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Token:</span> {feedbackStatus.token}</p>
                      <p><span className="font-medium">Type:</span> {feedbackStatus.type}</p>
                      <p><span className="font-medium">Subject:</span> {feedbackStatus.subject}</p>
                      <p><span className="font-medium">Status:</span> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          feedbackStatus.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          feedbackStatus.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {feedbackStatus.status}
                        </span>
                      </p>
                      <p><span className="font-medium">Submitted:</span> {new Date(feedbackStatus.submittedAt).toLocaleDateString()}</p>
                      {feedbackStatus.resolvedAt && (
                        <p><span className="font-medium">Resolved:</span> {new Date(feedbackStatus.resolvedAt).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        )}

           {/* Campaign & Call to Guidely */}
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

        {/* Floating Support Button */}
        <button
          onClick={toggleSupport}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:from-purple-700 hover:to-blue-700 transition duration-300 transform hover:scale-110 z-50"
          aria-label="Contact Support"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
        </button>
      </div>
</>);
};

export default Home;
