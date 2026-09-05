import { useQuery } from "@tanstack/react-query";
import { fetchProductCatalog } from "../api/products";

export const productCatalogQueryKey = ["product-catalog"];

export function useProductCatalog() {
  return useQuery({
    queryKey: productCatalogQueryKey,
    queryFn: fetchProductCatalog,
    staleTime: 1000 * 60 * 30, // 30 mins
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}
