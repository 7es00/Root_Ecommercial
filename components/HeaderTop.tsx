// *********************
// Role of the component: Topbar of the header
// Name of the component: HeaderTop.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <HeaderTop />
// Input parameters: no input parameters
// Output: topbar with phone, email and login and register links
// *********************

"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaHeadphones } from "react-icons/fa6";
import { FaRegEnvelope } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa6";
import { isAuthenticated, getUser, clearAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

const HeaderTop = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getUser());
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    toast.success("Logout successful!");
    router.push("/");
  }
  return (
    <div className="h-10 text-white bg-blue-500 max-lg:px-5 max-lg:h-16 max-[573px]:px-0 ">
      <div className="flex justify-between h-full max-lg:flex-col max-lg:justify-center max-lg:items-center max-w-screen-2xl mx-auto px-12 max-[573px]:px-0">
        <ul className="flex items-center h-full gap-x-5 max-[370px]:text-sm max-[370px]:gap-x-2">
          <li className="flex items-center gap-x-2 font-semibold text-center m-auto">
            <FaHeadphones className="text-white" />
            <span>+381 61 123 321</span>
          </li>
          <li className="flex items-center gap-x-2 font-semibold text-center m-auto">
            <FaRegEnvelope className="text-white text-xl" />
            <span>test@email.com</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HeaderTop;
