// import { ShoppingBag, Search, Menu, X } from 'lucide-react'; // Added Menu, X
// import { Link } from 'react-router-dom';
// import { useEffect, useState } from 'react';

// export default function Navbar() {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // New State

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 50);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Lock body scroll when menu is open
//   useEffect(() => {
//     if (isMobileMenuOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'auto';
//     }
//   }, [isMobileMenuOpen]);

//   return (
//     <>
//       <div 
//         className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-in-out ${
//           isScrolled ? 'pt-0 px-0' : 'pt-6 px-4'
//         }`}
//       >
//         <nav 
//           className={`bg-white flex items-center justify-between transition-all duration-500 ease-in-out ${
//             isScrolled 
//               ? 'w-full max-w-full rounded-none px-6 md:px-10 py-4 shadow-md' 
//               : 'w-full max-w-[1300px] rounded-full px-6 md:px-8 py-4 shadow-2xl animate-fade-up' 
//           }`}
//         >
          
//           {/* LEFT: Brand */}
//           <Link to="/" className="flex flex-col group z-50 relative" onClick={() => setIsMobileMenuOpen(false)}>
//             <span className="font-serif text-xl font-bold tracking-wide text-brand-black leading-none group-hover:text-gray-600 transition-colors">
//               BEADS & BLOOM
//             </span>
//             <span className="text-[0.6rem] font-sans text-gray-400 tracking-[0.25em] uppercase mt-1">
//               Handcrafted Luxury
//             </span>
//           </Link>

//           {/* CENTER: Desktop Links (Hidden on Mobile) */}
//           <div className="hidden md:flex items-center gap-10">
//             {['New Arrivals', 'Bridal', 'Mules', 'Journal'].map((item) => (
//               <Link 
//                 key={item} 
//                 to="/shop" 
//                 className="text-xs font-medium uppercase tracking-widest text-gray-600 hover:text-black transition-colors relative group"
//               >
//                 {item}
//                 <span className="absolute -bottom-1 left-1/2 w-0 h-[1px] bg-black group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
//               </Link>
//             ))}
//           </div>

//           {/* RIGHT: Icons */}
//           <div className="flex items-center gap-3 md:gap-5 z-50 relative">
//             <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:block">
//               <Search className="w-5 h-5 text-gray-700" />
//             </button>
            
//             <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group">
//               <ShoppingBag className="w-5 h-5 text-gray-700" />
//               <span className="absolute top-2 right-1 h-2 w-2 bg-black rounded-full border-2 border-white group-hover:scale-110 transition-transform"></span>
//             </button>

//             {/* MOBILE TOGGLE BUTTON (Visible only on Mobile) */}
//             <button 
//               className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//             >
//               {isMobileMenuOpen ? (
//                 <X className="w-6 h-6 text-brand-black" />
//               ) : (
//                 <Menu className="w-6 h-6 text-brand-black" />
//               )}
//             </button>
//           </div>

//         </nav>
//       </div>

//       {/* MOBILE MENU OVERLAY */}
//       <div 
//         className={`fixed inset-0 z-40 bg-white flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
//           isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
//         }`}
//       >
//         <div className="flex flex-col items-center gap-8">
//           {['New Arrivals', 'Bridal', 'Mules', 'Journal'].map((item, index) => (
//             <Link 
//               key={item} 
//               to="/shop" 
//               onClick={() => setIsMobileMenuOpen(false)}
//               className={`text-2xl font-serif text-brand-black hover:text-brand-gold transition-colors duration-300 transform ${
//                 isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
//               }`}
//               style={{ transitionDelay: `${index * 100}ms` }}
//             >
//               {item}
//             </Link>
//           ))}
          
//           <div className="w-12 h-[1px] bg-gray-200 my-4"></div>
          
//           <Link to="/search" className="text-sm font-sans uppercase tracking-widest text-gray-500">
//             Search
//           </Link>
//           <Link to="/account" className="text-sm font-sans uppercase tracking-widest text-gray-500">
//             My Account
//           </Link>
//         </div>
//       </div>
//     </>
//   );
// }


import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <div 
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-in-out ${
          isScrolled ? 'pt-0 px-0' : 'pt-6 px-4'
        }`}
      >
        <nav 
          className={`bg-white flex items-center justify-between transition-all duration-500 ease-in-out ${
            isScrolled 
              ? 'w-full max-w-full rounded-none px-6 md:px-10 py-4 shadow-md' 
              : 'w-full max-w-[1300px] rounded-full px-6 md:px-8 py-4 shadow-2xl animate-fade-up' 
          }`}
        >
          
          {/* LEFT: Brand */}
          <Link to="/" className="flex flex-col group z-50 relative" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="font-serif text-xl font-bold tracking-wide text-brand-black leading-none group-hover:text-gray-600 transition-colors">
              BEADS & BLOOM
            </span>
            <span className="text-[0.6rem] font-sans text-gray-400 tracking-[0.25em] uppercase mt-1">
              Handcrafted Luxury
            </span>
          </Link>

          {/* CENTER: Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            {['New Arrivals', 'Bridal', 'Mules', 'Journal'].map((item) => (
              <Link 
                key={item} 
                to="/shop" 
                className="text-xs font-medium uppercase tracking-widest text-gray-600 hover:text-black transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-1/2 w-0 h-[1px] bg-black group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* RIGHT: Auth & Icons */}
          <div className="flex items-center gap-3 md:gap-5 z-50 relative">

            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group">
              <ShoppingBag className="w-5 h-5 text-gray-700" />
              <span className="absolute top-2 right-1 h-2 w-2 bg-black rounded-full border-2 border-white group-hover:scale-110 transition-transform"></span>
            </button>
            
            {/* DESKTOP AUTH BUTTONS (Hidden on Mobile) */}
            <div className="hidden md:flex items-center gap-4 mr-2 border-r border-gray-200 pr-6">
                <Link 
                  to="/login" 
                  className="text-xs font-medium uppercase tracking-widest text-gray-600 hover:text-black transition-colors"
                >
                  Log In
                </Link>
                <Link 
                  to="/signup" 
                  className="text-xs font-medium uppercase tracking-widest bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-all hover:scale-105"
                >
                  Sign Up
                </Link>
            </div>

           
            
            

            {/* MOBILE TOGGLE BUTTON */}
            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-brand-black" />
              ) : (
                <Menu className="w-6 h-6 text-brand-black" />
              )}
            </button>
          </div>

        </nav>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div 
        className={`fixed inset-0 z-40 bg-white flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center gap-6 w-full max-w-xs">
          {/* Mobile Nav Links */}
          {['New Arrivals', 'Bridal', 'Mules', 'Journal'].map((item, index) => (
            <Link 
              key={item} 
              to="/shop" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-2xl font-serif text-brand-black hover:text-brand-gold transition-colors duration-300 transform ${
                isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {item}
            </Link>
          ))}
          
          <div className="w-12 h-[1px] bg-gray-200 my-4"></div>

          {/* MOBILE AUTH BUTTONS */}
          <div className={`flex flex-col gap-3 w-full transition-all duration-500 delay-300 ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Link 
              to="/login" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-3 border border-gray-300 rounded-full text-sm font-sans uppercase tracking-widest text-gray-700 hover:border-black hover:text-black transition-colors"
            >
              Log In
            </Link>
            <Link 
              to="/signup" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-3 bg-black text-white rounded-full text-sm font-sans uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}