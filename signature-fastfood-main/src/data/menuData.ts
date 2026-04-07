// ─── Image path constants ─────────────────────────────────────────────────────
// Originals already in /media
const heroBurger        = "/media/hero-burger.png";
const fries             = "/media/fries.png";
const friedChicken      = "/media/fried-chicken.png";
const wrap              = "/media/wrap.png";
const drinks            = "/media/drinks.png";
const combo             = "/media/combo.png";
const dealFamilyFeast   = "/media/deal-family-feast.png";
const dealBogoBurger    = "/media/deal-bogo-burger.png";
const dealChickenCombo  = "/media/deal-chicken-combo.png";
const dealMegaCombo     = "/media/deal-mega-combo.png";
const deal5Burgers      = "/media/deal-5-burgers.png";
const dealDuoMeal       = "/media/deal-duo-meal.png";

// Pics folder images (copied → /media)
const pattyBurger       = "/media/patty-burger.png";
const zingerBurger      = "/media/zinger-burger (1).png";
const signatureBurger   = "/media/signature-burger.png";
const bihariRoll        = "/media/bihari-roll.png";
const zingerWrap        = "/media/zinger-wrap.png";
const regularFries      = "/media/regular-fries.png";
const bucketFries       = "/media/bucket-fries.png";
const loadedFries       = "/media/loaded-fries.png";
const bakedWings        = "/media/baked-wings.png";
const hotShots          = "/media/hot-shots.png";
const nuggets           = "/media/nuggets.png";
const friedChickenPiece = "/media/fried-chicken-piece.png";
const dealSolo          = "/media/deal-solo.png";
const dealDuo           = "/media/deal-duo.png";
const dealPlaster       = "/media/deal-plaster.png";
const dealChickenFries  = "/media/deal-chicken-fries.png";
const dealTripleZinger  = "/media/deal-triple-zinger.png";
const dealZingerCombo   = "/media/deal-zinger-combo.png";
const dealIftar         = "/media/deal-iftar.png";
const addOnsImg         = "/media/addons.png";

// Pizza images
const pizzaCheese       = "/media/pizza-cheese.png";
const pizzaChicken      = "/media/pizza-chicken.png";
const pizzaFajita       = "/media/pizza-fajita.png";
const pizzaHotSpice     = "/media/pizza-hot-spice.png";
const pizzaSignature    = "/media/pizza-signature.png";
const pizzaSupreme      = "/media/pizza-supreme.png";
const pizzaTandoori     = "/media/pizza-tandoori.png";
const pizzaTikka        = "/media/pizza-tikka.png";
const pizzaVegi         = "/media/pizza-vegi.png";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  isBestSeller?: boolean;
  sizes?: { label: string; price: number }[];
}

export interface MenuCategory {
  name: string;
  image: string;
  count: number;
}

