"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSortStore } from "@/app/_zustand/sortStore";
import { usePaginationStore } from "@/app/_zustand/paginationStore";
import { apiClient } from "@/lib/api";

interface InputCategory {
  inStock: { text: string, isChecked: boolean },
  outOfStock: { text: string, isChecked: boolean },
  priceFilter: { text: string, value: number },
  ratingFilter: { text: string, value: number },
  priceMin: { text: string, value: number },
  priceMax: { text: string, value: number },
  keyword: { text: string, value: string },
}

const Filters = () => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const { page } = usePaginationStore();

  const [inputCategory, setInputCategory] = useState<InputCategory>({
    inStock: { text: "instock", isChecked: true },
    outOfStock: { text: "outofstock", isChecked: true },
    priceFilter: { text: "price", value: 3000 },
    ratingFilter: { text: "rating", value: 0 },
    priceMin: { text: "priceMin", value: 0 },
    priceMax: { text: "priceMax", value: 3000 },
    keyword: { text: "keyword", value: "" },
  });
  const { sortBy } = useSortStore();

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("outOfStock", inputCategory.outOfStock.isChecked.toString());
    params.set("inStock", inputCategory.inStock.isChecked.toString());
    params.set("rating", inputCategory.ratingFilter.value.toString());
    params.set("price", inputCategory.priceFilter.value.toString());
    params.set("priceMin", inputCategory.priceMin.value.toString());
    params.set("priceMax", inputCategory.priceMax.value.toString());
    if (inputCategory.keyword.value.trim()) {
      params.set("keyword", inputCategory.keyword.value.trim());
    }
    params.set("sort", sortBy);
    params.set("page", page.toString());
    replace(`${pathname}?${params}`);
  }, [inputCategory, sortBy, page, pathname, replace]);

  const [subcatName, setSubcatName] = useState<string | null>(null);
  useEffect(() => {
    const subcategoryId = searchParams.get('subcategoryId');
    if (!subcategoryId) { setSubcatName(null); return; }
    (async () => {
      try {
        const res = await apiClient.subcategories.getById(subcategoryId);
        if (res.ok) {
          const data = await res.json();
          setSubcatName(data?.data?.name || null);
        } else setSubcatName(null);
      } catch { setSubcatName(null); }
    })();
  }, [searchParams]);

  return (
    <div>
      <h3 className="text-2xl mb-2">Filters{subcatName ? ` · ${subcatName}` : ''}</h3>
      <div className="divider"></div>
      <div className="flex flex-col gap-y-1">
        <h3 className="text-xl mb-2">Availability</h3>
        <div className="form-control">
          <label className="cursor-pointer flex items-center">
            <input
              type="checkbox"
              checked={inputCategory.inStock.isChecked}
              onChange={() =>
                setInputCategory({
                  ...inputCategory,
                  inStock: {
                    text: "instock",
                    isChecked: !inputCategory.inStock.isChecked,
                  },
                })
              }
              className="checkbox"
            />
            <span className="label-text text-lg ml-2 text-black">In stock</span>
          </label>
        </div>

        <div className="form-control">
          <label className="cursor-pointer flex items-center">
            <input
              type="checkbox"
              checked={inputCategory.outOfStock.isChecked}
              onChange={() =>
                setInputCategory({
                  ...inputCategory,
                  outOfStock: {
                    text: "outofstock",
                    isChecked: !inputCategory.outOfStock.isChecked,
                  },
                })
              }
              className="checkbox"
            />
            <span className="label-text text-lg ml-2 text-black">
              Out of stock
            </span>
          </label>
        </div>
      </div>

   

      <div className="divider"></div>

      <div>
        <h3 className="text-xl mb-2">Minimum Rating:</h3>
        <input
          type="range"
          min={0}
          max="5"
          value={inputCategory.ratingFilter.value}
          onChange={(e) =>
            setInputCategory({
              ...inputCategory,
              ratingFilter: { text: "rating", value: Number(e.target.value) },
            })
          }
          className="range range-info"
          step="1"
        />
        <div className="w-full flex justify-between text-xs px-2">
          <span>0</span>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
      </div>

      <div className="divider"></div>

      <div className="flex flex-col gap-y-1">
        <h3 className="text-xl mb-2">Price Range</h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min Price"
            min={0}
            value={inputCategory.priceMin.value}
            onChange={(e) =>
              setInputCategory({
                ...inputCategory,
                priceMin: { text: "priceMin", value: Number(e.target.value) || 0 },
              })
            }
            className="input input-bordered w-20"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max Price"
            min={0}
            value={inputCategory.priceMax.value}
            onChange={(e) =>
              setInputCategory({
                ...inputCategory,
                priceMax: { text: "priceMax", value: Number(e.target.value) || 3000 },
              })
            }
            className="input input-bordered w-20"
          />
        </div>
      </div>

      <div className="divider"></div>

      <div className="flex flex-col gap-y-1">
        <h3 className="text-xl mb-2">Search</h3>
        <input
          type="text"
          placeholder="Search products..."
          value={inputCategory.keyword.value}
          onChange={(e) =>
            setInputCategory({
              ...inputCategory,
              keyword: { text: "keyword", value: e.target.value },
            })
          }
          className="input input-bordered"
        />
      </div>
    </div>
  );
};

export default Filters;
