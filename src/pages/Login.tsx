import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { useAuth } from "@/contexts/authContext";

const Login = () => {
  const { user } = useAuth();

  return (
    <div>
      {user ? (
        <>
          <h1>SKAPA KONTO</h1>
          <RegisterForm />
        </>
      ) : (
        <>
          <h1>LOGGA IN</h1>
          <LoginForm />
          <h2>HAR DU INGET KONTO ÄNNU? REGISTRERA DIG DIREKT!</h2>
          <RegisterForm />
        </>
      )}
    </div>
  );
};

export default Login;
