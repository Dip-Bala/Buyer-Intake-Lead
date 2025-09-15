"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";

type FormFields = {
  email: string;
  password: string;
};

export default function Login() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const res = await axios.post("/api/auth/login", data);

      // Successful login: redirect to home
      if (res.status === 200) {
        reset();
        router.push("/");
      }
    } catch (err: any) {
      const status = err.response?.status;
      const message = err.response?.data?.error || "Login failed";

       if (status === 403) {
        // User not registered → redirect to signup
        router.push("/signup");
      } else if (status === 401) {
        // Incorrect password → form-level error
        setError("root", { message });
      } else {
        // Other errors → generic form-level error
        // setError("root", { message });
        console.log(err)
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto mt-20 flex flex-col gap-4"
    >
      {/* Email */}
      <input
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Invalid email format",
          },
        })}
        type="email"
        placeholder="Email"
        className="border p-2 rounded"
      />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}

      {/* Password */}
      <input
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
          maxLength: {
            value: 12,
            message: "Password cannot exceed 12 characters",
          },
        })}
        type="password"
        placeholder="Password"
        className="border p-2 rounded"
      />
      {errors.password && (
        <p className="text-red-500">{errors.password.message}</p>
      )}

      {/* Form-level error */}
      {errors.root && <p className="text-red-500">{errors.root.message}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white p-2 rounded"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
