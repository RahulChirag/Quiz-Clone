import React from "react";
import { useUserAuth } from "../context/FirebaseAuthContext";

const Header = ({ showUserName, userName, role }) => {
  const { logout } = useUserAuth();

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white shadow-md">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold">
          {role ? <span>{role}</span> : ""} Dashboard
        </h1>
        {showUserName && (
          <span className="text-lg font-medium">{userName}</span>
        )}
      </div>
      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
