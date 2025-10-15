// *********************
// Role of the component: products section intended to be on the home page
// Name of the component: ProductsSection.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <ProductsSection slug={slug} />
// Input parameters: no input parameters
// Output: products grid
// *********************

import React from "react";
import ProductItem from "./ProductItem";
import Heading from "./Heading";
import { apiClient } from "@/lib/api";
import { ProductsResponse } from "@/lib/types";

const ProductsSection = async () => {
  try {
    // إرسال طلب للحصول على المنتجات من الباك إند الجديد
    const response = await apiClient.products.getAll({ limit: 8 });
    const data: ProductsResponse = await response.json();
    
    if (!response.ok) {
      console.error('Failed to fetch products:', data);
      return (
        <div className="bg-blue-500 border-t-4 border-white">
          <div className="max-w-screen-2xl mx-auto pt-20">
            <Heading title="FEATURED PRODUCTS" />
            <div className="text-center py-10">
              <p className="text-white text-lg">Failed to load products</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-blue-500 border-t-4 border-white">
        <div className="max-w-screen-2xl mx-auto pt-20">
          <Heading title="FEATURED PRODUCTS" />
          <div className="grid grid-cols-4 justify-items-center max-w-screen-2xl mx-auto py-10 gap-x-2 px-10 gap-y-8 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
            {data.data.map((product) => (
              <ProductItem key={product._id} product={product} color="white" />
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return (
      <div className="bg-blue-500 border-t-4 border-white">
        <div className="max-w-screen-2xl mx-auto pt-20">
          <Heading title="FEATURED PRODUCTS" />
          <div className="text-center py-10">
            <p className="text-white text-lg">Error loading products</p>
          </div>
        </div>
      </div>
    );
  }
};

export default ProductsSection;
