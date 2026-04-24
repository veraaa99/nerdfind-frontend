import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../contexts/authContext";

const Navbar = () => {
  const { user, actions } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    actions.logoutUser();
    navigate("/", { replace: true });
  };

  return (
    <div className="w-full">
      <div className="flex container mx-auto px-4 justify-between">
        <div>
          <img src="" alt="" />
        </div>
        <div>
          <ul className="flex gap-3">
            <li>
              <NavLink to="/">HEM</NavLink>
            </li>
            <li>
              <NavLink to="listings">ALLA ANNONSER</NavLink>
            </li>
            {user ? (
              <li>
                <NavLink to="profile">PROFIL</NavLink>
              </li>
            ) : (
              <li>
                <NavLink to="login">LOGGA IN</NavLink>
              </li>
            )}
            {user && (
              <p className="cursor-pointer" onClick={handleLogout}>
                LOGGA UT
              </p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
