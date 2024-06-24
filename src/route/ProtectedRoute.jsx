import { Navigate } from "react-router-dom";
import { useUserAuth } from "../context/FirebaseAuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useUserAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
