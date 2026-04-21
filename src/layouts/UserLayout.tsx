import {
  Outlet,
  useLocation,
  useNavigate,
  type Location,
  type NavigateFunction,
} from "react-router";
import { useAuth } from "../contexts/authContext";
import { dummyUsers } from "@/data/users";

const UserLayout = () => {
  // const { user } = useAuth();
  const navigate: NavigateFunction = useNavigate();
  const location: Location<any> = useLocation();
  const user = dummyUsers[0];

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
