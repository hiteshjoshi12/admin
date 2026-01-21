import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2500&auto=format&fit=crop" 
          alt="Luxury Shoe Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4 pt-20">
        
        <p className="animate-fade-up text-xs md:text-sm font-sans tracking-[0.3em] uppercase mb-4 text-white/90">
          The Wedding Edit '26
        </p>

        <h1 className="animate-fade-up delay-100 text-6xl md:text-8xl lg:text-9xl font-serif leading-[0.9] mb-8 drop-shadow-lg">
          Handcrafted <br />
          <span className="italic font-light">Perfection</span>
        </h1>

        <Link 
          to="/shop" 
          className="animate-fade-up delay-200 mt-8 bg-white text-black px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300"
        >
          Shop The Collection
        </Link>
      </div>

      {/* Scroll Indicator */}
      <div className="animate-fade-up delay-300 absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-80">
        <span className="text-[10px] uppercase tracking-widest text-white">Scroll</span>
        <div className="w-[1px] h-12 bg-white/50"></div>
      </div>

    </section>
  );
}