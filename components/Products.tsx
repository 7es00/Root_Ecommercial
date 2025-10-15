import React from "react";
import ProductItem from "./ProductItem";
import { apiClient } from "@/lib/api";
import { ProductsResponse } from "@/lib/types";

const Products = async ({ params, searchParams }: { params: { slug?: string[] }, searchParams: { [key: string]: string | string[] | undefined } }) => {
  try {
    const page = searchParams?.page ? Number(searchParams?.page) : 1;
    const limit = 12;
    
    const queryParams: any = {
      page,
      limit,
    };

    if (params?.slug && params.slug.length > 0) {
      queryParams.category = params.slug[0];
    }

    if (searchParams?.sort) {
      queryParams.sort = searchParams.sort;
    }

    if (searchParams?.brand) {
      queryParams.brand = searchParams.brand;
    }

    if (searchParams?.keyword) {
      queryParams.keyword = searchParams.keyword;
    }

    if (searchParams?.priceMin) {
      queryParams['price[gte]'] = searchParams.priceMin;
    }

    if (searchParams?.priceMax) {
      queryParams['price[lte]'] = searchParams.priceMax;
    }

    if (searchParams?.categoryId) {
      queryParams['category[in]'] = searchParams.categoryId;
    }

    if (searchParams?.fields) {
      queryParams.fields = searchParams.fields;
    }

    const response = await apiClient.products.getAll(queryParams);
    const data: ProductsResponse = await response.json();

    if (!response.ok) {
      return (
        <div className="text-center py-10">
          <h3 className="text-3xl mt-5 text-center w-full max-[1000px]:text-2xl max-[500px]:text-lg">
            Failed to load products
          </h3>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-3 justify-items-center gap-x-2 gap-y-5 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
        {data.data.length > 0 ? (
          data.data.map((product) => (
            <ProductItem key={product._id} product={product} color="black" />
          ))
        ) : (
          <h3 className="text-3xl mt-5 text-center w-full col-span-full max-[1000px]:text-2xl max-[500px]:text-lg">
            No products found for specified query
          </h3>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="text-center py-10">
        <h3 className="text-3xl mt-5 text-center w-full max-[1000px]:text-2xl max-[500px]:text-lg">
          Error loading products
        </h3>
      </div>
    );
  }
};

export default Products;
