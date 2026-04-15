import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../contexts/authContext";

const HostLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
