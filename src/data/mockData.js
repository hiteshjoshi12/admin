export const analyticsData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 2000 },
  { name: "Apr", sales: 2780 },
  { name: "May", sales: 1890 },
  { name: "Jun", sales: 2390 },
  { name: "Jul", sales: 3490 },
];

export const categoryData = [
  { name: "Bridal", sales: 120 },
  { name: "Casual", sales: 200 },
  { name: "Party", sales: 150 },
  { name: "Ethnic", sales: 80 },
  { name: "Office", sales: 45 },
];

export const initialProducts = [
  {
    id: 1,
    name: "Royal Punjabi Juti",
    price: 2499,
    stock: 45,
    category: "Bridal",
    status: "In Stock",
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603487742131-4160d6986ba2?q=80&w=200&auto=format&fit=crop",
    ],
  },
  {
    id: 2,
    name: "Tan Leather Mojari",
    price: 1299,
    stock: 12,
    category: "Casual",
    status: "Low Stock",
    images: [
      "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=200&auto=format&fit=crop",
    ],
  },
  {
    id: 3,
    name: "Phulkari Embroidered",
    price: 1899,
    stock: 0,
    category: "Ethnic",
    status: "Out of Stock",
    images: [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=200&auto=format&fit=crop",
    ],
  },
];


export const initialCoupons = [
  { id: 1, code: "DIWALI2024", discount: "20%", type: "Festival", active: true },
  { id: 2, code: "WELCOME50", discount: "₹500", type: "New User", active: true },
];



export const initialOrders = [
  {
    id: "ORD-7782",
    customer: "Rahul Sharma",
    email: "rahul@gmail.com",
    phone: "+91 98765 43210",
    date: "2025-01-20",
    total: 2499,
    status: "Pending", // Pending, Processing, Shipped, Delivered, Cancelled
    paymentStatus: "Paid", // Paid, Pending (COD), Failed
    paymentMethod: "UPI",
    items: [
      {
        name: "Royal Punjabi Juti",
        size: "8",
        price: 2499,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=100&auto=format&fit=crop",
      },
    ],
    address: "B-12, Sector 62, Noida, Uttar Pradesh, 201301",
    awb: null,
  },
  {
    id: "ORD-7783",
    customer: "Priya Singh",
    email: "priya.s@yahoo.com",
    phone: "+91 99887 76655",
    date: "2025-01-19",
    total: 1299,
    status: "Processing",
    paymentStatus: "Pending", // COD
    paymentMethod: "COD",
    items: [
      {
        name: "Tan Leather Mojari",
        size: "6",
        price: 1299,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=100&auto=format&fit=crop",
      },
    ],
    address: "Flat 404, Galaxy Apartments, Mumbai, Maharashtra, 400001",
    awb: null,
  },
  {
    id: "ORD-7784",
    customer: "Amit Verma",
    email: "amit.v@gmail.com",
    phone: "+91 88776 65544",
    date: "2025-01-18",
    total: 4200,
    status: "Shipped",
    paymentStatus: "Paid",
    paymentMethod: "Card",
    items: [
      {
        name: "Velvet Black Juti",
        size: "9",
        price: 2100,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=100&auto=format&fit=crop",
      },
    ],
    address: "155, Civil Lines, Jaipur, Rajasthan, 302006",
    awb: "SR-987654321", // Simulated Shiprocket AWB
  },
];





export const initialCustomers = [
  {
    id: "CUST-001",
    name: "Anjali Gupta",
    email: "anjali.g@gmail.com",
    phone: "+91 98765 43210",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    status: "Active", // Active, Blocked
    totalOrders: 12,
    totalSpent: 15400,
    joinedDate: "2024-08-15",
    // History for the modal
    history: [
      { id: "ORD-7782", date: "2025-01-20", total: 2499, status: "Delivered" },
      { id: "ORD-7701", date: "2024-12-10", total: 1299, status: "Delivered" }
    ]
  },
  {
    id: "CUST-002",
    name: "Rajesh Kumar",
    email: "rajesh.k@yahoo.com",
    phone: "+91 88776 65544",
    avatar: null, // No image
    status: "Active",
    totalOrders: 3,
    totalSpent: 4200,
    joinedDate: "2024-11-02",
    history: [
      { id: "ORD-7784", date: "2025-01-18", total: 4200, status: "Shipped" }
    ]
  },
  {
    id: "CUST-003",
    name: "Spam Bot",
    email: "bot123@fake.com",
    phone: "+91 00000 00000",
    avatar: null,
    status: "Blocked",
    totalOrders: 0,
    totalSpent: 0,
    joinedDate: "2025-01-21",
    history: []
  }
];