export interface ComboDeal {
  id: string;
  title: string;
  price: number;
  items: string[];
  image: string;
  discount?: string;
  originalPrice?: number;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export const categories: MenuCategory[] = [
  { name: "Burgers",       image: pattyBurger,   count: 3 },
  { name: "Wraps & Rolls", image: zingerWrap,    count: 2 },
  { name: "Fries & Sides", image: regularFries,  count: 3 },
  { name: "Wings",         image: bakedWings,    count: 2 },
  { name: "Appetizers",    image: friedChickenPiece, count: 4 },
  { name: "Pizza",         image: pizzaSignature, count: 9 },
  { name: "Combo Meals",   image: dealZingerCombo, count: 4 },
  { name: "Family Deals",  image: dealFamilyFeast, count: 8 },
];

const pizzaSizes = [
  { label: "S", price: 699 },
  { label: "M", price: 899 },
  { label: "L", price: 1099 },
];

export const menuItems: MenuItem[] = [
  // ─── BURGERS ───────────────────────────────────────────────────────────────
  {
    id: "b1",
    name: "Patty Burger",
    description: "Classic beef patty burger with fresh lettuce, tomato & our special sauce",
    price: 250,
    image: pattyBurger,
    category: "Burgers",
    rating: 4.5,
  },
  {
    id: "b2",
    name: "Zinger Burger",
    description: "Crispy golden zinger fillet with creamy coleslaw & zinger mayo",
    price: 450,
    image: zingerBurger,
    category: "Burgers",
    rating: 4.8,
    isBestSeller: true,
  },
  {
    id: "b3",
    name: "Signature Burger",
    description: "Our masterpiece — double layered fillet with signature sauce & premium toppings",
    price: 799,
    image: signatureBurger,
    category: "Burgers",
    rating: 4.9,
    isBestSeller: true,
  },

  // ─── WRAPS & ROLLS ─────────────────────────────────────────────────────────
  {
    id: "w1",
    name: "Bihari Roll (4 Piece)",
    description: "4 pieces of smoky Bihari kebab wrapped in fresh paratha — a Desi favorite",
    price: 580,
    image: bihariRoll,
    category: "Wraps & Rolls",
    rating: 4.7,
    isBestSeller: true,
  },
  {
    id: "w2",
    name: "Zinger Wrap",
    description: "Crispy zinger fillet rolled in a warm tortilla with fresh vegetables & mayo",
    price: 380,
    image: zingerWrap,
    category: "Wraps & Rolls",
    rating: 4.6,
  },

  // ─── FRIES & SIDES ─────────────────────────────────────────────────────────
  {
    id: "f1",
    name: "Regular Fries",
    description: "Golden crispy fries with our secret seasoning blend",
    price: 180,
    image: regularFries,
    category: "Fries & Sides",
    rating: 4.4,
  },
  {
    id: "f2",
    name: "Bucket Fries",
    description: "A generous bucket of crispy fries — perfect for sharing",
    price: 270,
    image: bucketFries,
    category: "Fries & Sides",
    rating: 4.5,
  },
  {
    id: "f3",
    name: "Sig. Loaded Fries",
    description: "Golden fries topped with cheese sauce, jalapeños & signature drizzle",
    price: 599,
    image: loadedFries,
    category: "Fries & Sides",
    rating: 4.8,
    isBestSeller: true,
  },

  // ─── WINGS ─────────────────────────────────────────────────────────────────
  {
    id: "wg1",
    name: "10pc Hot Wings",
    description: "10 fiery hot wings tossed in spicy buffalo sauce — dare to try!",
    price: 599,
    image: hotShots,
    category: "Wings",
    rating: 4.7,
    isBestSeller: true,
  },
  {
    id: "wg2",
    name: "Oven Baked Wings",
    description: "Juicy oven-baked wings with a crispy golden skin and smoky seasoning",
    price: 550,
    image: bakedWings,
    category: "Wings",
    rating: 4.6,
  },

  // ─── APPETIZERS ────────────────────────────────────────────────────────────
  {
    id: "a1",
    name: "1pc Chicken",
    description: "One perfectly fried crispy chicken piece — crunchy outside, juicy inside",
    price: 270,
    image: friedChickenPiece,
    category: "Appetizers",
    rating: 4.5,
  },
  {
    id: "a2",
    name: "3pc Chicken",
    description: "Three pieces of golden fried crispy chicken — great for sharing",
    price: 750,
    image: friedChickenPiece,
    category: "Appetizers",
    rating: 4.7,
    isBestSeller: true,
  },
  {
    id: "a3",
    name: "6pc Nuggets",
    description: "Six tender crispy chicken nuggets with dipping sauce",
    price: 420,
    image: nuggets,
    category: "Appetizers",
    rating: 4.6,
  },
  {
    id: "a4",
    name: "9pc Hot Shots",
    description: "Nine spicy hot shot bites — addictively crunchy and fiery",
    price: 400,
    image: hotShots,
    category: "Appetizers",
    rating: 4.5,
  },

  // ─── PIZZA ─────────────────────────────────────────────────────────────────
  {
    id: "pz1",
    name: "Chez Lover Pizza",
    description: "Classic mozzarella & cheddar blend on a rich tomato base — timeless perfection",
    price: 580,
    image: pizzaCheese,
    category: "Pizza",
    rating: 4.5,
    sizes: [
      { label: "S", price: 580 },
      { label: "M", price: 850 },
      { label: "L", price: 1370 },
    ],
  },
  {
    id: "pz2",
    name: "Chicken Lover Pizza",
    description: "Loaded with juicy grilled chicken chunks and our signature sauce",
    price: 580,
    image: pizzaChicken,
    category: "Pizza",
    rating: 4.7,
    isBestSeller: true,
    sizes: [
      { label: "S", price: 580 },
      { label: "M", price: 950 },
      { label: "L", price: 1370 },
    ],
  },
  {
    id: "pz3",
    name: "Fajita Pizza",
    description: "Grilled chicken, bell peppers, onions & jalapeños with smoky fajita sauce",
    price: 599,
    image: pizzaFajita,
    category: "Pizza",
    rating: 4.8,
    isBestSeller: true,
    sizes: [
      { label: "S", price: 599 },
      { label: "M", price: 999 },
      { label: "L", price: 1399 },
    ],
  },
  {
    id: "pz4",
    name: "Hot N Spice Pizza",
    description: "Extra spicy sauce, fiery toppings and double cheese — for true heat lovers",
    price: 570,
    image: pizzaHotSpice,
    category: "Pizza",
    rating: 4.6,
    sizes: [
      { label: "S", price: 570 },
      { label: "M", price: 899 },
      { label: "L", price: 1350 },
    ],
  },
  {
    id: "pz5",
    name: "Signature Special",
    description: "Our house special — loaded with premium toppings and secret signature sauce",
    price: 1400,
    image: pizzaSignature,
    category: "Pizza",
    rating: 4.9,
    isBestSeller: true,
    sizes: [
      { label: "M", price: 1400 },
      { label: "L", price: 1899 },
    ],
  },
  {
    id: "pz6",
    name: "Supreme Pizza",
    description: "Pepperoni, chicken, mushrooms, olives & veggies on a perfectly baked crust",
    price: 570,
    image: pizzaSupreme,
    category: "Pizza",
    rating: 4.7,
    sizes: [
      { label: "S", price: 570 },
      { label: "M", price: 899 },
      { label: "L", price: 1350 },
    ],
  },
  {
    id: "pz7",
    name: "Tandoori Pizza",
    description: "Tandoori-marinated chicken on a spiced sauce — desi flavors meet Italian crust",
    price: 550,
    image: pizzaTandoori,
    category: "Pizza",
    rating: 4.6,
    sizes: [
      { label: "S", price: 550 },
      { label: "M", price: 850 },
      { label: "L", price: 1330 },
    ],
  },
  {
    id: "pz8",
    name: "Tikka Pizza",
    description: "Succulent tikka chunks with green chutney drizzle and fresh onions",
    price: 599,
    image: pizzaTikka,
    category: "Pizza",
    rating: 4.7,
    isBestSeller: true,
    sizes: [
      { label: "S", price: 599 },
      { label: "M", price: 999 },
      { label: "L", price: 1399 },
    ],
  },
  {
    id: "pz9",
    name: "Vegi Lover Pizza",
    description: "Fresh bell peppers, mushrooms, corn & olives on a herbed tomato base",
    price: 550,
    image: pizzaVegi,
    category: "Pizza",
    rating: 4.4,
    sizes: [
      { label: "S", price: 550 },
      { label: "M", price: 899 },
      { label: "L", price: 1299 },
    ],
  },

  // ─── COMBO MEALS ───────────────────────────────────────────────────────────
  {
    id: "c1",
    name: "Zinger Combo (Small)",
    description: "Zinger Burger + Regular Fries + Regular Drink",
    price: 450,
    image: dealZingerCombo,
    category: "Combo Meals",
    rating: 4.7,
  },
  {
    id: "c2",
    name: "Zinger Combo (Large)",
    description: "Zinger Burger + Large Fries + 1.5L Drink",
    price: 599,
    image: dealZingerCombo,
    category: "Combo Meals",
    rating: 4.8,
    isBestSeller: true,
  },
  {
    id: "c3",
    name: "Zinger Wraps Combo",
    description: "Zinger Wrap + Regular Fries + Regular Drink",
    price: 530,
    image: dealZingerCombo,
    category: "Combo Meals",
    rating: 4.6,
  },
  {
    id: "c4",
    name: "Signature Combo",
    description: "Signature Burger + Large Fries + 1.5L Drink",
    price: 899,
    image: combo,
    category: "Combo Meals",
    rating: 4.9,
    isBestSeller: true,
  },

  // ─── FAMILY DEALS ──────────────────────────────────────────────────────────
  {
    id: "fd1",
    name: "Chicken Fries Deal",
    description: "2pc Chicken + 1 Reg. Fries + Dip Sauce + Dinner Roll",
    price: 670,
    image: dealChickenFries,
    category: "Family Deals",
    rating: 4.6,
  },
  {
    id: "fd2",
    name: "Solo Meal",
    description: "1 Zinger + 1pc Fried Chicken + 1 Garlic Dip + Fries + 1 Reg. Drink",
    price: 890,
    image: dealSolo,
    category: "Family Deals",
    rating: 4.7,
    isBestSeller: true,
  },
  {
    id: "fd3",
    name: "Duo Share Box",
    description: "2pc Zinger Burger + 2pc Fried Chicken + 1 Regular Fries + 2 Reg. Drinks",
    price: 1350,
    image: dealDuo,
    category: "Family Deals",
    rating: 4.8,
  },
  {
    id: "fd4",
    name: "Plaster",
    description: "4pc Bihari Roll + 1 Reg. Fries + Dip Sauce + 6 Baked Wings",
    price: 999,
    image: dealPlaster,
    category: "Family Deals",
    rating: 4.7,
  },
  {
    id: "fd5",
    name: "Chicken Duo Box",
    description: "5pc Fried Chicken + 1 Reg. Fries + 2 Reg. Drinks",
    price: 1260,
    image: dealChickenFries,
    category: "Family Deals",
    rating: 4.6,
  },
  {
    id: "fd6",
    name: "Triple Zinger",
    description: "3 Zinger Burgers + 1.5 Ltr Drink",
    price: 1199,
    image: dealTripleZinger,
    category: "Family Deals",
    rating: 4.7,
  },
  {
    id: "fd7",
    name: "Family Deal 1",
    description: "4pc Zinger + 4pc Fried Chicken + 1 Regular Fries + 1.5ml Drink",
    price: 2299,
    image: dealFamilyFeast,
    category: "Family Deals",
    rating: 4.9,
    isBestSeller: true,
  },
  {
    id: "fd8",
    name: "Family Deal 2",
    description: "9pc Fried Chicken + 1 Full Bucket Fries + 1 Garlic Dip + 1.5ml Drink",
    price: 2199,
    image: dealFamilyFeast,
    category: "Family Deals",
    rating: 4.8,
  },
];

// ─── ADD-ONS ──────────────────────────────────────────────────────────────────
export const addOns: AddOn[] = [
  { id: "ao1", name: "Mayo Dip",    price: 50, image: "/media/mayo.png" },
  { id: "ao2", name: "Garlic Mayo", price: 70, image: "/media/garlicmayo.png" },
  { id: "ao3", name: "Cheese Slice",price: 70, image: "/media/cheese.png" },
];

export const comboDeals: ComboDeal[] = [
  { id: "cd1", title: "ZINGER COMBO S",     price: 450,  items: ["1 Zinger Burger", "Regular Fries", "Regular Drink"],                              image: dealZingerCombo,  originalPrice: 610,  discount: "26% OFF" },
  { id: "cd2", title: "ZINGER COMBO L",     price: 599,  items: ["1 Zinger Burger", "Large Fries", "1.5 Ltr Drink"],                               image: dealZingerCombo,  originalPrice: 840,  discount: "29% OFF" },
  { id: "cd3", title: "ZINGER WRAP COMBO",  price: 530,  items: ["1 Zinger Wrap", "Regular Fries", "Regular Drink"],                               image: dealDuoMeal,       originalPrice: 710,  discount: "25% OFF" },
  { id: "cd4", title: "SIGNATURE COMBO",    price: 899,  items: ["1 Signature Burger", "Large Fries", "1.5 Ltr Drink"],                            image: combo,             originalPrice: 1219, discount: "26% OFF" },
  { id: "cd5", title: "SOLO MEAL",          price: 890,  items: ["1 Zinger", "1pc Fried Chicken", "Garlic Dip + Fries", "1 Reg. Drink"],           image: dealSolo,          originalPrice: 1080, discount: "18% OFF" },
  { id: "cd6", title: "DUO SHARE BOX",      price: 1350, items: ["2pc Zinger Burger", "2pc Fried Chicken", "1 Regular Fries", "2 Reg. Drinks"],    image: dealDuo,           originalPrice: 1760, discount: "23% OFF" },
  { id: "cd7", title: "FAMILY DEAL 1",      price: 2299, items: ["4pc Zinger", "4pc Fried Chicken", "1 Regular Fries", "1.5ml Drink"],             image: dealFamilyFeast,   originalPrice: 3100, discount: "26% OFF" },
  { id: "cd8", title: "FAMILY DEAL 2",      price: 2199, items: ["9pc Fried Chicken", "1 Full Bucket Fries", "1 Garlic Dip", "1.5ml Drink"],      image: dealFamilyFeast,   originalPrice: 2900, discount: "24% OFF" },
];


export const reviews = [
  { id: 1, name: "Sarah M.",  avatar: "SM", rating: 5, text: "Honestly the best burgers I've ever had. The Signature Burger is *chef's kiss*. My whole family is obsessed!" },
  { id: 2, name: "Ahmed K.",  avatar: "AK", rating: 5, text: "We order the family deal every Friday night. The kids fight over the last piece of chicken 😂" },
  { id: 3, name: "Aisha R.",  avatar: "AR", rating: 4, text: "Super easy to order and the food always arrives hot. The Zinger Wrap is my guilty pleasure!" },
  { id: 4, name: "Usman D.",  avatar: "UD", rating: 5, text: "Once you try Signature, nothing else comes close. Period. These guys know what they're doing." },
  { id: 5, name: "Fatima S.", avatar: "FS", rating: 5, text: "The loaded fries are heavenly! I'm a regular now 🥰" },
];

// Contact Info — The Signature Café
export const contactInfo = {
  name: "The Signature Café",
  tagline: "Bite into Happiness",
  phone: "(0312) 5429 037",
  whatsapp: "923125429037",
  address: "Shop No 23, Ground Floor Ameer Mall, Opposite Begum Haseena Hospital, New City Wah Cantt Phase 2",
  instagram: "@thesignaturecafe",
  tiktok: "@thesignaturecafee",
  instagramUrl: "https://www.instagram.com/info.thesignaturecafe?igsh=MTBvZ2R1enRub2lyeA==",
  tiktokUrl: "https://www.tiktok.com/@thesignaturecafee?_r=1&_t=ZS-95FrtTeNr3U",
  services: ["Dining", "Takeaway", "Home Delivery"],
  established: "ESTD 2024",
};
