import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthChecked: boolean;
  actions: {
    registerUser: () => void;
    loginUser: () => void;
    logoutUser: () => void;
  };
};

const defaultState: AuthState = {
  user: null,
  token: null,
  isAuthChecked: false,
  actions: {
    registerUser: () => {},
    loginUser: () => {},
    logoutUser: () => {},
  },
};

export const AuthContext = createContext<AuthState>(defaultState);

const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState<boolean>(false);

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
      } catch (error: any) {
        console.log(error.message);
        sessionStorage.removeItem("jwt");
      } finally {
        setIsAuthChecked(true);
      }
    };
    checkToken();
  }, []);

  const registerUser: typeof defaultState.actions.registerUser = async () => {};

  const loginUser: typeof defaultState.actions.loginUser = async () => {};

  const logoutUser: typeof defaultState.actions.logoutUser = () => {
    sessionStorage.removeItem("jwt");
    setToken(null);
    setUser(null);
    return;
  };

  const actions = { registerUser, loginUser, logoutUser };

  return (
    <AuthContext.Provider value={{ user, token, isAuthChecked, actions }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error("useAuth must be called inside an AuthContextProvider");

  return context;
};
