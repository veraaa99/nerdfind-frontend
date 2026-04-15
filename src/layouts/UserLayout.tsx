import { Outlet, useLocation, useNavigate } from "react-router";
import { useAuth } from "../contexts/authContext";

const UserLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {user ? (
        <Outlet />
      ) : (
        navigate("/login", {
          replace: true,
          state: { from: location.pathname },
        })
      )}
    </>
  );
};

export default UserLayout;
