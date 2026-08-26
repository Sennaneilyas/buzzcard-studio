import { CommerceHero } from "@/components/ui/commerce-hero";

const PRODUCT_CARDS = [
  { image: "/NFC Bracelet.png", title: "NFC Bracelets", href: "/products/bracelets" },
  { image: "/NFC Cards.png", title: "NFC Cards", href: "/products/metal-cards" },
  { image: "/NFC Plates.png", title: "NFC Plates", href: "/products/stickers" },
  { image: "/Stands.png", title: "NFC Stands", href: "/products/tags" },
];

export default function ProductsShowcase() {
  return <CommerceHero categories={PRODUCT_CARDS} />;
}
