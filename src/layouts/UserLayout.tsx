import { Navigate, Outlet, useLocation, type Location } from "react-router";
import { useAuth } from "../contexts/authContext";

const UserLayout = () => {
  const { user } = useAuth();
  const location: Location<any> = useLocation();

  return (
    <>
      {user ? (
        <Outlet />
      ) : (
        <Navigate to="/login" replace state={{ from: location.pathname }} />
      )}
    </>
  );
};

export default UserLayout;
