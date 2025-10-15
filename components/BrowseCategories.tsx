// *********************
// Role of the component: Browse Categories component for homepage
// Name of the component: BrowseCategories.tsx
// Developer: Assistant
// Version: 1.0
// Component call: <BrowseCategories />
// Input parameters: no input parameters
// Output: Categories grid component that displays all categories from the backend
// *********************

"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import apiClient from "@/lib/api";
import { Category } from "@/lib/types";
import { Loader } from "./Loader";

const BrowseCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await apiClient.categories.getAll();
        
        if (response.ok) {
          const data = await response.json();
          setCategories(data.data || []);
        } else {
          setError("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Error loading categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-screen-2xl mx-auto px-5">
          <div className="flex justify-center">
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-screen-2xl mx-auto px-5">
          <div className="text-center">
            <h3 className="text-2xl text-red-600">{error}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-screen-2xl mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-black mb-4">Browse Categories</h2>
          <p className="text-lg text-gray-600">
            Discover our wide range of product categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/category/${category.slug}`}
              className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-6 text-center">
                <div className="w-20 h-20 mx-auto mb-4 relative overflow-hidden rounded-lg">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center">
            <h3 className="text-2xl text-gray-600">No categories found</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseCategories;
