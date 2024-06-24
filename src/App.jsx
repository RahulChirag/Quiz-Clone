// App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  LoginPage,
  MainDashboard,
  NotFound,
  SignUpPage,
  PlayGame,
  PlayGameWithOTP,
} from "./pages/Pages";
import { useUserAuth } from "./context/FirebaseAuthContext";
import ProtectedRoute from "./route/ProtectedRoute";

function App() {
  const { user } = useUserAuth();

  const renderDashboard = () => {
    return <Navigate to="/dashboard" replace />;
  };

  return (
    <>
      <Routes>
        <Route path="/" element={user ? renderDashboard() : <LoginPage />} />
        <Route path="/admin/:code" element={<SignUpPage />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardRoutes />
            </ProtectedRoute>
          }
        />
        <Route path="/live/*" element={<PlayGameRoutes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function DashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainDashboard />} />
      <Route path="/:gameData/:isStarterContent" element={<MainDashboard />} />
    </Routes>
  );
}

function PlayGameRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PlayGame />} />
      <Route path=":otp" element={<PlayGameWithOTP />} />
    </Routes>
  );
}

export default App;
