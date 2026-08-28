// ── Hotel Template Constants & Mock Data ──

export const COLORS = {
  latte: "#F3E9D7",
  caramel: "#B08968",
  mocha: "#7A553A",
  cappuccino: "#D6BFA6",
  espresso: "#3B2A22",
  gold: "#C9A96E",
  ivory: "#FAF6F0",
};

export const mockHotelProfile = {
  name: "The Grand Amara",
  tagline: "L'élégance marocaine, entre Marrakech et l'Atlas",
  stars: 5,
  established: "2024",
  phones: ["+212 5 24 33 48 80"],
  emails: ["reservations@grandamara.ma"],
  website: "https://grandamara.ma",
  location: "Route de l'Ourika, Km 8, Marrakech 40000",
  mapQuery: "The+Grand+Amara+Marrakech",
  avatarUrl: "/luxury_hotel_logo.png",
  bannerUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop&q=80",
  about: "À quelques minutes de la médina, The Grand Amara réunit l'élégance d'un resort contemporain et la chaleur de l'hospitalité marocaine. Ses suites lumineuses, ses jardins de palmiers et son spa inspiré des rituels du hammam offrent une parenthèse paisible face aux paysages de l'Atlas.",
  quote: "\"Ici, chaque séjour se vit au rythme de Marrakech.\"",

  amenities: [
    { id: 1, name: "Spa & Hammam", icon: "Sparkles" },
    { id: 2, name: "Piscine", icon: "Waves" },
    { id: 3, name: "Wi-Fi Haut Débit", icon: "Wifi" },
    { id: 4, name: "Restaurant", icon: "UtensilsCrossed" },
    { id: 5, name: "Conciergerie 24h", icon: "ConciergeBell" },
    { id: 6, name: "Transfert Aéroport", icon: "Car" },
  ],

  rooms: [
    {
      id: 1,
      name: "Chambre Amara",
      price: "1 850 MAD",
      perNight: true,
      size: "32m²",
      description: "Une chambre lumineuse avec terrasse privée ouverte sur les jardins",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500&auto=format&fit=crop&q=80",
      amenities: ["Lit King", "Terrasse", "Minibar"],
    },
    {
      id: 2,
      name: "Suite Majorelle",
      price: "2 650 MAD",
      perNight: true,
      size: "48m²",
      description: "Une suite aux accents bleu Majorelle avec salon et bassin privatif",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&auto=format&fit=crop&q=80",
      amenities: ["Lit King", "Bassin", "Salon"],
    },
    {
      id: 3,
      name: "Villa Atlas",
      price: "4 900 MAD",
      perNight: true,
      size: "85m²",
      description: "Une villa indépendante avec piscine, hammam et vue sur l'Atlas",
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&auto=format&fit=crop&q=80",
      amenities: ["Piscine", "Hammam", "Majordome"],
    },
  ],

  gallery: [
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&auto=format&fit=crop&q=80",
  ],

  reviews: [
    {
      id: 1,
      name: "Salma & Youssef B.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80",
      rating: 5,
      text: "Un week-end d'exception. L'équipe est attentionnée, le spa magnifique et le dîner marocain dans les jardins était parfaitement orchestré.",
      date: "Juin 2026",
    },
    {
      id: 2,
      name: "Claire Dubois",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80",
      rating: 5,
      text: "Une adresse élégante et calme à proximité de Marrakech. La Suite Majorelle est superbe et la conciergerie a organisé toutes nos excursions.",
      date: "Mai 2026",
    },
    {
      id: 3,
      name: "Daniel & Maya R.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=80",
      rating: 5,
      text: "A beautiful retreat with genuinely warm service. Breakfast by the pool and the private hammam made our stay unforgettable.",
      date: "Avril 2026",
    },
  ],

  socials: [
    { platform: "Instagram", href: "https://instagram.com/grandamara.marrakech" },
    { platform: "TripAdvisor", href: "https://tripadvisor.com/" },
    { platform: "Facebook", href: "https://facebook.com/grandamara.marrakech" },
    { platform: "GoogleMaps", href: "https://www.google.com/maps/search/?api=1&query=The+Grand+Amara+Marrakech" },
    { platform: "Airbnb", href: "https://airbnb.com/" },
    { platform: "Booking", href: "https://booking.com/" },
  ],

  hours: [
    { label: "Check-in", time: "14:00" },
    { label: "Check-out", time: "12:00" },
    { label: "Restaurant", time: "07:00 – 23:30" },
    { label: "Spa & Hammam", time: "09:00 – 21:00" },
  ],
};
