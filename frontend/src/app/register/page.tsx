"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { registerApi } from "@/lib/authApi";
//import { useAuth } from "@/context/AuthContext";

type RegisterFormData = {
  fullName: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const router = useRouter();
  //const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterFormData>();

  async function onSubmit(data: RegisterFormData) {
    try {
      //   // Send registration data to backend.
      //   const response = await registerApi(data);

      //   // Store token and user info after successful registration.
      //   login(response);

      //   toast.success("Account created successfully");

      //   // Send user to clients page after registering.
      //   router.push("/clients");
      await registerApi(data);

      toast.success("Account created successfully. Please log in.");

      router.push("/login");
    } catch {
      toast.error("Registration failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-xl shadow w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-2 text-center">Create account</h1>

        <p className="text-center text-gray-500 mb-6">
          Start managing clients, projects, and invoices.
        </p>

        <input
          className="w-full border p-2 mb-4 rounded"
          placeholder="Full name"
          {...register("fullName", { required: true })}
        />

        <input
          className="w-full border p-2 mb-4 rounded"
          placeholder="Email"
          type="email"
          {...register("email", { required: true })}
        />

        <input
          className="w-full border p-2 mb-4 rounded"
          placeholder="Password"
          type="password"
          {...register("password", { required: true, minLength: 8 })}
        />

        <button
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
        >
          {isSubmitting ? "Creating account..." : "Register"}
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
