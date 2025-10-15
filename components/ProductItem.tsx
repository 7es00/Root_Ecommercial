// *********************
// Role of the component: Product item component 
// Name of the component: ProductItem.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <ProductItem product={product} color={color} />
// Input parameters: { product: Product; color: string; }
// Output: Product item component that contains product image, title, link to the single product page, price, button...
// *********************

import Image from "next/image";
import React from "react";
import Link from "next/link";
import ProductItemRating from "./ProductItemRating";
import { sanitize } from "@/lib/sanitize";
import { Product } from "@/lib/types";

const ProductItem = ({
  product,
  color,
}: {
  product: Product;
  color: string;
}) => {
  return (
    <div className="flex flex-col items-center gap-y-2">
      <Link href={`/product/${product._id}`}>
        <Image
          src={
            product.imageCover
              ? product.imageCover
              : "/product_placeholder.jpg"
          }
          width="0"
          height="0"
          sizes="100vw"
          className="w-auto h-[300px]"
          alt={sanitize(product?.title) || "Product image"}
        />
      </Link>
      <Link
        href={`/product/${product._id}`}
        className={
          color === "black"
            ? `text-xl text-black font-normal mt-2 uppercase`
            : `text-xl text-white font-normal mt-2 uppercase`
        }
      >
        {sanitize(product.title)}
      </Link>
      <div
        className={
          color === "black"
            ? "text-lg text-black font-semibold flex gap-x-2"
            : "text-lg text-white font-semibold flex gap-x-2"
        }
      >
        <span>${product.price}</span>
        {/* Note: priceAfterDiscount is not available in the new backend */}
      </div>

      <ProductItemRating productRating={product?.ratingsAverage} />
      <Link
        href={`/product/${product?._id}`}
        className="flex justify-center items-center w-full uppercase bg-white px-0 py-2 text-base border border-gray-300 font-bold text-blue-600 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2"
      >
        <p>View product</p>
      </Link>
    </div>
  );
};

export default ProductItem;
