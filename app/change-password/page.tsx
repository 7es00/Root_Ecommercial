"use client";
import { CustomButton, SectionTitle } from "@/components";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api";
import { isAuthenticated, getUser } from "@/lib/auth";

const ChangePasswordPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // التحقق من تسجيل الدخول
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    
    const userData = getUser();
    setUser(userData);
  }, [router]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const currentPassword = e.target[0].value;
    const newPassword = e.target[1].value;
    const confirmPassword = e.target[2].value;

    if (!currentPassword) {
      setError("Current password is required");
      toast.error("Current password is required");
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      toast.error("New password must be at least 8 characters");
      return;
    }

    if (confirmPassword !== newPassword) {
      setError("New passwords do not match");
      toast.error("New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      toast.error("New password must be different from current password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await apiClient.user.changePassword({
        currentPassword: currentPassword,
        password: newPassword,
        rePassword: confirmPassword,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password changed successfully");
        router.push("/profile");
      } else {
        if (data.message) {
          setError(data.message);
          toast.error(data.message);
        } else if (data.error) {
          setError(data.error);
          toast.error(data.error);
        } else {
          setError("Failed to change password");
          toast.error("Failed to change password");
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

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white">
      <SectionTitle title="Change Password" path="Home | Change Password" />
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl font-normal leading-9 tracking-tight text-gray-900">
            Change Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Update your password for {user.email}
          </p>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Current Password
                </label>
                <div className="mt-2">
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Enter current password"
                  />
                </div>
              </div>

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
                  text={isLoading ? "Changing..." : "Change Password"}
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
                  onClick={() => router.push("/profile")}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Back to Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
