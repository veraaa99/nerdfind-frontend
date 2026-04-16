import {
  Outlet,
  useLocation,
  useNavigate,
  type Location,
  type NavigateFunction,
} from "react-router";
import { useAuth } from "../contexts/authContext";

const UserLayout = () => {
  const { user } = useAuth();
  const navigate: NavigateFunction = useNavigate();
  const location: Location<any> = useLocation();

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
