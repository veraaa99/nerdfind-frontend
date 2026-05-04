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
    navigate("/", { replace: true });
    return;
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="flex flex-col w-full gap-1 md:w-120">
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
            <button
              type="submit"
              className="cursor-pointer border rounded-lg p-3"
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
