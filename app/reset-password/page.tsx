"use client";
import { CustomButton, SectionTitle } from "@/components";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api";

const ResetPasswordPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  useEffect(() => {
    // جلب الإيميل من localStorage
    const email = localStorage.getItem('resetEmail');
    if (!email) {
      router.push("/forgot-password");
      return;
    }
    setResetEmail(email);
  }, [router]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const newPassword = e.target[0].value;
    const confirmPassword = e.target[1].value;

    if (!newPassword || newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (confirmPassword !== newPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await apiClient.auth.resetPassword({
        email: resetEmail,
        newPassword: newPassword,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password reset successfully");
        // تنظيف البيانات المؤقتة
        localStorage.removeItem('resetEmail');
        localStorage.removeItem('verifiedResetCode');
        router.push("/login");
      } else {
        if (data.message) {
          setError(data.message);
          toast.error(data.message);
        } else if (data.error) {
          setError(data.error);
          toast.error(data.error);
        } else {
          setError("Failed to reset password");
          toast.error("Failed to reset password");
        }
      }
    } catch (error) {
      toast.error("Error, try again");
      setError("Error, try again");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <SectionTitle title="Reset Password" path="Home | Reset Password" />
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl font-normal leading-9 tracking-tight text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password for {resetEmail}
          </p>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  New Password
                </label>
                <div className="mt-2">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirm New Password
                </label>
                <div className="mt-2">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div>
                <CustomButton
                  buttonType="submit"
                  text={isLoading ? "Resetting..." : "Reset Password"}
                  paddingX={3}
                  paddingY={1.5}
                  customWidth="full"
                  textSize="sm"
                  disabled={isLoading}
                />
              </div>
            </form>

            <div className="mt-6">
              <p className="text-red-600 text-center text-[16px] my-4">
                {error && error}
              </p>
              
              <div className="text-center">
                <button
                  onClick={() => router.push("/verify-reset-code")}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Back to Verify Code
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
