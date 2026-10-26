import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, FileText, Database, Users, HelpCircle } from 'lucide-react';
import SEO from '../components/seo/SEO';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-24 pb-20 text-[#1C1917]">
      <SEO
        title="Privacy Policy | Beads and Bloom"
        description="Read the official privacy policy of Beads and Bloom covering data collection, third-party processing, cookies, and consumer data rights."
        canonical="/privacy-policy"
      />

      {/* Hero Header */}
      <div className="max-w-4xl mx-auto px-6 mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1917]/5 text-xs font-semibold tracking-widest uppercase mb-4">
          <Shield className="w-3.5 h-3.5 text-[#FD61A7]" />
          <span>Legal & Transparency</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif text-[#1C1917] mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          At Beads and Bloom, we are committed to respecting your privacy and safeguarding your personal information. This policy outlines how your data is collected, handled, and protected.
        </p>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-4xl mx-auto px-6 space-y-8">
        
        {/* 1. Information Collected */}
        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <Database className="w-5 h-5 text-[#FD61A7]" />
            <h2 className="text-xl font-serif text-[#1C1917]">1. Information & Data Collected</h2>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            We collect personal information necessary to provide products, fulfill orders, and offer customer support. This may include:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
            <li>Contact details such as name, email address, phone number, and delivery address.</li>
            <li>Order and transaction history (items purchased, payment method selected).</li>
            <li>Technical device information, IP address, and browser characteristics during site navigation.</li>
          </ul>
        </section>

        {/* 2. Third-Party Service Providers */}
        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <Users className="w-5 h-5 text-[#FD61A7]" />
            <h2 className="text-xl font-serif text-[#1C1917]">2. Third-Party Service Providers</h2>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            We share required data with verified third-party partners solely to operate our store and deliver your orders:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
            <li><strong>Payment Gateways:</strong> Razorpay handles secure online payment transactions. Card or banking credentials are not stored on our servers.</li>
            <li><strong>Logistics & Couriers:</strong> Shiprocket and authorized courier partners receive recipient names, addresses, and phone numbers to facilitate parcel delivery.</li>
            <li><strong>Analytics & Advertising:</strong> Google Analytics and Meta Pixel process aggregated browsing events to improve user experience and evaluate marketing performance.</li>
          </ul>
        </section>

        {/* 3. Cookies & Tracking Technologies */}
        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <FileText className="w-5 h-5 text-[#FD61A7]" />
            <h2 className="text-xl font-serif text-[#1C1917]">3. Cookies & Tracking Technologies</h2>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Our website uses cookies and standard web technologies to maintain shopping cart sessions, authenticate account logins, and analyze anonymous site traffic. You may modify your browser settings to decline cookies, though certain shopping features may require them to function properly.
          </p>
        </section>

        {/* 4. Data Retention Policy */}
        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <Lock className="w-5 h-5 text-[#FD61A7]" />
            <h2 className="text-xl font-serif text-[#1C1917]">4. Data Retention Policy</h2>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Customer order records and profile data are retained for the duration necessary to satisfy order fulfillment, tax compliance, dispute resolution, and regulatory requirements under applicable laws.
          </p>
        </section>

        {/* 5. User Rights & Data Deletion */}
        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <Shield className="w-5 h-5 text-[#FD61A7]" />
            <h2 className="text-xl font-serif text-[#1C1917]">5. User Rights & Data Requests</h2>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            You may request access to, correction of, or deletion of your personal data by contacting our team. Requests are processed in accordance with the Digital Personal Data Protection Act and relevant data privacy guidelines.
          </p>
        </section>

        {/* 6. Grievance Officer & Contact */}
        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <HelpCircle className="w-5 h-5 text-[#FD61A7]" />
            <h2 className="text-xl font-serif text-[#1C1917]">6. Grievance Officer & Contact Information</h2>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            For questions, grievances, or legal inquiries regarding our privacy practices, please contact:
          </p>
          <div className="bg-gray-50 p-4 rounded-xl text-sm space-y-1 text-gray-700">
            <p><strong>Grievance Officer:</strong> Beads and Bloom Legal & Compliance</p>
            <p><strong>Email:</strong> <a href="mailto:connect@beadsandbloom.in" className="text-[#FD61A7] hover:underline">connect@beadsandbloom.in</a></p>
            <p><strong>Response Timeline:</strong> Within 48 business hours</p>
          </div>
        </section>

      </div>
    </div>
  );
}
