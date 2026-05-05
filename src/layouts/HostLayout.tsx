import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../contexts/authContext";

const HostLayout = () => {
  const { user, isHost } = useAuth();
  const location = useLocation();

  return (
    <>
      {user && isHost == true ? (
        <Outlet />
      ) : (
        <Navigate to="/login" state={{ from: location }} replace />
      )}
    </>
  );
};

export default HostLayout;
