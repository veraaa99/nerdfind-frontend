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
    <div className="min-h-screen bg-emerald-950 text-emerald-500 flex flex-col">
      <Navbar />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
