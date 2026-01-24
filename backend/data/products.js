const products = [
  {
    name: "Royal Silk Dabka",
    image: "https://res.cloudinary.com/dtnyrvshf/image/upload/v1737637841/IMG_0129_copy_1_whf0f3.jpg",
    images: [
       "https://res.cloudinary.com/dtnyrvshf/image/upload/v1737637841/IMG_0129_copy_1_whf0f3.jpg",
       "https://res.cloudinary.com/dtnyrvshf/image/upload/v1737637841/IMG_0130_copy_1_abc123.jpg"
    ],
    description: "Handcrafted with pure silk and intricate dabka work, perfect for bridal wear.",
    price: 4200,
    originalPrice: 5500,
    category: "Bridal",
    rating: 4.8,
    numReviews: 12,
    isNewArrival: true,
    isBestSeller: true,
    stock: [
      { size: 36, quantity: 0 }, // Test Out of Stock
      { size: 37, quantity: 5 },
      { size: 38, quantity: 8 },
      { size: 39, quantity: 3 },
      { size: 40, quantity: 2 },
      { size: 41, quantity: 4 }
    ],
    totalStock: 22
  },
  {
    name: "Velvet Gota Patti",
    image: "https://res.cloudinary.com/dtnyrvshf/image/upload/v1737637841/IMG_0133_copy_1_xyz789.jpg",
    images: [
      "https://res.cloudinary.com/dtnyrvshf/image/upload/v1737637841/IMG_0133_copy_1_xyz789.jpg"
    ],
    description: "Premium velvet base with traditional Gota Patti work in gold.",
    price: 3800,
    originalPrice: 4500,
    category: "Party Wear",
    rating: 4.5,
    numReviews: 8,
    isNewArrival: false,
    stock: [
      { size: 36, quantity: 2 },
      { size: 37, quantity: 4 },
      { size: 38, quantity: 0 }, // Out of stock
      { size: 39, quantity: 6 },
      { size: 40, quantity: 3 },
      { size: 41, quantity: 1 }
    ],
    totalStock: 16
  },
  {
    name: "Pastel Pearl Mule",
    image: "https://res.cloudinary.com/dtnyrvshf/image/upload/v1737637841/IMG_0137_copy_1_mno456.jpg",
    images: [
      "https://res.cloudinary.com/dtnyrvshf/image/upload/v1737637841/IMG_0137_copy_1_mno456.jpg"
    ],
    description: "Soft pastel hues embellished with elegant pearls and beads.",
    price: 3200,
    originalPrice: 0,
    category: "Casual",
    rating: 4.7,
    numReviews: 10,
    isNewArrival: true,
    stock: [
      { size: 36, quantity: 5 },
      { size: 37, quantity: 5 },
      { size: 38, quantity: 5 },
      { size: 39, quantity: 5 },
      { size: 40, quantity: 5 },
      { size: 41, quantity: 5 }
    ],
    totalStock: 30
  },
  {
    name: "Golden Zardosi Glam",
    image: "https://res.cloudinary.com/dtnyrvshf/image/upload/v1737637842/IMG_0140_copy_1_pqr123.jpg",
    images: [
      "https://res.cloudinary.com/dtnyrvshf/image/upload/v1737637842/IMG_0140_copy_1_pqr123.jpg"
    ],
    description: "Heavy Zardosi embroidery on a golden base, ideal for weddings.",
    price: 4500,
    originalPrice: 6000,
    category: "Bridal",
    rating: 5.0,
    numReviews: 15,
    isNewArrival: false,
    stock: [
      { size: 36, quantity: 1 },
      { size: 37, quantity: 2 },
      { size: 38, quantity: 3 },
      { size: 39, quantity: 0 },
      { size: 40, quantity: 0 },
      { size: 41, quantity: 1 }
    ],
    totalStock: 7
  },
  {
    name: "Rose Gold Sequin",
    image: "https://res.cloudinary.com/dtnyrvshf/image/upload/v1737637842/IMG_0142_copy_1_stu789.jpg",
    images: [
      "https://res.cloudinary.com/dtnyrvshf/image/upload/v1737637842/IMG_0142_copy_1_stu789.jpg"
    ],
    description: "Shimmering sequins on a rose gold fabric, perfect for evening parties.",
    price: 2900,
    originalPrice: 3500,
    category: "Party Wear",
    rating: 4.2,
    numReviews: 5,
    isNewArrival: true,
    stock: [
      { size: 36, quantity: 10 },
      { size: 37, quantity: 10 },
      { size: 38, quantity: 10 },
      { size: 39, quantity: 10 },
      { size: 40, quantity: 10 },
      { size: 41, quantity: 10 }
    ],
    totalStock: 60
  },
  {
    name: "Emerald Threadwork",
    image: "https://res.cloudinary.com/dtnyrvshf/image/upload/v1737637842/IMG_0146_copy_1_vwx456.jpg",
    images: [
      "https://res.cloudinary.com/dtnyrvshf/image/upload/v1737637842/IMG_0146_copy_1_vwx456.jpg"
    ],
    description: "Deep emerald green jutti with contrasting thread embroidery.",
    price: 3100,
    originalPrice: 0,
    category: "Casual",
    rating: 4.6,
    numReviews: 9,
    isNewArrival: false,
    stock: [
      { size: 36, quantity: 3 },
      { size: 37, quantity: 3 },
      { size: 38, quantity: 3 },
      { size: 39, quantity: 3 },
      { size: 40, quantity: 3 },
      { size: 41, quantity: 3 }
    ],
    totalStock: 18
  },
  {
    name: "Mirror Magic",
    image: "https://res.cloudinary.com/dtnyrvshf/image/upload/v1737637843/IMG_0150_copy_1_yza123.jpg",
    images: [
      "https://res.cloudinary.com/dtnyrvshf/image/upload/v1737637843/IMG_0150_copy_1_yza123.jpg"
    ],
    description: "Traditional mirror work (Sheesha) on a vibrant fabric base.",
    price: 3400,
    originalPrice: 4000,
    category: "Ethnic",
    rating: 4.4,
    numReviews: 11,
    isNewArrival: true,
    stock: [
      { size: 36, quantity: 4 },
      { size: 37, quantity: 0 },
      { size: 38, quantity: 4 },
      { size: 39, quantity: 4 },
      { size: 40, quantity: 4 },
      { size: 41, quantity: 4 }
    ],
    totalStock: 20
  },
  {
    name: "Minimalist Beige",
    image: "https://res.cloudinary.com/dtnyrvshf/image/upload/v1737637843/IMG_0153_copy_1_bcd789.jpg",
    images: [
      "https://res.cloudinary.com/dtnyrvshf/image/upload/v1737637843/IMG_0153_copy_1_bcd789.jpg"
    ],
    description: "Elegant and simple beige jutti for everyday comfort.",
    price: 2500,
    originalPrice: 0,
    category: "Casual",
    rating: 4.3,
    numReviews: 20,
    isNewArrival: false,
    stock: [
      { size: 36, quantity: 20 },
      { size: 37, quantity: 20 },
      { size: 38, quantity: 20 },
      { size: 39, quantity: 20 },
      { size: 40, quantity: 20 },
      { size: 41, quantity: 20 }
    ],
    totalStock: 120
  },
  {
    name: "Ruby Red Bridal",
    image: "https://res.cloudinary.com/dtnyrvshf/image/upload/v1737637843/IMG_0160_copy_1_efg456.jpg",
    images: [
      "https://res.cloudinary.com/dtnyrvshf/image/upload/v1737637843/IMG_0160_copy_1_efg456.jpg"
    ],
    description: "Classic red bridal jutti with heavy stone and bead work.",
    price: 4800,
    originalPrice: 5500,
    category: "Bridal",
    rating: 4.9,
    numReviews: 30,
    isNewArrival: true,
    isBestSeller: true,
    stock: [
      { size: 36, quantity: 1 },
      { size: 37, quantity: 2 },
      { size: 38, quantity: 0 },
      { size: 39, quantity: 2 },
      { size: 40, quantity: 1 },
      { size: 41, quantity: 0 }
    ],
    totalStock: 6
  },
  {
    name: "Silver Stardust",
    image: "https://res.cloudinary.com/dtnyrvshf/image/upload/v1737637843/IMG_0164_copy_1_hij123.jpg",
    images: [
      "https://res.cloudinary.com/dtnyrvshf/image/upload/v1737637843/IMG_0164_copy_1_hij123.jpg"
    ],
    description: "Contemporary silver finish with subtle sparkle elements.",
    price: 3600,
    originalPrice: 0,
    category: "Party Wear",
    rating: 4.1,
    numReviews: 4,
    isNewArrival: false,
    stock: [
      { size: 36, quantity: 6 },
      { size: 37, quantity: 6 },
      { size: 38, quantity: 6 },
      { size: 39, quantity: 6 },
      { size: 40, quantity: 6 },
      { size: 41, quantity: 6 }
    ],
    totalStock: 36
  },
  {
    name: "Floral Phulkari",
    image: "https://res.cloudinary.com/dtnyrvshf/image/upload/v1737637843/IMG_0169_copy_1_klm789.jpg",
    images: [
      "https://res.cloudinary.com/dtnyrvshf/image/upload/v1737637843/IMG_0169_copy_1_klm789.jpg"
    ],
    description: "Vibrant multi-colored floral embroidery inspired by Phulkari art.",
    price: 2800,
    originalPrice: 3200,
    category: "Ethnic",
    rating: 4.6,
    numReviews: 14,
    isNewArrival: true,
    stock: [
      { size: 36, quantity: 2 },
      { size: 37, quantity: 5 },
      { size: 38, quantity: 8 },
      { size: 39, quantity: 4 },
      { size: 40, quantity: 3 },
      { size: 41, quantity: 6 }
    ],
    totalStock: 28
  },
  {
    name: "Vintage Bronze",
    image: "https://res.cloudinary.com/dtnyrvshf/image/upload/v1737637844/IMG_0172_copy_1_nop456.jpg",
    images: [
      "https://res.cloudinary.com/dtnyrvshf/image/upload/v1737637844/IMG_0172_copy_1_nop456.jpg"
    ],
    description: "Antique bronze tone with muted gold detailing for a vintage look.",
    price: 3300,
    originalPrice: 0,
    category: "Casual",
    rating: 4.5,
    numReviews: 6,
    isNewArrival: false,
    stock: [
      { size: 36, quantity: 3 },
      { size: 37, quantity: 3 },
      { size: 38, quantity: 3 },
      { size: 39, quantity: 3 },
      { size: 40, quantity: 3 },
      { size: 41, quantity: 3 }
    ],
    totalStock: 18
  }
];

module.exports = products;