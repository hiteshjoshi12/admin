import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const collections = [
  { 
    id: 1, 
    name: "The Bridal Edit", 
    count: "12 Designs",
    // Added w_600 to resize for card layout
    img: "https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071597/IMG_0279_l2cibn.jpg" 
  },
  { 
    id: 2, 
    name: "Everyday Mules", 
    count: "24 Designs",
    img: "https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071706/IMG_0705_odxdlw.jpg" 
  },
  { 
    id: 3, 
    name: "Luxury Potlis", 
    count: "8 Designs",
    img: "https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071749/IMG_0336_bqm5ue.jpg" 
  }
];

export default function CollectionTiles() {
  return (
    <section className="py-24 px-4 md:px-12 max-w-[1440px] mx-auto">
      
      {/* FIX 1: Changed to 'flex-col md:flex-row' to stack items on mobile 
          FIX 2: Added 'gap-6' for spacing on mobile
      */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 px-2 gap-6 md:gap-0">
        <div>
          <h2 className="text-4xl md:text-5xl font-serif text-brand-black mb-2">
            Curated Collections
          </h2>
          <p className="text-sm font-sans text-gray-500 tracking-wide">
            Handpicked favorites for every occasion.
          </p>
        </div>
        
        {/* FIX 3: Removed 'hidden' class so it is visible on all screens */}
        <Link 
          to="/shop" 
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-gray-500 transition-colors"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {collections.map((col) => (
          <Link 
            to="/shop" 
            key={col.id} 
            className="group cursor-pointer"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-t-[12rem] bg-gray-200 shadow-md">
              <img 
                src={col.img} 
                alt={col.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            <div className="text-center mt-6">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1 block">
                {col.count}
              </span>
              <h3 className="text-2xl font-serif text-brand-black group-hover:text-gray-600 transition-colors">
                {col.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>

    </section>
  );
}