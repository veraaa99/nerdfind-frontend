import { useAuth } from "@/contexts/authContext";
import { loginFormSchema, type LoginUserInputs } from "@/schemas/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const LoginForm = () => {
  const { actions } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string>("");

  // USEFORM
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LoginUserInputs>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // CONSOLE LOG ERRORS
  const onError = (errors: any) => {
    console.log("ERRORS:", errors);
  };

  // ONSUBMIT
  async function onSubmit(data: LoginUserInputs) {
    if (!data.email || !data.password) {
      setFormError("Fyll i alla fält");
      return;
    }

    try {
      await actions.loginUser(data);
    } catch (error: any) {
      setFormError(
        error.response?.data?.message || "Något gick fel, försök igen.",
      );
      return;
    }

    setFormError("");
    navigate("/", { replace: true });
    return;
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div>
          {/* EMAIL */}
          <h4>EMAIL</h4>
          <input
            type="email"
            id="email"
            {...register("email", { required: true })}
          />
          {errors.email && <p>Vänligen fyll i en epostadress</p>}

          {/* PASSWORD */}
          <h4>LÖSENORD</h4>
          <input
            type="password"
            id="password"
            {...register("password", { required: true })}
          />
          {errors.password && <p>{errors.password.message}</p>}

          <div>
            <p>{formError}</p>
          </div>

          {/* LOGIN USER */}
          <div>
            <button type="submit" className="cursor-pointer">
              LOGGA IN
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default LoginForm;
