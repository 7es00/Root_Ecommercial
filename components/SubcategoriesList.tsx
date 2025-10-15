// *********************
// Role of the component: Subcategories list component
// Name of the component: SubcategoriesList.tsx
// Developer: Assistant
// Version: 1.0
// Component call: <SubcategoriesList categoryId={categoryId} />
// Input parameters: { categoryId: string }
// Output: Subcategories list component that displays all subcategories for a specific category
// *********************

"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "@/lib/api";
import { Subcategory } from "@/lib/types";
import { Loader } from "./Loader";

interface SubcategoriesListProps {
  categoryId: string;
  categoryName?: string;
}

const SubcategoriesList = ({ categoryId, categoryName }: SubcategoriesListProps) => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        setLoading(true);
        const response = await apiClient.categories.getSubcategories(categoryId);
        
        if (response.ok) {
          const data = await response.json();
          setSubcategories(data.data || []);
        } else {
          setError("Failed to fetch subcategories");
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setError("Error loading subcategories");
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchSubcategories();
    }
  }, [categoryId]);

  if (loading) {
    return (
      <div className="py-8">
        <div className="flex justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="text-center">
          <h3 className="text-xl text-red-600">{error}</h3>
        </div>
      </div>
    );
  }

  if (subcategories.length === 0) {
    return null;
  }

  return (
    <div className="py-8 bg-white">
      <div className="max-w-screen-2xl mx-auto px-5">
        {categoryName && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-black mb-2">
              {categoryName} Subcategories
            </h2>
            <p className="text-lg text-gray-600">
              Explore our {categoryName.toLowerCase()} subcategories
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subcategories.map((subcategory) => (
            <Link
              key={subcategory._id}
              href={`/shop?category=${subcategory.category}&subcategory=${subcategory.slug}`}
              className="group bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md"
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {subcategory.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {subcategory.slug}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubcategoriesList;