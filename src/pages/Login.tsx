import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { useAuth } from "@/contexts/authContext";

const Login = () => {
  const { user } = useAuth();

  return (
    <div className=" p-10 ">
      {user ? (
        <>
          <div className="h-50 flex justify-center items-center">
            <h1 className="text-center">SKAPA KONTO</h1>
          </div>

          <RegisterForm />
        </>
      ) : (
        <>
          <div className="h-50 flex justify-center items-center">
            <h1 className="text-center">LOGGA IN</h1>
          </div>
          <div className="md:max-w-xl mx-auto">
            <LoginForm />
            <h2 className="mt-10 mb-5 text-left">
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
