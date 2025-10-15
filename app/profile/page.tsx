"use client";
import { CustomButton, SectionTitle } from "@/components";
import { isValidEmailAddressFormat } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api";
import { isAuthenticated, getUser, saveToken, clearAuth, getToken } from "@/lib/auth";

const ProfilePage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    // التحقق من تسجيل الدخول
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    
    const userData = getUser();
    if (userData) {
      setUser(userData);
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
      });
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!formData.name || formData.name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      toast.error("Name must be at least 2 characters");
      return;
    }

    if (!isValidEmailAddressFormat(formData.email)) {
      setError("Email is invalid");
      toast.error("Email is invalid");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await apiClient.user.updateProfile({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      });

      const data = await res.json();

      if (res.ok) {
        // تحديث بيانات المستخدم في localStorage
        const updatedUser = {
          ...user,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        };
        const token = getToken();
        if (token) {
          saveToken(token, updatedUser);
        }
        setUser(updatedUser);
        setIsModalOpen(false);
        
        toast.success("Profile updated successfully");
      } else {
        if (data.message) {
          setError(data.message);
          toast.error(data.message);
        } else if (data.error) {
          setError(data.error);
          toast.error(data.error);
        } else {
          setError("Failed to update profile");
          toast.error("Failed to update profile");
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

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    router.push("/");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white">
      <SectionTitle title="Profile" path="Home | Profile" />
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl font-normal leading-9 tracking-tight text-gray-900">
            Update Your Profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Manage your account information
          </p>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            {/* معلومات حالية مع زر فتح البوب أب */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-base text-gray-900">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-base text-gray-900">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-base text-gray-900">{user?.phone || "-"}</p>
              </div>
              <div>
                <CustomButton
                  buttonType="button"
                  text="Edit profile"
                  paddingX={3}
                  paddingY={1.5}
                  customWidth="full"
                  textSize="sm"
                  onClick={() => setIsModalOpen(true)}
                />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <p className="text-red-600 text-center text-[16px]">
                {error && error}
              </p>
              
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => router.push("/change-password")}
                  className="w-full text-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Change Password
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full text-center py-2 px-4 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Update profile</h3>
            <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Full Name</label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email Address</label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">Phone Number</label>
                <div className="mt-2">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 text-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <div className="flex-1">
                  <CustomButton
                    buttonType="submit"
                    text={isLoading ? "Updating..." : "Save changes"}
                    paddingX={3}
                    paddingY={1.5}
                    customWidth="full"
                    textSize="sm"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
