/**
 * Mock data for the Admin Dashboard.
 * Toggle USE_MOCK to false in each hook file once real Supabase data is connected.
 */

export const MOCK_STATS = {
  totalProfiles: 148,
  publishedProfiles: 87,
  totalOrders: 213,
  totalRevenue: 94750,
  // Previous period comparison (for % change badges)
  prevOrders: 189,
  prevRevenue: 82400,
  prevProfiles: 132,
};

// 30-day trend — generates realistic-looking daily order data
const today = new Date();
export const MOCK_ORDERS_OVER_TIME = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(today);
  d.setDate(d.getDate() - (29 - i));
  const orders = Math.floor(Math.random() * 12) + 1;
  return {
    date: d.toISOString().slice(0, 10),
    orders,
    revenue: orders * (Math.floor(Math.random() * 200) + 150),
  };
});

export const MOCK_PRODUCT_POPULARITY = [
  { name: "Carte NFC", value: 68 },
  { name: "Bracelet NFC", value: 45 },
  { name: "Plaque Avis Google", value: 39 },
  { name: "Carte WhatsApp NFC", value: 27 },
  { name: "Présentoir Instagram NFC", value: 18 },
  { name: "BuzzCards", value: 9 },
];

export const MOCK_ORDERS = [
  {
    id: "ord-001",
    status: "pending",
    total_amount: 349,
    customer_name: "Youssef El Mansouri",
    customer_email: "youssef@example.com",
    customer_phone: "+212661234567",
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    order_items: [
      { 
        id: "oi-1", 
        product_name: "Carte NFC", 
        variant_name: "Noir", 
        quantity: 2, 
        unit_price: 149,
        customization: {
          designType: "custom",
          displayName: "Youssef El Mansouri",
          profession: "Directeur Général",
          businessName: "TechAtlas",
          logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        }
      },
      { 
        id: "oi-2", 
        product_name: "Plaque Avis Google", 
        variant_name: null, 
        quantity: 1, 
        unit_price: 51,
        configuration: {
          reviewDestination: "https://g.page/r/example"
        }
      },
    ],
  },
  {
    id: "ord-002",
    status: "paid",
    total_amount: 149,
    customer_name: "Salma Benali",
    customer_email: "salma.b@gmail.com",
    customer_phone: "+212698765432",
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    order_items: [
      { 
        id: "oi-3", 
        product_name: "Bracelet NFC", 
        variant_name: "Blanc", 
        quantity: 1, 
        unit_price: 149,
        customization: {
          designType: "standard",
          displayName: "Salma Benali"
        }
      },
    ],
  },
  {
    id: "ord-003",
    status: "shipped",
    total_amount: 748,
    customer_name: "Amine Tazi",
    customer_email: "amine.tazi@hotmail.com",
    customer_phone: "+212677889900",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    order_items: [
      { 
        id: "oi-4", 
        product_name: "BuzzCards", 
        variant_name: "Classique", 
        quantity: 4, 
        unit_price: 149,
        customization: {
          designType: "custom",
          displayName: "Amine Tazi",
          businessName: "Studio Tazi",
          logoUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          designNotes: "Make it minimalist."
        }
      },
      { 
        id: "oi-5", 
        product_name: "Carte WhatsApp NFC", 
        variant_name: null, 
        quantity: 2, 
        unit_price: 76,
        configuration: {
          whatsappDestination: "+212677889900"
        }
      },
    ],
  },
  {
    id: "ord-004",
    status: "paid",
    total_amount: 229,
    customer_name: "Nadia Cherkaoui",
    customer_email: "nadia.c@gmail.com",
    customer_phone: "+212654321098",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    order_items: [
      { 
        id: "oi-6", 
        product_name: "Carte NFC Transparente", 
        variant_name: null, 
        quantity: 1, 
        unit_price: 229,
        customization: {
          designType: "standard",
          displayName: "Nadia Cherkaoui"
        }
      },
    ],
  },
  {
    id: "ord-005",
    status: "cancelled",
    total_amount: 99,
    customer_name: "Khalid Saidi",
    customer_email: null,
    customer_phone: "+212612345678",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    order_items: [
      { 
        id: "oi-7", 
        product_name: "Mini Plaque Avis Google", 
        variant_name: null, 
        quantity: 1, 
        unit_price: 99,
        configuration: {
          reviewDestination: "Business Address"
        }
      },
    ],
  },
];

