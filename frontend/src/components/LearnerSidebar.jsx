import React from "react";
import { NavLink } from "react-router-dom";
import useUserStore from "../store/user";

const LearnerSidebar = () => {
  const { user } = useUserStore();

  return (
    <aside className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-white border-r">
      <div className="flex flex-col items-center mt-6 -mx-2">
        <img
          className="object-cover w-24 h-24 mx-2 rounded"
          src={user.photoUrl || `https://ui-avatars.com/api?name=${user?.name}`}
          alt={`${user?.name}'s avatar`}
        />
        <h4 className="mx-2 mt-2 font-medium text-gray-800">{user?.name}</h4>
        <p className="mx-2 mt-1 text-sm font-medium text-gray-600">
          {user?.email}
        </p>
      </div>

      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav>
          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 ${
                isActive ? "bg-blue-100 text-blue-700" : "text-gray-600"
              } transition-colors duration-300 transform rounded-lg hover:bg-blue-100 hover:text-blue-700`
            }
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="mx-4 font-medium">Profile</span>
          </NavLink>

          <NavLink
            to="/dashboard/find-guides"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mt-5 ${
                isActive ? "bg-blue-100 text-blue-700" : "text-gray-600"
              } transition-colors duration-300 transform rounded-lg hover:bg-blue-100 hover:text-blue-700`
            }
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21L16.514 16.506L21 21ZM18.485 10.485C18.485 15.265 14.635 19.115 9.855 19.115C5.075 19.115 1.225 15.265 1.225 10.485C1.225 5.705 5.075 1.855 9.855 1.855C14.635 1.855 18.485 5.705 18.485 10.485Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="mx-4 font-medium">Find Guides</span>
          </NavLink>

          <NavLink
            to="/dashboard/bookings"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mt-5 ${
                isActive ? "bg-blue-100 text-blue-700" : "text-gray-600"
              } transition-colors duration-300 transform rounded-lg hover:bg-blue-100 hover:text-blue-700`
            }
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="mx-4 font-medium">My Sessions</span>
          </NavLink>

          <NavLink
            to="/dashboard/payment"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mt-5 ${
                isActive ? "bg-blue-100 text-blue-700" : "text-gray-600"
              } transition-colors duration-300 transform rounded-lg hover:bg-blue-100 hover:text-blue-700`
            }
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 6H21C22.1046 6 23 6.89543 23 8V16C23 17.1046 22.1046 18 21 18H3C1.89543 18 1 17.1046 1 16V8C1 6.89543 1.89543 6 3 6Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1 10H23"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 14H7.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="mx-4 font-medium">Payment History</span>
          </NavLink>

          <NavLink
            to="/dashboard/progress"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mt-5 ${
                isActive ? "bg-blue-100 text-blue-700" : "text-gray-600"
              } transition-colors duration-300 transform rounded-lg hover:bg-blue-100 hover:text-blue-700`
            }
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 12C22 17.523 17.523 22 12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 12L11 15L16 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="mx-4 font-medium">Learning Progress</span>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};

export default LearnerSidebar;
