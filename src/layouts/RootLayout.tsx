import { Outlet } from "react-router";
import { useAuth } from "../contexts/authContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const RootLayout = () => {
  const { isAuthChecked } = useAuth();

  if (!isAuthChecked) {
    return <div></div>;
  }

  return (
    <div className="min-h-svh bg-blue-950">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
