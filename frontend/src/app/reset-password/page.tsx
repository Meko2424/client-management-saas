"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { resetPasswordApi } from "@/lib/authApi";
import { showError, showSuccess } from "@/lib/toastUtils";

type ResetPasswordForm = {
  newPassword: string;
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="p-6">Loading reset page...</p>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ResetPasswordForm>();

  async function onSubmit(data: ResetPasswordForm) {
    if (!token) {
      showError(null, "Reset token is missing");
      return;
    }

    try {
      await resetPasswordApi({
        token,
        newPassword: data.newPassword,
      });

      showSuccess("Password reset successful. Please log in.");
      router.push("/login");
    } catch (error) {
      showError(error, "Invalid or expired reset token");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow"
      >
        <h1 className="mb-2 text-center text-2xl font-bold">Reset password</h1>

        <p className="mb-6 text-center text-sm text-gray-500">
          Enter your new password below.
        </p>

        {!token && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">
            Reset token is missing. Please request a new reset link.
          </div>
        )}

        <input
          className="mb-4 w-full rounded border p-2"
          placeholder="New password"
          type="password"
          {...register("newPassword", {
            required: true,
            minLength: 8,
          })}
        />

        <button
          disabled={isSubmitting || !token}
          className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {isSubmitting ? "Resetting..." : "Reset password"}
        </button>

        <p className="mt-4 text-center text-sm">
          Back to{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            login
          </Link>
        </p>
      </form>
    </div>
  );
}
