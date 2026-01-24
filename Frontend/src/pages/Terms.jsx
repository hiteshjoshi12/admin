import { useState, useEffect } from 'react';
import { ScrollText, Truck, RefreshCcw, Shield, Mail, AlertCircle } from 'lucide-react';

export default function Terms() {
  const [activeTab, setActiveTab] = useState('terms');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      id: 'terms',
      label: 'Terms & Conditions',
      icon: ScrollText,
      content: (
        <div className="space-y-8 animate-fade-up">
          <SectionBlock title="1. General">
            <p>Beads & Bloom reserves the right to update, modify, or replace any part of these Terms & Conditions at any time without prior notice. Continued use of the website or purchase of products constitutes acceptance of any changes.</p>
          </SectionBlock>

          <SectionBlock title="2. Product Information">
            <p>All product descriptions, images, and specifications are provided for reference purposes only. Slight variations in color, design, size, or finish may occur due to photography, lighting conditions, handcrafted nature of products, or individual screen settings. Such variations are not considered defects.</p>
          </SectionBlock>

          <SectionBlock title="3. Pricing">
            <p>All prices are listed in INR and include applicable taxes unless stated otherwise. Prices are subject to change without prior notice. Any pricing errors may result in order cancellation.</p>
          </SectionBlock>

          <SectionBlock title="4. Order Acceptance">
            <p>An order is considered confirmed only after successful payment and receipt of an order confirmation from Beads & Bloom. The brand reserves the right to cancel or refuse any order due to stock unavailability, pricing errors, suspected fraud, or operational issues.</p>
          </SectionBlock>

          <SectionBlock title="5. Payment">
            <p>Full payment must be made at the time of placing the order. Beads & Bloom is not responsible for payment failures, delays, or errors caused by third-party payment gateways or banks.</p>
          </SectionBlock>

          <SectionBlock title="10. Cancellations">
            <p>Orders may be canceled only before dispatch. Once dispatched, cancellation requests will not be accepted.</p>
          </SectionBlock>

          <SectionBlock title="11. Care & Usage">
            <p>Customers are responsible for proper care and handling of products. Beads & Bloom is not liable for damage resulting from misuse, improper storage, water exposure, chemical contact, or normal wear and tear.</p>
          </SectionBlock>

          <SectionBlock title="12. Intellectual Property">
            <p>All designs, images, logos, content, and branding associated with Beads & Bloom are the intellectual property of the brand and may not be copied, reproduced, or used without prior written permission.</p>
          </SectionBlock>

           <SectionBlock title="13. Limitation of Liability">
            <p>Beads & Bloom shall not be liable for any indirect, incidental, or consequential damages arising from the use of its products or services.</p>
          </SectionBlock>

          <SectionBlock title="14. Governing Law">
            <p>These Terms & Conditions shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in India.</p>
          </SectionBlock>

          <SectionBlock title="15. Force Majeure">
            <p>Beads & Bloom shall not be held liable for delays or failures caused by events beyond reasonable control, including natural disasters, strikes, pandemics, government restrictions, or logistical disruptions.</p>
          </SectionBlock>
        </div>
      )
    },
    {
      id: 'shipping',
      label: 'Shipping Policy',
      icon: Truck,
      content: (
        <div className="space-y-8 animate-fade-up">
           <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="font-serif text-xl mb-4 text-[#1C1917]">Delivery Estimates</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Delivery timelines are estimates and may vary due to courier delays, location constraints, weather conditions, or other unforeseen circumstances. Beads & Bloom is not liable for delays beyond its control.
              </p>
           </div>
           
           <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="font-serif text-xl mb-4 text-[#1C1917]">Shipping Charges</h3>
              <p className="text-gray-600 leading-relaxed">
                Shipping and delivery charges are not included in the product price and will be charged separately based on the delivery location.
              </p>
           </div>
        </div>
      )
    },
    {
      id: 'returns',
      label: 'Returns & Exchange',
      icon: RefreshCcw,
      content: (
        <div className="space-y-8 animate-fade-up">
          
          {/* Important Alert */}
          <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex gap-4 items-start">
            <AlertCircle className="w-6 h-6 text-[#FF2865] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-serif text-lg text-[#FF2865] mb-2">7. Mandatory Unboxing Video</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Customers must record a clear, continuous unboxing video from the moment the package is opened. This video is mandatory for any exchange, damage, or missing-item claims. <strong>Requests without an unboxing video will not be processed.</strong>
              </p>
            </div>
          </div>

          <SectionBlock title="8. Exchanges">
            <p className="mb-4">Exchanges are permitted only for damaged, defective, or incorrect products. Requests must be raised within <strong>48 hours of delivery</strong> and must include:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 ml-2">
              <li>A clear unboxing video</li>
              <li>Images of the product and packaging</li>
            </ul>
            <p className="mt-4">Products must be unused, unworn, and returned in original packaging. Exchange requests will be rejected if these conditions are not met.</p>
          </SectionBlock>

          <SectionBlock title="9. No Refund Policy">
            <p>Beads & Bloom follows a strict <strong>no-refund policy</strong>. Refunds will not be issued under any circumstances, including but not limited to size issues, color preferences, delivery delays, or change of mind.</p>
          </SectionBlock>
        </div>
      )
    },
    {
      id: 'privacy',
      label: 'Privacy Policy',
      icon: Shield,
      content: (
        <div className="space-y-8 animate-fade-up">
          <SectionBlock title="17. Privacy Policy">
            <p>Customer data is collected and handled in accordance with Beads & Bloom’s Privacy Policy. We respect your privacy and are committed to protecting your personal data.</p>
          </SectionBlock>
          
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 text-center">
            <Mail className="w-8 h-8 text-[#FF2865] mx-auto mb-4" />
            <h3 className="font-serif text-xl mb-2">Have Questions?</h3>
            <p className="text-gray-500 mb-6">For queries or support, contact us at:</p>
            <a href="mailto:connect@beadsandbloom.in" className="text-[#FF2865] font-bold text-lg hover:underline">
              connect@beadsandbloom.in
            </a>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-24 pb-24">
      
      {/* Header */}
      <div className="bg-[#F9F8F6] py-16 px-6 mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-serif text-[#1C1917] mb-4">Legal & Support</h1>
        <p className="text-gray-500 uppercase tracking-widest text-xs">Everything you need to know</p>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-1/4 flex-shrink-0">
            <div className="sticky top-32 space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                    activeTab === section.id 
                      ? 'bg-[#FF2865] text-white shadow-lg shadow-pink-200 transform scale-105' 
                      : 'bg-white text-gray-500 hover:bg-gray-50 border border-transparent hover:border-gray-100'
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="w-full md:w-3/4">
             {sections.find(s => s.id === activeTab)?.content}
          </div>

        </div>
      </div>

    </div>
  );
}

// Helper Component for consistent text styling
function SectionBlock({ title, children }) {
  return (
    <div className="border-b border-gray-100 pb-8 last:border-0">
      <h3 className="font-serif text-xl text-[#1C1917] mb-4">{title}</h3>
      <div className="text-gray-600 leading-relaxed font-light">
        {children}
      </div>
    </div>
  );
}