export const MOCK_CATEGORIES = [
  { id: "cat-1", name: "Cartes NFC", slug: "cartes-nfc", description: "Nos cartes de visite NFC", position: 1, is_active: true },
  { id: "cat-2", name: "Bracelets NFC", slug: "bracelets-nfc", description: "Bracelets NFC personnalisés", position: 2, is_active: true },
  { id: "cat-3", name: "Plaques Avis", slug: "plaques-avis", description: "Plaques pour avis Google", position: 3, is_active: true },
  { id: "cat-4", name: "Présentoirs", slug: "presentoirs", description: "Présentoirs NFC pour vitrines", position: 4, is_active: false },
];

export const MOCK_PRODUCTS = [
  {
    id: "prod-1", slug: "carte-nfc", name: "Carte NFC",
    category: "cartes-nfc", categoryName: "Cartes NFC", categoryId: "cat-1",
    badge: "Best Seller", isFeatured: true, isActive: true,
    basePrice: 149, price: 149, priceLabel: "149 MAD",
    stockCount: 24, stock: "in_stock",
    description: "Carte de visite NFC premium, partage tes infos d'un simple tap.",
    variants: [], media: [], images: [], image: "",
  },
  {
    id: "prod-2", slug: "bracelet-nfc", name: "Bracelet NFC",
    category: "bracelets-nfc", categoryName: "Bracelets NFC", categoryId: "cat-2",
    badge: "Nouveau", isFeatured: false, isActive: true,
    basePrice: 149, price: 149, priceLabel: "149 MAD",
    stockCount: 15, stock: "in_stock",
    description: "Bracelet NFC élégant pour partager ton profil sans sortir ton téléphone.",
    variants: [], media: [], images: [], image: "",
  },
  {
    id: "prod-3", slug: "plaque-avis-google", name: "Plaque Avis Google",
    category: "plaques-avis", categoryName: "Plaques Avis", categoryId: "cat-3",
    badge: null, isFeatured: true, isActive: true,
    basePrice: 199, price: 199, priceLabel: "199 MAD",
    stockCount: 0, stock: "out_of_stock",
    description: "Plaque NFC pour recevoir des avis Google directement en magasin.",
    variants: [], media: [], images: [], image: "",
  },
  {
    id: "prod-4", slug: "carte-whatsapp-nfc", name: "Carte WhatsApp NFC",
    category: "cartes-nfc", categoryName: "Cartes NFC", categoryId: "cat-1",
    badge: null, isFeatured: false, isActive: true,
    basePrice: 129, price: 129, priceLabel: "129 MAD",
    stockCount: 8, stock: "in_stock",
    description: "Lance une conversation WhatsApp immédiatement via un tap NFC.",
    variants: [], media: [], images: [], image: "",
  },
  {
    id: "prod-5", slug: "presentoir-nfc", name: "Présentoir Instagram NFC",
    category: "presentoirs", categoryName: "Présentoirs", categoryId: "cat-4",
    badge: "Pro", isFeatured: false, isActive: false,
    basePrice: 349, price: 349, priceLabel: "349 MAD",
    stockCount: 3, stock: "in_stock",
    description: "Présentoir de vitrine NFC pour rediriger vers ton profil Instagram.",
    variants: [], media: [], images: [], image: "",
  },
  {
    id: "prod-6", slug: "buzzcards", name: "BuzzCards",
    category: "cartes-nfc", categoryName: "Cartes NFC", categoryId: "cat-1",
    badge: null, isFeatured: false, isActive: true,
    basePrice: 149, price: 149, priceLabel: "149 MAD",
    stockCount: 30, stock: "in_stock",
    description: "La carte de visite digitale classique de BuzzCard.",
    variants: [], media: [], images: [], image: "",
  },
];
