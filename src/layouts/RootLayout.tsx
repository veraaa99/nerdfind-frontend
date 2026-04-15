import { Outlet } from "react-router";
import { useAuth } from "../contexts/authContext";

const RootLayout = () => {
  const { isAuthChecked } = useAuth();

  if (!isAuthChecked) {
    return <div></div>;
  }

  return (
    <div className="min-h-svh bg-blue-950">
      {/* NAVBAR */}
      <main>
        <Outlet />
      </main>
      {/* FOOTER */}
    </div>
  );
};

export default RootLayout;
