import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

// FORM SCHEMA
const formSchema = z.object({
  email: z.email().nonempty(),
  password: z.string().nonempty(),
});
type LoginUserInputs = z.infer<typeof formSchema>;

const LoginForm = () => {
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
    resolver: zodResolver(formSchema),
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
  const onSubmit = (data: LoginUserInputs) => {
    console.log(data);
  };

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

          {/* PASSWORD */}
          <h4>LÖSENORD</h4>
          <input
            type="password"
            id="password"
            {...register("password", { required: true })}
          />

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
