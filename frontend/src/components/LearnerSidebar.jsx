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
            to="/"
            className="flex items-center px-4 py-2 mb-2 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 hover:text-gray-700"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="mx-4 font-medium">Home</span>
          </NavLink>

          <NavLink
            to="/dashboard"
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
                d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="mx-4 font-medium">Dashboard</span>
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
                d="M9 19C9 20.1046 9.89543 21 11 21H13C14.1046 21 15 20.1046 15 19V13C15 11.8954 14.1046 11 13 11H11C9.89543 11 9 11.8954 9 13V19Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 13C3 14.1046 3.89543 15 5 15H7C8.10457 15 9 14.1046 9 13V9C9 7.89543 8.10457 7 7 7H5C3.89543 7 3 7.89543 3 9V13Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15 17C15 18.1046 15.8954 19 17 19H19C20.1046 19 21 18.1046 21 17V5C21 3.89543 20.1046 3 19 3H17C15.8954 3 15 3.89543 15 5V17Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="mx-4 font-medium">Learning Progress</span>
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

            <span className="mx-4 font-medium">Bookings</span>
          </NavLink>

          <NavLink
            to="/support"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mt-5 ${
                isActive ? "bg-blue-100 text-blue-700" : "text-gray-600"
              } transition-colors duration-300 transform rounded-lg hover:bg-blue-100 hover:text-blue-700`
            }
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            <span className="mx-4 font-medium">Support Tickets</span>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};

export default LearnerSidebar;