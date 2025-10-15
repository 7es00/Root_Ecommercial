import {
  StockAvailabillity,
  UrgencyText,
  SingleProductRating,
  ProductTabs,
  SingleProductDynamicFields,
  AddToWishlistBtn,
} from "@/components";
import apiClient from "@/lib/api";
import { Product } from "@/lib/types";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import { FaSquareFacebook } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaSquarePinterest } from "react-icons/fa6";
import { sanitize } from "@/lib/sanitize";

interface SingleProductPageProps {
  params: Promise<{ productSlug: string }>;
}

const SingleProductPage = async ({ params }: SingleProductPageProps) => {
  const paramsAwaited = await params;
  
  try {
    const response = await apiClient.products.getById(paramsAwaited.productSlug);
    
    if (!response.ok) {
      notFound();
    }
    
    const data = await response.json();
    const product: Product | null = data?.data ?? null;

    if (!product) {
      notFound();
    }

  return (
    <div className="bg-white">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex justify-center gap-x-16 pt-10 max-lg:flex-col items-center gap-y-5 px-5">
          <div>
            <Image
              src={product?.imageCover || "/product_placeholder.jpg"}
              width={500}
              height={500}
              alt="main image"
              className="w-auto h-auto"
            />
            <div className="flex justify-around mt-5 flex-wrap gap-y-1 max-[500px]:justify-center max-[500px]:gap-x-1">
              {product?.images?.map((image: string, key: number) => (
                <Image
                  key={key}
                  src={image}
                  width={100}
                  height={100}
                  alt="product image"
                  className="w-auto h-auto"
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-y-7 text-black max-[500px]:text-center">
            <SingleProductRating rating={product?.ratingsAverage} reviewsCount={product?.ratingsQuantity} />
            <h1 className="text-3xl">{sanitize(product?.title)}</h1>
            <div className="flex gap-x-2 items-center">
              <p className="text-xl font-semibold">${product?.price}</p>
            </div>
            <StockAvailabillity stock={product?.quantity || 0} inStock={product?.quantity > 0} />
            <SingleProductDynamicFields product={product} />
            <div className="flex flex-col gap-y-2 max-[500px]:items-center">
              <AddToWishlistBtn product={product} slug={paramsAwaited.productSlug} />
              <p className="text-lg">
                SKU: <span className="ml-1">{product?._id}</span>
              </p>
              <div className="text-lg flex gap-x-2">
                <span>Share:</span>
                <div className="flex items-center gap-x-1 text-2xl">
                  <FaSquareFacebook />
                  <FaSquareXTwitter />
                  <FaSquarePinterest />
                </div>
              </div>
              <div className="flex gap-x-2">
                <Image
                  src="/visa.svg"
                  width={50}
                  height={50}
                  alt="visa icon"
                  className="w-auto h-auto"
                />
                <Image
                  src="/mastercard.svg"
                  width={50}
                  height={50}
                  alt="mastercard icon"
                  className="h-auto w-auto"
                />
                <Image
                  src="/ae.svg"
                  width={50}
                  height={50}
                  alt="americal express icon"
                  className="h-auto w-auto"
                />
                <Image
                  src="/paypal.svg"
                  width={50}
                  height={50}
                  alt="paypal icon"
                  className="w-auto h-auto"
                />
                <Image
                  src="/dinersclub.svg"
                  width={50}
                  height={50}
                  alt="diners club icon"
                  className="h-auto w-auto"
                />
                <Image
                  src="/discover.svg"
                  width={50}
                  height={50}
                  alt="discover icon"
                  className="h-auto w-auto"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="py-16">
          <ProductTabs product={product} />
        </div>
      </div>
    </div>
  );
  } catch (error) {
    notFound();
  }
};

export default SingleProductPage;
