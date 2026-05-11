"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { forgotPasswordApi } from "@/lib/authApi";

type ForgotPasswordForm = {
  email: string;
};

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ForgotPasswordForm>();

  async function onSubmit(data: ForgotPasswordForm) {
    try {
      await forgotPasswordApi(data);

      toast.success("If an account exists, a reset link has been sent.");
    } catch {
      toast.error("Unable to process request");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow"
      >
        <h1 className="mb-2 text-center text-2xl font-bold">Forgot password</h1>

        <p className="mb-6 text-center text-sm text-gray-500">
          Enter your email and we&apos;ll generate a password reset link.
        </p>

        <input
          className="mb-4 w-full rounded border p-2"
          placeholder="Email"
          type="email"
          {...register("email", { required: true })}
        />

        <button
          disabled={isSubmitting}
          className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Send reset link"}
        </button>

        <p className="mt-4 text-center text-sm">
          Remembered your password?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Back to login
          </Link>
        </p>
      </form>
    </div>
  );
}
