import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { useAuth } from "@/contexts/authContext";
import { useNavigate } from "react-router";

const Login = () => {
  const { user, actions } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    actions.logoutUser();
    navigate("/", { replace: true });
  };

  return (
    <div className=" p-10 pb-30">
      {user !== null ? (
        <>
          <div className="h-50 flex flex-col justify-center items-center">
            <h1 className="text-center text-shadow-lg/50">SKAPA KONTO</h1>
          </div>

          <div className="md:max-w-xl mx-auto">
            <h2 className=" mb-5 text-left">
              DU ÄR REDAN INLOGGAD PÅ ETT KONTO. <br></br>VILL DU SKAPA ETT
              NYTT?
            </h2>
            <RegisterForm />
            <h2 className="mt-15 mb-5 text-left">ELLER</h2>
            <div className="flex flex-col gap-2 py-5 mt-7 items-center md:items-start">
              <a
                className="w-full text-center p-3 rounded-md cursor-pointer border-2 border-red-900 sm:w-50 bg-red-500/80 hover:bg-red-500 text-white transition duration-300 ease-in-out;"
                onClick={handleLogout}
              >
                LOGGA UT
              </a>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className=" h-50 flex justify-center items-center">
            <h1 className="text-shadow-lg/50 text-center">LOGGA IN</h1>
          </div>
          <div className="md:max-w-xl mx-auto">
            <LoginForm />
            <h2 className="mt-30 mb-5 text-left">
              HAR DU INGET KONTO ÄNNU? REGISTRERA DIG DIREKT!
            </h2>
            <RegisterForm />
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
