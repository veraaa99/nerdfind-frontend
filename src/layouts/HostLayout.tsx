import { Outlet, useNavigate, type NavigateFunction } from "react-router";
import { useAuth } from "../contexts/authContext";
import { dummyUsers } from "@/data/users";

const HostLayout = () => {
  // const { user } = useAuth();
  const user = dummyUsers[0];
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
