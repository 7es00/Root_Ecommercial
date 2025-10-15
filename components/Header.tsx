// *********************
// Role of the component: Header component
// Name of the component: Header.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Header />
// Input parameters: no input parameters
// Output: Header component
// *********************

"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import HeaderTop from "./HeaderTop";
import Image from "next/image";
import SearchInput from "./SearchInput";
import Link from "next/link";
import { FaBell } from "react-icons/fa6";

import CartElement from "./CartElement";
import HeartElement from "./HeartElement";
import toast from "react-hot-toast";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import apiClient from "@/lib/api";
import { isAuthenticated, getUser, clearAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const { wishlist, setWishlist, wishQuantity } = useWishlistStore();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getUser());
    } else {
      setUser(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    clearAuth();
    toast.success("Logout successful!");
    router.push("/");
  };


  return (
    <header className="bg-white">
      <HeaderTop />
      {pathname.startsWith("/admin") === false && (
        <div className="h-32 bg-white flex items-center justify-between px-16 max-[1320px]:px-16 max-md:px-6 max-lg:flex-col max-lg:gap-y-7 max-lg:justify-center max-lg:h-60 max-w-screen-2xl mx-auto">
          <Link href="/">
           <h1 className="text-2xl font-extrabold text-blue-600  w-56">E-Commerce</h1>
          </Link>
          <SearchInput />
          <div className="flex gap-x-10 items-center">
            <HeartElement wishQuantity={wishQuantity} />
            <CartElement />
            
            {/* User Authentication Section */}
            {user ? (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <span className="text-sm text-gray-600">{user.name}</span>
                  </li>
                  <li>
                    <Link href="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link href="/allorders">My Orders</Link>
                  </li>
                  <li>
                    <Link href="/change-password">Change Password</Link>
                  </li>
                  <li onClick={handleLogout}>
                    <a href="#">Logout</a>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="flex gap-x-4">
                <Link
                  href="/login"
                  className="btn btn-outline btn-sm"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn btn-primary  btn-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
  
    </header>
  );
};

export default Header;
