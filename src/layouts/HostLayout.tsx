import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../contexts/authContext";

const HostLayout = () => {
  const { user, isHost, isAuthChecked } = useAuth();
  const location = useLocation();

  if (!isAuthChecked) {
    return <p>Laddar...</p>;
  }

  return (
    <>
      {user && isHost ? (
        <Outlet />
      ) : (
        <Navigate to="/login" state={{ from: location }} replace />
      )}
    </>
  );
};

export default HostLayout;
