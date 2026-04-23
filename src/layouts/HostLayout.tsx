import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts/authContext";
import { dummyUsers } from "@/data/users";

const HostLayout = () => {
  // const { user } = useAuth();
  const user = dummyUsers[0];

  return (
    <>
      {user && user.isHost == true ? <Outlet /> : <Navigate to="/" replace />}
    </>
  );
};

export default HostLayout;
