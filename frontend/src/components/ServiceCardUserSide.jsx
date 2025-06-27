import React from "react";
import { useNavigate } from "react-router-dom";

const ServiceCardUserSide = ({ service, username }) => {
  const navigate = useNavigate();
  const isFreeService = service?.price === 0 || service?.price === "0";

  // Function to handle card click
  const onCardClick = () => {
    // Navigate to GuideDetails page, passing the username
    navigate(`/guide/${username}/${service?._id}`);
  };
  
  return (
    <>
      <div
        onClick={onCardClick}
        className={`p-4 shadow-2xl cursor-pointer group rounded-2xl transition-all duration-300 ${
          isFreeService 
            ? 'bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-2 border-green-300' 
            : 'bg-gray-100 hover:bg-gray-200'
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="py-2 text-2xl font-bold lg:pb-4">{service?.name}</div>
          {isFreeService && (
            <span className="px-3 py-1 text-xs font-bold text-green-700 bg-green-200 rounded-full">
              FREE
            </span>
          )}
        </div>
        
        <div className={`p-2 rounded-2xl transition-colors ${
          isFreeService 
            ? 'bg-green-200 group-hover:bg-green-300' 
            : 'bg-gray-200 group-hover:bg-gray-300'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
                className="w-8 h-8 m-2 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                ></path>
              </svg>
              <div className="flex flex-col ml-2">
                <div className="text-sm font-bold">
                  {service?.duration} mins
                </div>
                <div className="text-sm">Video Meeting</div>
              </div>
            </div>
            <div className={`flex items-center border rounded-full transition-colors ${
              isFreeService
                ? 'border-green-600 group-hover:bg-green-600 group-hover:text-white'
                : 'border-gray-600 group-hover:bg-black group-hover:text-white'
            }`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
                className="w-6 h-6 m-2 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                ></path>
              </svg>
              <div className={`font-bold ${isFreeService ? 'text-green-700' : ''}`}>
                {isFreeService ? 'FREE' : `₹${service?.price}`}
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
                className="w-4 h-4 m-2 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        
        {isFreeService && (
          <div className="mt-3 p-2 bg-green-100 rounded-lg border border-green-200">
            <p className="text-xs text-green-700 text-center">
              🎉 Book this free session to try out our platform!
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ServiceCardUserSide;
