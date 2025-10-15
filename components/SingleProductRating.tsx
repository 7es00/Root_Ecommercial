// *********************
// Role of the component: Rating stars component that will display stars on the single product page 
// Name of the component: SingleProductRating.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <SingleProductRating rating={rating} />
// Input parameters: { rating: number }
// Output: full colored star icons and outlined star icons depending on the ratingArray element("empty star" or "full star")
// *********************

import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const SingleProductRating = ({ rating, reviewsCount }: { rating: number | undefined; reviewsCount?: number }) => {
  const ratingArray: Array<string> = [
    "empty star",
    "empty star",
    "empty star",
    "empty star",
    "empty star",
  ];

  // going through product rating and modifying rating state
  const ratingValue = rating || 0;
  for (let i = 0; i < Math.floor(ratingValue); i++) {
    ratingArray[i] = "full star";
  }
  return (
    <div className="flex text-2xl items-center max-[500px]:justify-center">
      {ratingArray &&
        ratingArray.map((singleRating, key: number) => {
          return (
            <div key={key+"rating"}>
              {singleRating === "full star" ? (
                <AiFillStar className="text-custom-yellow" />
              ) : (
                <AiOutlineStar className="text-custom-yellow" />
              )}
            </div>
          );
        })}
      <span className="text-xl ml-1">({reviewsCount || 0} reviews)</span>
    </div>
  );
};

export default SingleProductRating;
