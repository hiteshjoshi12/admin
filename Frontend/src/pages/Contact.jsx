import { useEffect, useState } from 'react';
import { Mail, Clock, Instagram, MessageCircle, ArrowRight, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../util/config'; // Ensure you have this config

export default function Contact() {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formStatus, setFormStatus] = useState('idle'); // idle, submitting, success
  
  // 1. State for form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Order Inquiry', // Default value
    message: ''
  });

  // 2. Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');

    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '', subject: 'Order Inquiry', message: '' }); // Reset form
        toast.success("Message sent successfully!");
      } else {
        setFormStatus('idle');
        toast.error(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error(error);
      setFormStatus('idle');
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <div className="bg-[#F9F8F6] min-h-screen pt-24 pb-24">
      
      {/* --- PAGE HEADER --- */}
      <div className="text-center mb-16 px-6 mt-10">
        <span className="text-[#FF2865] text-xs font-bold uppercase tracking-[0.3em] mb-4 block animate-fade-up">
          Support
        </span>
        <h1 className="text-4xl md:text-6xl font-serif text-[#1C1917] mb-6 animate-fade-up delay-100">
          Get in <span className="italic font-light text-[#FF2865]">Touch</span>
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto font-light animate-fade-up delay-200">
          Whether you have a question about sizing, custom orders, or just want to say hello, we are here for you.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* --- LEFT COLUMN: CONTACT INFO --- */}
          <div className="w-full lg:w-1/3 space-y-8 animate-fade-up delay-300">
            <ContactCard 
              icon={Mail}
              title="Email Us"
              desc="For orders & collaborations"
              value="connect@beadsandbloom.in" // Updated to match request
              link="mailto:connect@beadsandbloom.in"
            />

            <ContactCard 
              icon={Clock}
              title="Support Hours"
              desc="Mon - Sat"
              value="10:00 AM - 7:00 PM IST"
            />

            {/* Social Buttons */}
            <div className="pt-8">
              <h3 className="font-serif text-lg text-[#1C1917] mb-4">Connect Directly</h3>
              <div className="flex gap-4">
                <a 
                  href="https://instagram.com/beadsnbloom.india" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white py-4 px-6 rounded-xl flex items-center justify-center gap-3 hover:shadow-lg transition-all duration-300"
                >
                  <Instagram className="w-5 h-5" />
                  <span className="font-bold text-sm tracking-widest uppercase">Instagram</span>
                </a>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: THE FORM --- */}
          <div className="w-full lg:w-2/3 animate-fade-up delay-500">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
              
              {/* Form Success Overlay */}
              {formStatus === 'success' ? (
                <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center text-center p-8 animate-fade-up">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                    <MessageCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-serif text-[#1C1917] mb-4">Message Sent!</h3>
                  <p className="text-gray-500 mb-8">Thank you for reaching out. We will get back to you shortly at {formData.email}.</p>
                  <button 
                    onClick={() => setFormStatus('idle')}
                    className="text-[#FF2865] font-bold uppercase tracking-widest text-xs border-b border-[#FF2865] pb-1"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Your Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required 
                      className="w-full bg-[#F9F8F6] border-0 rounded-xl px-5 py-4 text-[#1C1917] focus:ring-2 focus:ring-[#FF2865]/20 focus:bg-white transition-all outline-none" 
                      placeholder="Full Name" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required 
                      className="w-full bg-[#F9F8F6] border-0 rounded-xl px-5 py-4 text-[#1C1917] focus:ring-2 focus:ring-[#FF2865]/20 focus:bg-white transition-all outline-none" 
                      placeholder="FullName@example.com" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Subject</label>
                  <select 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-[#F9F8F6] border-0 rounded-xl px-5 py-4 text-[#1C1917] focus:ring-2 focus:ring-[#FF2865]/20 focus:bg-white transition-all outline-none appearance-none"
                  >
                    <option value="Order Inquiry">Order Inquiry</option>
                    <option value="Sizing Help">Sizing Help</option>
                    <option value="Custom Request">Custom Request</option>
                    <option value="Collaboration">Collaboration</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Message</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required 
                    rows="5" 
                    className="w-full bg-[#F9F8F6] border-0 rounded-xl px-5 py-4 text-[#1C1917] focus:ring-2 focus:ring-[#FF2865]/20 focus:bg-white transition-all outline-none" 
                    placeholder="How can we help you today?"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={formStatus === 'submitting'}
                  className="w-full bg-[#1C1917] text-white py-5 rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-[#FF2865] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {formStatus === 'submitting' ? (
                    <span className="flex items-center gap-2">Sending...</span>
                  ) : (
                    <>Send Message <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>

              </form>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

// Helper Component for Info Cards
function ContactCard({ icon: Icon, title, desc, value, link }) {
  const Content = () => (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-start gap-5 hover:shadow-md transition-all duration-300 group">
      <div className="w-12 h-12 rounded-full bg-[#FF2865]/5 text-[#FF2865] flex items-center justify-center group-hover:bg-[#FF2865] group-hover:text-white transition-all duration-300">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-serif text-lg text-[#1C1917]">{title}</h3>
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{desc}</p>
        <p className="text-[#1C1917] font-medium text-sm md:text-base break-all">{value}</p>
      </div>
    </div>
  );

  return link ? <a href={link} className="block">{Content()}</a> : Content();
}