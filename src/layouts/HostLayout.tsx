import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts/authContext";

const HostLayout = () => {
  const { user } = useAuth();

  return (
    <>
      {user && user.isHost == true ? <Outlet /> : <Navigate to="/" replace />}
    </>
  );
};

export default HostLayout;
