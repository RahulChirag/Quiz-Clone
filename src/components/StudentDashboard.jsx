import React from "react";
import { useUserAuth } from "../context/FirebaseAuthContext";

const StudentDashboard = () => {
  const { logout } = useUserAuth();

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white shadow-md">
      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
      >
        Logout
      </button>
    </header>
  );
};

export default StudentDashboard;
