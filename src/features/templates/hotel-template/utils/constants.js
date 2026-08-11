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
  name: "Riad Dar Al Andalous",
  tagline: "Un havre de paix au cœur de la Médina",
  stars: 5,
  established: "1924",
  phones: ["+212 5 24 38 91 00"],
  emails: ["reservations@daralandalous.ma"],
  website: "https://daralandalous.ma",
  location: "27 Derb El Hammam, Médina, Marrakech 40000",
  mapQuery: "Riad+Dar+Al+Andalous+Marrakech",
  avatarUrl: "/justlogo.png",
  bannerUrl: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&auto=format&fit=crop&q=80",
  about: "Niché au cœur de la médina de Marrakech, le Riad Dar Al Andalous est un joyau architectural du XIXe siècle, restauré avec passion pour préserver l'authenticité de l'art de vivre marocain. Chaque détail — des zellige artisanaux aux plafonds en bois de cèdre sculpté — raconte une histoire séculaire de raffinement et d'hospitalité.",
  quote: "\"L'hospitalité n'est pas un service, c'est un art de vivre.\"",

  amenities: [
    { id: 1, name: "Spa & Hammam", icon: "Sparkles" },
    { id: 2, name: "Piscine", icon: "Waves" },
    { id: 3, name: "Wi-Fi Haut Débit", icon: "Wifi" },
    { id: 4, name: "Restaurant", icon: "UtensilsCrossed" },
    { id: 5, name: "Room Service 24h", icon: "ConciergeBell" },
    { id: 6, name: "Parking Privé", icon: "Car" },
  ],

  rooms: [
    {
      id: 1,
      name: "Suite Andalouse",
      price: "2 800 MAD",
      perNight: true,
      size: "45m²",
      description: "Suite luxueuse avec patio privé et vue sur la cour intérieure",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500&auto=format&fit=crop&q=80",
      amenities: ["King Bed", "Patio", "Minibar"],
    },
    {
      id: 2,
      name: "Chambre Royale",
      price: "4 500 MAD",
      perNight: true,
      size: "65m²",
      description: "Chambre d'exception avec terrasse panoramique et jacuzzi privé",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&auto=format&fit=crop&q=80",
      amenities: ["King Bed", "Jacuzzi", "Terrasse"],
    },
    {
      id: 3,
      name: "Suite Impériale",
      price: "7 200 MAD",
      perNight: true,
      size: "90m²",
      description: "L'apogée du luxe marocain avec salon privé et hammam personnel",
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&auto=format&fit=crop&q=80",
      amenities: ["King Bed", "Hammam", "Salon"],
    },
  ],

  gallery: [
    "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&auto=format&fit=crop&q=80",
  ],

  reviews: [
    {
      id: 1,
      name: "Sophie Laurent",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80",
      rating: 5,
      text: "Un séjour absolument magique. Le service est impeccable, l'architecture à couper le souffle. On se sent transporté dans un autre monde.",
      date: "Mars 2024",
    },
    {
      id: 2,
      name: "James & Emily Carter",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80",
      rating: 5,
      text: "The most beautiful riad we've ever stayed in. The attention to detail is extraordinary — from the hand-carved doors to the fresh mint tea.",
      date: "Février 2024",
    },
    {
      id: 3,
      name: "Fatima Zahra B.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=80",
      rating: 5,
      text: "L'expérience hammam est divine. Le personnel est aux petits soins, et le petit-déjeuner sur la terrasse avec vue sur l'Atlas est inoubliable.",
      date: "Janvier 2024",
    },
  ],

  socials: [
    { platform: "Instagram", href: "https://instagram.com/daralandalous" },
    { platform: "TripAdvisor", href: "https://tripadvisor.com/" },
    { platform: "Facebook", href: "https://facebook.com/" },
    { platform: "GoogleMaps", href: "https://maps.google.com/?cid=123456789" },
    { platform: "Airbnb", href: "https://airbnb.com/rooms/123456" },
    { platform: "Booking", href: "https://booking.com/hotel/ma/dar-al-andalous" },
  ],

  hours: [
    { label: "Check-in", time: "14:00" },
    { label: "Check-out", time: "12:00" },
    { label: "Restaurant", time: "07:00 – 23:00" },
    { label: "Spa & Hammam", time: "09:00 – 21:00" },
  ],
};
