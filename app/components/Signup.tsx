"use client"

import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";


type FormFields = {
  email: string;
  password: string;
};

export default function Signup() {
 const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const res = await axios.post("/api/auth/signup", data); 
      if (res.status === 200) {
        reset();
        router.push("/login"); 
      }
    } catch (err: any) {
        const status = err.response?.status;
        const message = err.response?.data?.error || "Signup failed";
        if(status === 401){
            reset();
            router.push("/login"); 
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white p-2 rounded"
      >
        {isSubmitting ? "Signing up..." : "Signup"}
      </button>
    </form>
  );

}