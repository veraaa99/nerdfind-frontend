import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<String | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const userToken = sessionStorage.getItem("jwt");
        if (!userToken) return;

        const res = await axios.get("/auth/check", {
          headers: {
            authorization: `Bearer ${sessionStorage.getItem("jwt") || ""}`,
          },
        });

        if (res.status === 200) {
          setToken(sessionStorage.getItem("jwt"));
          setUser(res.data);
        }
      } catch (error) {
        console.log(error.message);
        sessionStorage.removeItem("jwt");
      } finally {
        setIsAuthChecked(true);
      }
    };
    checkToken();
  }, []);

  const value = { user, isAuthChecked };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error("useAuth must be called inside an AuthContextProvider");

  return context;
};
