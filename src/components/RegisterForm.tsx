import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { useAuth } from "@/contexts/authContext";
import { registerFormSchema, type RegisterUserInputs } from "@/schemas/zod";
import { useNavigate } from "react-router";
import { useState } from "react";

const RegisterForm = () => {
  const { actions } = useAuth();
  const navigate = useNavigate();
  const [registerFormError, setRegisterFormError] = useState<string>("");

  // USEFORM
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterUserInputs>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      isHost: false,
    },
  });

  // CONSOLE LOG ERRORS
  const onError = (errors: any) => {
    console.log("ERRORS:", errors);
  };

  // ONSUBMIT
  async function onSubmit(data: RegisterUserInputs) {
    if (!data.name || !data.email || !data.password || !data.confirmPassword) {
      setRegisterFormError("Fyll i alla fält");
      return;
    }

    try {
      await actions.registerUser(data);
    } catch (error: any) {
      setRegisterFormError(
        error.response?.data?.message || "Något gick fel, försök igen.",
      );
      return;
    }

    setRegisterFormError("");
    navigate("/", { replace: true });
    return;
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div>
          {/* NAME */}
          <h3>NAMN</h3>
          <input
            type="name"
            id="name"
            {...register("name", { required: true })}
          />
          {errors.name && <p>Vänligen fyll i ett namn</p>}
          {/* EMAIL */}
          <h4>EMAIL</h4>
          <input
            type="email"
            id="email"
            {...register("email", { required: true })}
          />
          {errors.email && <p>Vänligen fyll i en epostadress</p>}
          {/* PASSWORD */}
          <h4>LÖSENORD (MINST 10 TECKEN)</h4>
          <input
            type="password"
            id="password"
            {...register("password", { required: true })}
          />
          {errors.password && <p>Vänligen fyll i ett lösenord</p>}

          {/* CONFIRM PASSWORD */}
          <h4>UPPREPA LÖSENORD</h4>
          <input
            type="password"
            id="confirmPassword"
            {...register("confirmPassword", { required: true })}
          />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

          {/* IS HOST */}
          <h4>ÄR DETTA ETT FÖRETAGSKONTO?</h4>
          <Controller
            name="isHost"
            control={control}
            render={({ field: { value, onChange } }) => (
              <div>
                <Badge variant="default">
                  <Checkbox
                    id="isHost"
                    checked={value}
                    onCheckedChange={(checked) => onChange(checked === true)}
                  />
                  <label htmlFor="isHost">Detta är ett företagskonto</label>
                </Badge>
              </div>
            )}
          />

          <div>
            <p>{registerFormError}</p>
          </div>

          {/* REGISTER USER */}
          <div>
            <button type="submit" className="cursor-pointer">
              SKAPA KONTO
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default RegisterForm;
