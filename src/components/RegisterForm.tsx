import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";

// FORM SCHEMA
const formSchema = z
  .object({
    name: z.string().nonempty(),
    email: z.email().nonempty(),
    password: z.string().nonempty().min(10),
    confirmPassword: z.string(),
    isHost: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Lösenorden matchar inte",
    path: ["confirmPassword"],
  });
type RegisterUserInputs = z.infer<typeof formSchema>;

const RegisterForm = () => {
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
    resolver: zodResolver(formSchema),
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
  const onSubmit = (data: RegisterUserInputs) => {
    console.log(data);
  };

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
          {/* EMAIL */}
          <h4>EMAIL</h4>
          <input
            type="email"
            id="email"
            {...register("email", { required: true })}
          />

          {/* PASSWORD */}
          <h4>LÖSENORD (MINST 10 TECKEN)</h4>
          <input
            type="password"
            id="password"
            {...register("password", { required: true })}
          />

          {/* CONFIRM PASSWORD */}
          <h4>UPPREPA LÖSENORD</h4>
          <input
            type="password"
            id="confirmPassword"
            {...register("confirmPassword", { required: true })}
          />

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
