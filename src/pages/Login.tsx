import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { useAuth } from "@/contexts/authContext";
import { dummyUsers } from "@/data/users";

const Login = () => {
  const { user } = useAuth();
  // const user = dummyUsers[0];

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
        </>
      )}
    </div>
  );
};

export default Login;
