import React from "react";
import { FaUniversity } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const GuideCard = ({ guide }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle card click
  const onCardClick = () => {
    // Navigate to guideDetails page, passing the username
    navigate(`/guide/${guide?.username}`);
  };

  return (
    <div
      onClick={onCardClick} // Trigger navigation on click //
      className="transition bg-white border rounded-lg shadow-md cursor-pointer hover:shadow-lg"
    >
      <div className="relative group">
        <img
          src={
            guide?.photoUrl ||
            `https://ui-avatars.com/api?name=${guide?.name}`
          }
          alt={`${guide?.name}'s avatar`}
          className="object-cover w-full h-64 rounded-t-lg "
        />
        <div className="absolute inset-0 transition-opacity bg-gradient-to-t from-black via-transparent to-transparent opacity-90 group-hover:opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-full p-2 text-center text-white">
          <h4 className="text-lg font-bold">
            {guide?.profile?.title || "Title"}
          </h4>
        </div>
      </div>
      <div className="p-4 ">
        <div className="m4 ">
          <h3 className="py-2 text-xl font-bold">{guide?.name || "Name"}</h3>
          <div className="flex gap-x-2">
            <FaUniversity />
            <p className="text-sm text-gray-500">
              {guide?.profile?.college || "College"}
            </p>
          </div>
        </div>
        <div className="flex mt-2 space-x-2">
          {guide?.profile?.tags.map((tag, index) => {
            return (
              <span
                key={index}
                className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full"
              >
                {tag || "Tag"}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GuideCard;
