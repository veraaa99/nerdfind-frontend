import axios from "@/api/axios";
import type { LoginUserInputs, RegisterUserInputs } from "@/schemas/zod";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

type AuthState = {
  user: string | null;
  isHost: boolean;
  token: string | null;
  isAuthChecked: boolean;
  actions: {
    registerUser: (userInformation: RegisterUserInputs) => void;
    loginUser: (userInformation: LoginUserInputs) => void;
    logoutUser: () => void;
  };
};

const defaultState: AuthState = {
  user: null,
  isHost: false,
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
  const [user, setUser] = useState<string | null>(null);
  const [isHost, setIsHost] = useState<boolean>(false);

  const [token, setToken] = useState<string | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState<boolean>(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const userToken: string | null = sessionStorage.getItem("jwt");
        if (!userToken) return;

        const res = await axios.get("api/users/check", {
          headers: {
            authorization: `Bearer ${sessionStorage.getItem("jwt") || ""}`,
          },
        });

        if (res.status === 200) {
          setToken(sessionStorage.getItem("jwt"));
          setUser(res.data._id);
          if (res.data.isHost) {
            setIsHost(true);
          }
        }
      } catch (error: any) {
        console.log(error.response.data);
        sessionStorage.removeItem("jwt");
        setIsHost(false);

        throw error;
      } finally {
        setIsAuthChecked(true);
      }
    };
    checkToken();
  }, []);

  const registerUser: typeof defaultState.actions.registerUser = async (
    userInformation: RegisterUserInputs,
  ) => {
    try {
      const res = await axios.post("api/users/register", userInformation);

      if (res.status !== 201) return;

      setToken(res.data.userToken);
      setUser(res.data._id);
      sessionStorage.setItem("jwt", res.data.userToken);
      if (res.data.isHost) {
        setIsHost(true);
      }
      return;
    } catch (error: any) {
      console.log(error.response.data);
      throw error;
    }
  };

  const loginUser: typeof defaultState.actions.loginUser = async (
    userInformation: LoginUserInputs,
  ) => {
    try {
      const res = await axios.post("api/users/login", userInformation);

      if (res.status !== 200) return;

      setToken(res.data.userToken);
      setUser(res.data._id);
      sessionStorage.setItem("jwt", res.data.userToken);
      if (res.data.isHost) {
        setIsHost(true);
      }
      return;
    } catch (error: any) {
      console.log(error.response.data);
      throw error;
    }
  };

  const logoutUser: typeof defaultState.actions.logoutUser = () => {
    sessionStorage.removeItem("jwt");
    setToken(null);
    setUser(null);
    setIsHost(false);

    return;
  };

  const actions = { registerUser, loginUser, logoutUser };

  return (
    <AuthContext.Provider
      value={{ user, isHost, token, isAuthChecked, actions }}
    >
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
