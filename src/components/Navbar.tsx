import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../contexts/authContext";
import { AiOutlineMenu } from "react-icons/ai";
import Modal from "react-modal";
import { useState } from "react";

const Navbar = () => {
  const { user, actions } = useAuth();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const handleMenuModal = () => {
    setIsMobileMenuOpen((isMobileMenuOpen) => !isMobileMenuOpen);
  };

  const handleLogout = () => {
    actions.logoutUser();
    setIsMobileMenuOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <nav className=" w-full flex h-25 sm:h-20 items-center bg-black/50">
      <div className="flex container mx-auto px-4 justify-end">
        <div className="font-(family-name:--font-nunito)">
          <AiOutlineMenu
            className="cursor-pointer sm:hidden"
            size={25}
            onClick={handleMenuModal}
          />
          <ul className="hidden sm:gap-3 sm:flex">
            <li className="hover:text-emerald-300 transition duration-300">
              <NavLink to="/">HEM</NavLink>
            </li>
            <li className="hover:text-emerald-300 transition duration-300">
              <NavLink to="listings">ALLA ANNONSER</NavLink>
            </li>
            {user ? (
              <li className="hover:text-emerald-300 transition duration-300">
                <NavLink to="profile">PROFIL</NavLink>
              </li>
            ) : (
              <li className="hover:text-emerald-300">
                <NavLink to="login">LOGGA IN</NavLink>
              </li>
            )}
            {user && (
              <li
                className="cursor-pointer text-red-400 hover:text-red-200 transition duration-300"
                onClick={handleLogout}
              >
                LOGGA UT
              </li>
            )}
          </ul>
        </div>
      </div>

      <Modal
        isOpen={isMobileMenuOpen}
        onRequestClose={() => setIsMobileMenuOpen(false)}
        className="modal h-full w-70 bg-emerald-950  text-emerald-500 pt-3 rounded-bl-xl shadow-lg max-w-md absolute right-0"
        overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-start z-50"
        closeTimeoutMS={300}
      >
        <div className="flex flex-row items-center justify-between p-5 font-(family-name:--font-nunito)">
          <h1 className="text-shadow-lg/50">MENY</h1>
          <h2
            className="font-light cursor-pointer hover:text-emerald-300 transition duration-300"
            onClick={handleMenuModal}
          >
            ✕
          </h2>
        </div>
        <div className="flex flex-col gap-4 p-5">
          <ul className="flex flex-col gap-5">
            <li className="hover:text-emerald-300 transition duration-300">
              <NavLink to="/" onClick={handleMenuModal}>
                HEM
              </NavLink>
            </li>
            <li className="hover:text-emerald-300 transition duration-300">
              <NavLink to="listings" onClick={handleMenuModal}>
                ALLA ANNONSER
              </NavLink>
            </li>
            {user ? (
              <li className="hover:text-emerald-300 transition duration-300">
                <NavLink to="profile" onClick={handleMenuModal}>
                  PROFIL
                </NavLink>
              </li>
            ) : (
              <li className="hover:text-emerald-300">
                <NavLink to="login" onClick={handleMenuModal}>
                  LOGGA IN
                </NavLink>
              </li>
            )}
            {user && (
              <li
                className="cursor-pointer  text-red-400 hover:text-red-200 transition duration-300"
                onClick={handleLogout}
              >
                LOGGA UT
              </li>
            )}
          </ul>
        </div>
      </Modal>
    </nav>
  );
};
export default Navbar;
