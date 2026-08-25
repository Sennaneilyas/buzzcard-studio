import { useParams } from "react-router-dom";
import { GlobalLoader } from "@/components/ui/GlobalLoader";
import ProductDetailsPage from "./ProductDetailsPage";
import ProductsPage from "./ProductsPage";
import { useProductCatalog } from "./hooks/useProductCatalog";

export default function ProductsRoute() {
  const { slug } = useParams();
  const { data: catalog, isPending } = useProductCatalog();
  const product = catalog?.products.find((item) => (
    item.slug === slug || (slug === "carte-nfc-classique" && item.slug === "classique")
  ));

  if (isPending) return <GlobalLoader className="bg-cloud" />;

  return product ? <ProductDetailsPage product={product} /> : <ProductsPage />;
}
