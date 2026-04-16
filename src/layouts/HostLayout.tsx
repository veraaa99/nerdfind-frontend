import { Outlet, useNavigate, type NavigateFunction } from "react-router";
import { useAuth } from "../contexts/authContext";

const HostLayout = () => {
  const { user } = useAuth();
  const navigate: NavigateFunction = useNavigate();

  return (
    <>
      {user && user.isHost == true ? (
        <Outlet />
      ) : (
        navigate("/", { replace: true })
      )}
    </>
  );
};

export default HostLayout;
