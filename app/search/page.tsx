import { ProductItem, SectionTitle } from "@/components";
import apiClient from "@/lib/api";
import React from "react";
import { sanitize } from "@/lib/sanitize";

const SearchPage = async ({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) => {
  const sp = await searchParams;
  const raw = sp?.search;
  const q = Array.isArray(raw) ? raw[0] : (raw || "");
  const data = await apiClient.products.search(q);

  const products = await data.json();

  return (
    <div>
      <SectionTitle title="Search Page" path="Home | Search" />
      <div className="max-w-screen-2xl mx-auto">
        {q && (
          <h3 className="text-4xl text-center py-10 max-sm:text-3xl">
          Showing results for {sanitize(q)}
          </h3>
        )}
        <div className="grid grid-cols-4 justify-items-center gap-x-2 gap-y-5 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
          {products?.data?.length > 0 ? (
            products.data.map((product: any) => (
              <ProductItem key={product._id} product={product} color="black" />
            ))
          ) : (
            <h3 className="text-3xl mt-5 text-center w-full col-span-full max-[1000px]:text-2xl max-[500px]:text-lg">
              No products found for specified query
            </h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

/*

*/
