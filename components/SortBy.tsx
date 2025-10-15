"use client";
import React from "react";
import { useSortStore } from "@/app/_zustand/sortStore";

const SortBy = () => {
  const { sortBy, changeSortBy } = useSortStore();

  return (
    <div className="flex items-center gap-x-5 max-lg:flex-col max-lg:w-full max-lg:items-start">
      <h3 className="text-xl">Sort by:</h3>
      <select
        defaultValue={sortBy}
        onChange={(e) => changeSortBy(e.target.value)}
        className="select border-gray-400 py-2 px-2 text-base border-2 select-bordered w-40 focus:outline-none outline-none max-lg:w-full bg-white"
        name="sort"
      >
        <option value="">Default</option>
        <option value="title">Sort A-Z</option>
        <option value="-title">Sort Z-A</option>
        <option value="price">Lowest Price</option>
        <option value="-price">Highest Price</option>
        <option value="ratingsAverage">Highest Rating</option>
        <option value="-ratingsAverage">Lowest Rating</option>
        <option value="createdAt">Newest</option>
        <option value="-createdAt">Oldest</option>
        <option value="sold">Most Sold</option>
        <option value="-sold">Least Sold</option>
      </select>
    </div>
  );
};

export default SortBy;
