import { NavLink } from "react-router";
import { useAuth } from "../contexts/authContext";
import { dummyUsers } from "@/data/users";

const Navbar = () => {
  // const { user } = useAuth();
  const user = dummyUsers[0];

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
            {user && <li>LOGGA UT</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
