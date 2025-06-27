import React from "react";
import { FaPhone, FaEdit, FaGift } from "react-icons/fa"; // Example icons

const ServiceCard = ({ service, onEdit, onToggleStatus }) => {
  const isFreeService = service?.price === 0 || service?.price === "0";
  
  return (
    <div className={`p-4 mb-4 bg-white border rounded-lg shadow-lg ${
      isFreeService ? 'border-green-300 bg-green-50' : ''
    }`}>
      {/* Service Icon */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {isFreeService ? (
            <FaGift className="text-green-600" size={24} />
          ) : (
            <FaPhone className="text-purple-600" size={24} />
          )}
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {service?.name}
            </h3>
            {isFreeService && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                FREE SESSION
              </span>
            )}
          </div>
        </div>
        {/* Enable/Disable Button */ }
        <button
          onClick={() => onToggleStatus(service._id, service.active)}
          className={`${
            service?.active ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
          } text-white px-3 py-1 rounded-md transition-colors`}
        >
          {service?.active ? "Enabled" : "Disabled"}
        </button>
      </div>

      {/* Service Description */}
      <p className="mb-3 text-gray-600">{service?.description}</p>

      {/* Service Price */}
      <div className="flex justify-between px-3 mb-3 text-lg font-bold text-gray-800">
        <p className={isFreeService ? 'text-green-600' : ''}> 
          Price: {isFreeService ? 'FREE' : `₹${service?.price}`}
        </p>
        <p> Duration: {service?.duration} mins.</p>
      </div>

      {isFreeService && (
        <div className="mb-3 p-2 bg-green-100 rounded border border-green-200">
          <p className="text-sm text-green-700">
            🎉 This is a free session! Perfect for building reviews and testing your booking flow.
          </p>
        </div>
      )}

      {/* Action Buttons: Edits */}
      <div className="flex items-center justify-end gap-4">
        <button
          onClick={onEdit}
          className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
        >
          <FaEdit size={16} />
          Edit
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
