import { notFound } from "next/navigation";
import apiClient from "@/lib/api";
import { Category, Subcategory } from "@/lib/types";
import SubcategoriesList from "@/components/SubcategoriesList";
import Products from "@/components/Products";

interface CategoryPageProps {
  params: Promise<{ categorySlug: string }>;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const paramsAwaited = await params;
  
  try {
    // جلب جميع الفئات للبحث عن الفئة المطلوبة
    const categoriesResponse = await apiClient.categories.getAll();
    
    if (!categoriesResponse.ok) {
      notFound();
    }
    
    const categoriesData = await categoriesResponse.json();
    const category: Category | undefined = categoriesData.data?.find(
      (cat: Category) => cat.slug === paramsAwaited.categorySlug
    );

    if (!category) {
      notFound();
    }

    return (
      <div className="bg-white">
        <div className="max-w-screen-2xl mx-auto px-5 py-10">
          {/* Category Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-black mb-4">
              {category.name}
            </h1>
            <p className="text-lg text-gray-600">
              Explore our {category.name.toLowerCase()} collection
            </p>
          </div>

          {/* Subcategories */}
          <SubcategoriesList 
            categoryId={category._id} 
            categoryName={category.name}
          />

          {/* Products in this category */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">
              Products in {category.name}
            </h2>
            <Products 
              params={{ slug: [category.slug] }}
              searchParams={{}}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading category:", error);
    notFound();
  }
};

export default CategoryPage;
