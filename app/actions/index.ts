'use server'

import apiClient from "@/lib/api";
import { revalidateTag } from "next/cache";

export async function deleteWishItem(id: string){
  apiClient.delete(`/wishlist/${id}`, {
    method: "DELETE",
  });
}
