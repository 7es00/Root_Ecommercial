"use client";

import React from "react";
import { useProductStore } from "@/app/_zustand/store";
import toast from "react-hot-toast";
import { isAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";
import apiClient from '@/lib/api';



const AddToCartSingleProductBtn = ({ product, quantityCount } : SingleProductBtnProps) => {
  const { addToCart, calculateTotals } = useProductStore();
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }

    try {
      // Add to RouteMisr cart multiple times for quantity
      for (let i = 0; i < quantityCount; i++) {
        const response = await apiClient.cart.add(product?._id || product?.id);
        
        if (!response.ok) {
          const errorData = await response.json();
          toast.error(errorData.message || "Failed to add product to cart");
          return;
        }
      }
      
      // Add to local Zustand store
      addToCart({
        id: (product?._id || product?.id)?.toString(),
        title: product?.title,
        price: product?.price,
        image: product?.imageCover || product?.mainImage,
        amount: quantityCount
      });
      calculateTotals();
      toast.success("Product added to the cart");
    } catch (error) {
      toast.error("Failed to add product to cart");
    }
  };
  return (
    <button
      onClick={handleAddToCart}
      className="btn w-[200px] text-lg border border-gray-300 border-1 font-normal bg-white text-blue-500 hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:scale-110 transition-all uppercase ease-in max-[500px]:w-full"
    >
      Add to cart
    </button>
  );
};

export default AddToCartSingleProductBtn;
