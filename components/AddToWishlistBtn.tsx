"use client";

import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import apiClient from "@/lib/api";
import { isAuthenticated, getUser } from "@/lib/auth";
import { Product } from "@/lib/types";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaHeartCrack } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";

interface AddToWishlistBtnProps {
  product: Product;
  slug: string;
}

const AddToWishlistBtn = ({ product, slug }: AddToWishlistBtnProps) => {
  const [user, setUser] = useState<any>(null);
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlistStore();
  const [isProductInWishlist, setIsProductInWishlist] = useState<boolean>();

  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        setUser(getUser());
      } else {
        setUser(null);
      }
    };
    
    checkAuth();
    
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const addToWishlistFun = async () => {
    if (!user?.email) {
      toast.error("You need to be logged in to add a product to the wishlist");
      return;
    }

    try {
      const response = await apiClient.wishlist.add(product._id);
      
      if (response.ok) {
        addToWishlist({
          id: product._id,
          title: product.title,
          price: product.price,
          image: product.imageCover,
          slug: product.slug,
          stockAvailabillity: product.quantity || 0,
        });
        setIsProductInWishlist(true);
        toast.success("Product added to wishlist");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to add product to wishlist");
      }
    } catch (error) {
      toast.error("Failed to add product to wishlist");
    }
  };

  const removeFromWishlistFun = async () => {
    if (!user?.email) {
      toast.error("You need to be logged in to remove a product from the wishlist");
      return;
    }

    try {
      const response = await apiClient.wishlist.remove(product._id);
      
      if (response.ok) {
        removeFromWishlist(product._id);
        setIsProductInWishlist(false);
        toast.success("Product removed from wishlist");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to remove product from wishlist");
      }
    } catch (error) {
      toast.error("Failed to remove product from wishlist");
    }
  };

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user?.email) {
        setIsProductInWishlist(false);
        return;
      }

      try {
        const response = await apiClient.wishlist.getAll();
        
        if (response.ok) {
          const wishlistData = await response.json();
          const isInWishlist = wishlistData.data?.some((item: any) => item.id === product._id);
          setIsProductInWishlist(isInWishlist);
        } else {
          setIsProductInWishlist(false);
        }
      } catch (error) {
        setIsProductInWishlist(false);
      }
    };

    checkWishlistStatus();
  }, [user?.email, product._id]);

  return (
    <>
      {isProductInWishlist ? (
        <p
          className="flex items-center gap-x-2 cursor-pointer"
          onClick={removeFromWishlistFun}
        >
          <FaHeartCrack className="text-xl text-custom-black" />
          <span className="text-lg">REMOVE FROM WISHLIST</span>
        </p>
      ) : (
        <p
          className="flex items-center gap-x-2 cursor-pointer"
          onClick={addToWishlistFun}
        >
          <FaHeart className="text-xl text-custom-black" />
          <span className="text-lg">ADD TO WISHLIST</span>
        </p>
      )}
    </>
  );
};

export default AddToWishlistBtn;
