import { useParams, Link } from "react-router-dom";
import ProductAccordion from "./components/ProductAccordion";
import { ArrowLeft } from "lucide-react";

export default function ProductsPage() {
  // Read category from /products/:category
  const { category } = useParams();

  return (
    <div className="min-h-screen bg-cloud pt-32 pb-24 px-6 relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-navy/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-12">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-ink/60 hover:text-ink transition-colors text-sm font-semibold mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-ink tracking-tight mb-4">
              Our Products
            </h1>
            <p className="text-lg text-ink/60 max-w-2xl">
              Explore our premium range of NFC-enabled hardware. Each product includes dynamic profile linking and endless updates.
            </p>
          </div>
        </div>
        
        {/* Accordion Component */}
        <ProductAccordion initialCategory={category} />
      </div>
    </div>
  );
}
