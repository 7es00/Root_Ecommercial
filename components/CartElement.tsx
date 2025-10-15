"use client";
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaCartShopping } from 'react-icons/fa6'
import { useProductStore } from "@/app/_zustand/store";
import { isAuthenticated } from "@/lib/auth";
import apiClient from '@/lib/api';

const CartElement = () => {
    const { allQuantity } = useProductStore();
    const [serverCartCount, setServerCartCount] = useState(0);
    
    useEffect(() => {
      const fetchCartCount = async () => {
        if (isAuthenticated()) {
          try {
            const response = await apiClient.cart.get();
            if (response.ok) {
              const data = await response.json();
              setServerCartCount(data.numOfCartItems || 0);
            }
          } catch (error) {
            setServerCartCount(0);
          }
        }
      };
      
      fetchCartCount();
    }, []);
    
    if (!isAuthenticated()) return null;
    
    const displayCount = serverCartCount > 0 ? serverCartCount : allQuantity;
    
  return (
    <div className="relative">
            <Link href="/cart">
              <FaCartShopping className="text-2xl text-black" />
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex justify-center items-center absolute top-[-17px] right-[-22px]">
                { displayCount }
              </span>
            </Link>
          </div>
  )
}

export default CartElement