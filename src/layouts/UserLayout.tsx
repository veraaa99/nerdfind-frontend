import { Navigate, Outlet, useLocation, type Location } from "react-router";
import { useAuth } from "../contexts/authContext";

const UserLayout = () => {
  const { user, isAuthChecked } = useAuth();
  const location: Location<any> = useLocation();

  if (!isAuthChecked) {
    return <p>Laddar...</p>;
  }

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
