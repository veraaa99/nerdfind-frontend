import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <div>
      {/* NAVBAR */}
      <main>
        <Outlet />
      </main>
      {/* FOOTER */}
    </div>
  );
};

export default RootLayout;
