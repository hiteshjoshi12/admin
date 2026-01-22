import { useState } from 'react';
import { MessageCircle, Instagram, Mail, X, MessageSquare } from 'lucide-react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  // Replace these with your actual links
  const contactInfo = {
    whatsapp: "https://wa.me/919599766993", // Add your phone number here (e.g., 919876543210)
    instagram: "https://instagram.com/beadsnbloom.india",
    email: "mailto:hello@beadsandbloom.com"
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* THE CHAT CARD (Hidden by default) */}
      <div 
        className={`
          mb-4 w-[320px] bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right
          border border-gray-100
          ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-10 pointer-events-none'}
        `}
      >
        {/* Header - The "Hot Pink" Brand Color */}
        <div className="bg-[#FF2865] p-6 text-white">
          <h3 className="text-xl font-serif font-medium mb-1">Hi there! 👋</h3>
          <p className="text-xs text-white/90 font-sans tracking-wide">
            We usually reply within a few minutes.
          </p>
        </div>

        {/* Options List */}
        <div className="p-4 flex flex-col gap-3 bg-gray-50">
          
          {/* WhatsApp Button */}
          <a 
            href={contactInfo.whatsapp} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#FF2865]/30 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
                <MessageSquare className="w-5 h-5 fill-current" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">WhatsApp</p>
                <p className="text-[10px] text-gray-500">Chat with our stylist</p>
              </div>
            </div>
            <div className="text-gray-300 group-hover:text-[#FF2865] transition-colors">
               <svg className="w-5 h-5 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>
          </a>

          {/* Instagram Button */}
          <a 
            href={contactInfo.instagram}
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#FF2865]/30 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-[#C13584]">
                <Instagram className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Instagram</p>
                <p className="text-[10px] text-gray-500">DM us for collabs</p>
              </div>
            </div>
             <div className="text-gray-300 group-hover:text-[#FF2865] transition-colors">
               <svg className="w-5 h-5 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>
          </a>

          {/* Email / Generic Button */}
          <a 
            href={contactInfo.email}
            className="group flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#FF2865]/30 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Email Us</p>
                <p className="text-[10px] text-gray-500">For order inquiries</p>
              </div>
            </div>
             <div className="text-gray-300 group-hover:text-[#FF2865] transition-colors">
               <svg className="w-5 h-5 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>
          </a>

        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-2 text-center border-t border-gray-100">
          <p className="text-[9px] text-gray-400 uppercase tracking-widest">Powered by Beads & Bloom</p>
        </div>
      </div>

      {/* THE TOGGLE BUTTON (Floating Action Button) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300
          ${isOpen ? 'bg-white text-[#FF2865] rotate-90' : 'bg-[#FF2865] text-white hover:scale-110'}
        `}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6" />
            {/* Notification Dot */}
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400 border-2 border-[#FF2865]"></span>
            </span>
          </>
        )}
      </button>

    </div>
  );
}