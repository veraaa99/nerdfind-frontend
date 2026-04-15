import { Outlet } from "react-router";

const RootLayout = () => {
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
