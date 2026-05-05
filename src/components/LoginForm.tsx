import { useAuth } from "@/contexts/authContext";
import { loginFormSchema, type LoginUserInputs } from "@/schemas/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";

const LoginForm = () => {
  const { actions } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [formError, setFormError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // USEFORM
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
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

    setLoading(true);

    try {
      await actions.loginUser(data);
    } catch (error: any) {
      setFormError(
        error.response?.data?.message || "Något gick fel, försök igen.",
      );
      setLoading(false);

      return;
    }

    setFormError("");
    reset({ email: "", password: "" });
    setLoading(false);
    navigate(from, { replace: true });
    return;
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div>
          {/* EMAIL */}
          <h4 className="mb-2">EMAIL</h4>
          <input
            type="email"
            id="email"
            {...register("email", { required: true })}
          />
          {errors.email && <p>Vänligen fyll i en epostadress</p>}

          {/* PASSWORD */}
          <h4 className="mb-2 mt-3">LÖSENORD</h4>
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
            <button
              type="submit"
              className="mt-7 p-2 px-5 rounded-md cursor-pointer border-2 border-emerald-500 w-full bg-green-800 text-white hover:bg-green-500/60 hover:border-emerald-700  transition duration-300 ease-in-out;"
              disabled={loading}
            >
              {loading ? "LOGGAR IN..." : "LOGGA IN"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default LoginForm;
