import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OtpDialog } from "../components/Components";

function PlayGame() {
  const navigate = useNavigate();

  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(true);
  const [enteredOTP, setEnteredOTP] = useState("");

  const handleEnterOTP = () => {
    console.log("Entered OTP:", enteredOTP);
    setIsOtpDialogOpen(false);
    navigate(`/live/${enteredOTP}`);
  };

  return (
    <main>
      {isOtpDialogOpen && (
        <OtpDialog
          enteredOTP={enteredOTP}
          setEnteredOTP={setEnteredOTP}
          handleEnterOTP={handleEnterOTP}
        />
      )}
    </main>
  );
}

export default PlayGame;
