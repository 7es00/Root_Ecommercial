"use client";
import { CustomButton, SectionTitle } from "@/components";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api";

const VerifyResetCodePage = () => {
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
    const resetCode = e.target[0].value;

    if (!resetCode || resetCode.length !== 6) {
      setError("Reset code must be 6 digits");
      toast.error("Reset code must be 6 digits");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await apiClient.auth.verifyResetCode({
        resetCode: resetCode.trim(),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Reset code verified successfully");
        // حفظ كود إعادة التعيين للاستخدام في الصفحة التالية
        localStorage.setItem('verifiedResetCode', resetCode.trim());
        router.push("/reset-password");
      } else {
        if (data.message) {
          setError(data.message);
          toast.error(data.message);
        } else if (data.error) {
          setError(data.error);
          toast.error(data.error);
        } else {
          setError("Invalid reset code");
          toast.error("Invalid reset code");
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
      <SectionTitle title="Verify Reset Code" path="Home | Verify Reset Code" />
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl font-normal leading-9 tracking-tight text-gray-900">
            Verify Reset Code
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the 6-digit code sent to {resetEmail}
          </p>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="resetCode"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Reset Code
                </label>
                <div className="mt-2">
                  <input
                    id="resetCode"
                    name="resetCode"
                    type="text"
                    required
                    maxLength={6}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center text-2xl tracking-widest"
                    placeholder="000000"
                  />
                </div>
              </div>

              <div>
                <CustomButton
                  buttonType="submit"
                  text={isLoading ? "Verifying..." : "Verify Code"}
                  paddingX={3}
                  paddingY={1.5}
                  customWidth="full"
                  textSize="sm"
                />
              </div>
            </form>

            <div className="mt-6">
              <p className="text-red-600 text-center text-[16px] my-4">
                {error && error}
              </p>
              
              <div className="text-center">
                <button
                  onClick={() => router.push("/forgot-password")}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Back to Forgot Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyResetCodePage;
