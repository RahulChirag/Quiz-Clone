import React from "react";

const OtpDialog = ({ enteredOTP, setEnteredOTP, handleEnterOTP }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
      <h2 className="text-2xl font-semibold mb-4 text-center">Enter OTP</h2>
      <input
        type="text"
        value={enteredOTP}
        onChange={(e) => setEnteredOTP(e.target.value)}
        placeholder="Enter OTP"
        className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleEnterOTP}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Submit OTP
      </button>
    </div>
  </div>
);

export default OtpDialog;
