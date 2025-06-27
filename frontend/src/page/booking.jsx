import React, { useEffect, useState } from "react";
import { Card, Button, Spin, message } from "antd";
import { FaClock } from "react-icons/fa";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import service from "../apiManger/service";
import availability from "../apiManger/availability";
import moment from "moment";
import booking from "../apiManger/booking";
import handlePayment from "../components/Checkout";
import Layout from "../components/Layout";
import useUserStore from "../store/user";

const Booking = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUserStore();
  const [serviceData, setServiceData] = useState(null);
  const [guideAvailability, setGuideAvailability] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [loadingService, setLoadingService] = useState(true);
  const [availabilityError, setAvailabilityError] = useState(null);

  const getServiceData = async () => {
    setLoadingService(true);
    try {
      const res = await service.getServiceById(id);
      if (res?.data?.service) {
        setServiceData(res.data.service);
        
        // Extract guide ID properly (it might be an object with _id or just a string)
        const guideId = res.data.service.guide?._id || res.data.service.guide;
        console.log("Guide data:", res.data.service.guide);
        console.log("Extracted guide ID:", guideId);
        
        if (guideId) {
          getGuideAvailability(guideId, res.data.service.duration);
        } else {
          console.error("No guide ID found in service data");
          setAvailabilityError("Guide information not available");
        }
      } else {
        message.error("Service not found");
        navigate(-1);
      }
    } catch (error) {
      console.error("Error fetching service data:", error);
      message.error("Failed to load service details");
      navigate(-1);
    } finally {
      setLoadingService(false);
    }
  };

  const getGuideAvailability = async (id, duration) => {
    setLoadingAvailability(true);
    setAvailabilityError(null);
    
    console.log("Getting guide availability for:", { id, duration, type: typeof id });
    
    // Validate inputs
    if (!id || typeof id !== 'string') {
      console.error("Invalid guide ID:", id);
      setAvailabilityError("Invalid guide ID");
      setLoadingAvailability(false);
      return;
    }
    
    if (!duration || isNaN(duration)) {
      console.error("Invalid duration:", duration);
      setAvailabilityError("Invalid session duration");
      setLoadingAvailability(false);
      return;
    }

    try {
      const res = await availability.getGuideAvailability(id, duration);
      console.log("Availability response:", res);
      
      const availabilityData = res?.data?.availability;
      
      // Check if the response contains an error
      if (availabilityData && typeof availabilityData === 'object' && availabilityData.error) {
        console.warn("Backend returned error:", availabilityData.error);
        setGuideAvailability([]);
        setAvailabilityError(availabilityData.error);
        return;
      }
      
      // Ensure we always set an array
      if (Array.isArray(availabilityData)) {
        setGuideAvailability(availabilityData);
        if (availabilityData.length === 0) {
          setAvailabilityError("This guide hasn't configured their availability yet");
        }
      } else {
        console.warn("Availability data is not an array:", availabilityData);
        setGuideAvailability([]);
        setAvailabilityError("Invalid availability data received");
      }
    } catch (error) {
      console.error("Error fetching guide availability:", error);
      setGuideAvailability([]);
      
      // Extract error message from response if available
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Failed to load availability. Please try again.";
      setAvailabilityError(errorMessage);
      message.error("Failed to load guide availability");
    } finally {
      setLoadingAvailability(false);
    }
  };

  useEffect(() => {
    getServiceData();
    // eslint-disable-next-line
  }, [id]);

  const onBookServiceClick = async () => {
    try {
      // Validate required data before making the request
      if (!id) {
        message.error("Service ID is missing");
        return;
      }
      
      if (!selectedSlot) {
        message.error("Please select a time slot");
        return;
      }

      console.log("Booking request data:", {
        serviceId: id,
        dateAndTime: selectedSlot,
        service: serviceData
      });

      const res = await booking.bookService({
        serviceId: id,
        dateAndTime: selectedSlot,
      });

      console.log("Booking response:", res);

      // Check if the service is free or has zero price
      const isFreeSession = serviceData?.price === 0 || serviceData?.price === "0" || serviceData?.price === "Free";
      
      if (isFreeSession) {
        // For free sessions, directly navigate to success page
        message.success("🎉 Free session booked successfully! No payment required.");
        navigate("/success", { 
          state: { 
            isFreeSession: true,
            serviceName: serviceData?.name,
            guide: serviceData?.guide?.name,
            dateTime: selectedSlot
          }
        });
      } else {
        // For paid sessions, process payment through Razorpay
        handlePayment(
          res.data.order.id, 
          (response) => {
            console.log("Payment successful:", response);
            message.success("Payment successful! Session booked.");
            navigate("/success");
          },
          (error) => {
            console.error("Payment failed:", error);
            message.error("Payment failed. Please try again.");
            // Stay on the booking page if payment fails
          }
        );
      }
    } catch (error) {
      console.error("Error booking service:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Failed to book session. Please try again.";
      message.error(errorMessage);
    }
  };

  // Only learners can book
  const isLearner = user && (user.role === "learner" || user.role === "student");

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-4">
            {loadingService ? (
              <Card className="flex items-center justify-center h-64">
                <Spin size="large" />
              </Card>
            ) : (
              <Card className={`text-white ${
                serviceData?.price === 0 || serviceData?.price === "0" || serviceData?.price === "Free"
                  ? 'bg-gradient-to-br from-green-500 to-green-600'
                  : 'bg-blue-600'
              }`}>
                <div className="flex items-center mb-4">
                  <AiOutlineArrowLeft className="mr-2 text-xl" />
                  <h2 className="text-2xl font-bold">{serviceData?.name}</h2>
                </div>
                
                {/* Price Section with Free Session Badge */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <MdOutlineCurrencyRupee className="mr-2 text-xl " />
                    <span className="text-lg font-semibold">
                      {serviceData?.price === 0 || serviceData?.price === "0" || serviceData?.price === "Free" 
                        ? "Free Session" 
                        : `₹${serviceData?.price}`}
                    </span>
                  </div>
                  {(serviceData?.price === 0 || serviceData?.price === "0" || serviceData?.price === "Free") && (
                    <span className="px-3 py-1 text-xs font-bold text-green-700 bg-white rounded-full">
                      🎉 FREE
                    </span>
                  )}
                </div>
                
                <div className="flex items-center mb-4">
                  <FaClock className="mr-2" />
                  <span>{serviceData?.duration} mins meeting</span>
                </div>
                <p>{serviceData?.description}</p>
                
                {/* Free Session Benefits */}
                {(serviceData?.price === 0 || serviceData?.price === "0" || serviceData?.price === "Free") && (
                  <div className="mt-4 p-3 bg-white bg-opacity-20 rounded-lg">
                    <p className="text-sm font-medium">✨ Free Session Benefits:</p>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• No payment required</li>
                      <li>• Instant booking confirmation</li>
                      <li>• Perfect for trying our platform</li>
                      <li>• Leave a review to help the guide</li>
                    </ul>
                  </div>
                )}
              </Card>
            )}
          </div>
          <Card className="p-4">
            <h3 className="mb-2 text-lg font-semibold">Select Date</h3>
            {loadingAvailability ? (
              <div className="flex items-center justify-center h-full">
                <Spin size="large" />
              </div>
            ) : availabilityError ? (
              <div className="p-4 text-red-600 bg-red-50 rounded-md border border-red-200">
                <div className="flex items-start">
                  <div className="mr-3 text-red-500">⚠️</div>
                  <div className="flex-1">
                    <p className="font-medium mb-1">Unable to Load Availability</p>
                    <p className="text-sm text-red-700">{availabilityError}</p>
                    <Button 
                      size="small" 
                      onClick={() => {
                        const guideId = serviceData?.guide?._id || serviceData?.guide;
                        if (guideId) {
                          getGuideAvailability(guideId, serviceData.duration);
                        }
                      }}
                      className="mt-3"
                      type="primary"
                      danger
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              </div>
            ) : guideAvailability.length === 0 ? (
              <div className="p-6 text-center text-gray-600 bg-gray-50 rounded-md">
                <div className="mb-3">📅</div>
                <h4 className="font-medium mb-2">No Availability Set</h4>
                <p className="text-sm">
                  This guide hasn't set up their availability yet. 
                  <br />
                  Please check back later or contact the guide directly.
                </p>
              </div>
            ) : (
              <div className="flex gap-2 my-6">
                {guideAvailability.map((item, index) => (
                  <div
                    onClick={() => {
                      setActiveIndex(index);
                      setSelectedSlot(null);
                    }}
                    key={item.id || index}
                    className={`p-2 rounded-md cursor-pointer ${
                      activeIndex === index ? "bg-blue-600" : ""
                    }`}
                  >
                    {moment(item.date).format("DD MMM")}
                  </div>
                ))}
              </div>
            )}

            {activeIndex !== null && guideAvailability[activeIndex] && (
              <>
                <h3 className="mb-2 text-lg font-semibold">Select Time Slot</h3>
                <div className="flex gap-2 my-6 overflow-x-auto">
                  {Array.isArray(guideAvailability[activeIndex]?.slots) && guideAvailability[activeIndex].slots.length > 0 ? (
                    guideAvailability[activeIndex].slots.map((slot, slotIndex) => (
                      <div
                        onClick={() => setSelectedSlot(slot.fullStart)}
                        key={slot.id || slotIndex}
                        className={`p-2 rounded-md cursor-pointer ${
                          selectedSlot === slot.fullStart ? "bg-blue-600" : ""
                        }`}
                      >
                        {slot.startTime}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-gray-600 bg-gray-50 rounded-md">
                      <p>No time slots available for this date.</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {!isLearner && (
              <div className="p-4 mb-4 bg-yellow-100 text-yellow-800 rounded">
                Only learners can book sessions. Please sign in as a learner to book.
              </div>
            )}

            <Button
              disabled={!isLearner || selectedSlot === null || guideAvailability.length === 0}
              type="primary"
              block
              size="large"
              onClick={onBookServiceClick}
              className={
                serviceData?.price === 0 || serviceData?.price === "0" || serviceData?.price === "Free"
                  ? "bg-green-600 hover:bg-green-700 border-green-600"
                  : ""
              }
            >
              {guideAvailability.length === 0 
                ? "No Availability" 
                : !isLearner
                  ? "Booking restricted to learners"
                  : selectedSlot === null 
                    ? "Select a Time Slot"
                    : serviceData?.price === 0 || serviceData?.price === "0" || serviceData?.price === "Free"
                      ? "Book Free Session"
                      : `Pay ₹${serviceData?.price} & Book`}
            </Button>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Booking;
