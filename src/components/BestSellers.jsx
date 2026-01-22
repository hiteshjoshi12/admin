import { ArrowUpRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const products = [
  { 
    id: 1, 
    tag: "The Icon",
    name: "Zardosi Bridal Mule", 
    price: "₹4,200", 
    // Added: w_500 (resize), f_auto, q_auto
    img: "https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_500/v1769075057/IMG_1050_bt6gdf.jpg",
  },
  { 
    id: 2, 
    tag: "Trending Now",
    name: "Rani Pink Potli", 
    price: "₹2,899", 
    img: "https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_500/v1769075143/IMG_0972_1_gzc9om.jpg",
  },
  { 
    id: 3, 
    tag: "Everyday Luxury",
    name: "Gold Thread Wedge", 
    price: "₹3,100", 
    img: "https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_500/v1769075245/IMG_9775_mebgcp.jpg",
  },
];

export default function BestSellers() {
  
  // Reusable Overlay Component to ensure consistency
 // Reusable Overlay Component
  const QuickAddOverlay = () => (
    <div className="
      absolute inset-0 
      z-20 flex items-end justify-center pb-8 
      transition-opacity duration-300
      
      /* MOBILE: Always visible, slight dark overlay */
      bg-black/10 opacity-100 

      /* DESKTOP: Hidden by default, visible on hover */
      md:opacity-0 md:group-hover:opacity-100
    ">
      <button className="
        bg-white text-brand-black 
        px-6 py-3 rounded-full 
        text-xs uppercase tracking-widest font-bold 
        flex items-center gap-2 
        shadow-xl transition-all duration-500 ease-out
        hover:bg-brand-gold hover:text-white

        /* MOBILE: Always in final position */
        translate-y-0

        /* DESKTOP: Slides up on hover */
        md:translate-y-4 md:group-hover:translate-y-0
      ">
        <ShoppingBag className="w-4 h-4"/> Quick Add
      </button>
    </div>
  );

  return (
    <section className="py-24 px-4 md:px-12 bg-white relative overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] border-[20px] border-brand-gold/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-2 block">
              Curated Favorites
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-brand-black leading-none">
              The Best Sellers
            </h2>
          </div>
          <Link 
            to="/shop" 
            className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-brand-gold hover:border-brand-gold transition-colors mt-6 md:mt-0"
          >
            Shop All Icons <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* The Geometric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* PRODUCT 1: The Hero Arch */}
          <div className="md:col-span-5 relative group cursor-pointer">
            <span className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-brand-black text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
              {products[0].tag}
            </span>
            
            {/* Shape Container */}
            <div className="relative h-[600px] rounded-t-[15rem] overflow-hidden bg-[#F9F8F6] border-2 border-transparent group-hover:border-brand-gold/20 transition-all duration-500">
              <img src={products[0].img} alt={products[0].name} className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105" />
              
              {/* Added Overlay Here */}
              <QuickAddOverlay />
            </div>

            <div className="text-center mt-6">
              <h3 className="text-2xl font-serif">{products[0].name}</h3>
              <p className="text-gray-500 mt-1">{products[0].price}</p>
            </div>
          </div>

          {/* Right Side Container */}
          <div className="md:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8 relative">
             
             {/* PRODUCT 2: The Pebble */}
             <div className="relative group cursor-pointer md:-ml-12 md:mt-12 z-10">
                <span className="absolute top-4 right-4 z-30 bg-brand-gold text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                  {products[1].tag}
                </span>
                
                {/* Shape Container */}
                <div className="relative h-[350px] rounded-[4rem] overflow-hidden bg-[#F9F8F6] shadow-xl group-hover:shadow-2xl transition-shadow">
                   <img src={products[1].img} alt={products[1].name} className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105" />
                   
                   {/* Added Overlay Here */}
                   <QuickAddOverlay />
                </div>

                <div className="text-left mt-4 ml-4">
                  <h3 className="text-xl font-serif">{products[1].name}</h3>
                  <p className="text-gray-500">{products[1].price}</p>
                </div>
             </div>

             {/* PRODUCT 3: The Short Arch */}
             <div className="relative group cursor-pointer md:mt-32">
                <span className="absolute top-4 left-4 z-30 bg-white/90 backdrop-blur text-brand-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                  {products[2].tag}
                </span>
                
                {/* Shape Container */}
                <div className="relative h-[400px] rounded-t-[10rem] overflow-hidden bg-[#F9F8F6] border-2 border-transparent group-hover:border-brand-gold/20 transition-all">
                   <img src={products[2].img} alt={products[2].name} className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105" />
                   
                   {/* Added Overlay Here */}
                   <QuickAddOverlay />
                </div>

                <div className="text-center mt-4">
                  <h3 className="text-xl font-serif">{products[2].name}</h3>
                  <p className="text-gray-500">{products[2].price}</p>
                </div>
             </div>

          </div>

        </div>
      </div>
    </section>
  );
}