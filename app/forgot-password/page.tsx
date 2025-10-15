"use client";
import { CustomButton, SectionTitle } from "@/components";
import { isValidEmailAddressFormat } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;

    if (!isValidEmailAddressFormat(email)) {
      setError("Email is invalid");
      toast.error("Email is invalid");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await apiClient.auth.forgotPassword({
        email: email.trim(),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Reset code sent to your email");
        // حفظ الإيميل في localStorage للاستخدام في الصفحات التالية
        localStorage.setItem('resetEmail', email.trim());
        router.push("/verify-reset-code");
      } else {
        if (data.message) {
          setError(data.message);
          toast.error(data.message);
        } else if (data.error) {
          setError(data.error);
          toast.error(data.error);
        } else {
          setError("Failed to send reset code");
          toast.error("Failed to send reset code");
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
      <SectionTitle title="Forgot Password" path="Home | Forgot Password" />
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl font-normal leading-9 tracking-tight text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we will send you a reset code
          </p>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <CustomButton
                  buttonType="submit"
                  text={isLoading ? "Sending..." : "Send Reset Code"}
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
                  onClick={() => router.push("/login")}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
