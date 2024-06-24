// MainDashboard.jsx
import React, { useState, useEffect } from "react";
import { useUserAuth } from "../context/FirebaseAuthContext";
import { useParams } from "react-router-dom";
import {
  TeacherDashboard,
  StudentDashboard,
  Loading,
} from "../components/Components";

const MainDashboard = () => {
  const { user, getUserName, getRole } = useUserAuth();
  const { gameData, isStarterContent } = useParams();

  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");

  const [showUserName, setShowUserName] = useState(false);
  const [openUserNameDialog, setOpenUserNameDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const name = await getUserName();
        const userRole = await getRole();
        setUserName(name);
        setRole(userRole);
        if (!name) {
          setOpenUserNameDialog(true);
        } else {
          setShowUserName(true);
        }
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user, getUserName, getRole]);

  if (loading) {
    return <Loading />;
  }

  if (role === "Teacher") {
    return (
      <TeacherDashboard
        userName={userName}
        showUserName={showUserName}
        openUserNameDialog={openUserNameDialog}
        setUserName={setUserName}
        setOpenUserNameDialog={setOpenUserNameDialog}
        setShowUserName={setShowUserName}
        gameData={gameData}
        isStarterContent={isStarterContent}
      />
    );
  } else {
    return <StudentDashboard />;
  }
};

export default MainDashboard;
