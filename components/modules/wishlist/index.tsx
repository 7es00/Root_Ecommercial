"use client"
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import WishItem from "@/components/WishItem";
import apiClient from "@/lib/api";
import { nanoid } from "nanoid";
import { isAuthenticated, getUser } from "@/lib/auth";
import { useEffect, useState, useCallback } from "react";
import { Product } from "@/lib/types";

export const WishlistModule = () => {
  const user = isAuthenticated() ? getUser() : null;
  const { wishlist, setWishlist } = useWishlistStore();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.wishlist.getAll();
      
      if (response.ok) {
        const wishlistData = await response.json();
        setWishlistProducts(wishlistData.data || []);
        
        // Also update the zustand store for compatibility
        const productArray = wishlistData.data?.map((item: Product) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          image: item.imageCover,
          slug: item.slug,
          stockAvailabillity: item.quantity || 0,
        })) || [];
        
        setWishlist(productArray);
      } else {
        console.error("Failed to fetch wishlist");
        setWishlistProducts([]);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlistProducts([]);
    } finally {
      setLoading(false);
    }
  }, [user?.email, setWishlist]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  if (!user) {
    return (
      <h3 className="text-center text-4xl py-10 text-black max-lg:text-3xl max-sm:text-2xl max-sm:pt-5 max-[400px]:text-xl">
        Please log in to view your wishlist
      </h3>
    );
  }

  if (loading) {
    return (
      <h3 className="text-center text-4xl py-10 text-black max-lg:text-3xl max-sm:text-2xl max-sm:pt-5 max-[400px]:text-xl">
        Loading wishlist...
      </h3>
    );
  }

  return (
    <>
      {wishlistProducts && wishlistProducts.length === 0 ? (
        <h3 className="text-center text-4xl py-10 text-black max-lg:text-3xl max-sm:text-2xl max-sm:pt-5 max-[400px]:text-xl">
          No items found in the wishlist
        </h3>
      ) : (
        <div className="max-w-screen-2xl mx-auto">
          <div className="overflow-x-auto">
            <table className="table text-center">
              <thead>
                <tr>
                  <th></th>
                  <th className="text-accent-content">Image</th>
                  <th className="text-accent-content">Name</th>
                  <th className="text-accent-content">Stock Status</th>
                  <th className="text-accent-content">Action</th>
                </tr>
              </thead>
              <tbody>
                {wishlistProducts &&
                  wishlistProducts?.map((item) => (
                    <WishItem
                      id={item?.id}
                      title={item?.title}
                      price={item?.price}
                      image={item?.imageCover}
                      slug={item?.slug}
                      stockAvailabillity={item?.quantity || 0}
                      key={nanoid()}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}
