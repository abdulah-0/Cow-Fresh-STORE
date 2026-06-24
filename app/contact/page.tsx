"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Product Inquiry",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required.";
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Invalid email format.";
    }
    if (!formData.phone.trim()) {
      tempErrors.phone = "Phone number is required.";
    } else if (!/^[0-9+\s-]{8,15}$/.test(formData.phone)) {
      tempErrors.phone = "Invalid phone format.";
    }
    if (!formData.message.trim()) tempErrors.message = "Message is required.";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call to submit inquiry
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Save contact submission locally for mock tracking
      if (typeof window !== "undefined") {
        const existing = localStorage.getItem("cow_fresh_inquiries");
        const inquiries = existing ? JSON.parse(existing) : [];
        inquiries.push({
          id: Math.random().toString(36).substring(2, 9),
          ...formData,
          submitted_at: new Date().toISOString()
        });
        localStorage.setItem("cow_fresh_inquiries", JSON.stringify(inquiries));
      }
    }, 1200);
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", phone: "", subject: "Product Inquiry", message: "" });
    setIsSuccess(false);
  };

  // Pre-filled WhatsApp link
  const whatsAppNumber = "923001234567";
  const whatsAppText = encodeURIComponent("Hi Cow Fresh! I would like to inquire about your farm-fresh dairy products.");
  const whatsAppLink = `https://wa.me/${whatsAppNumber}?text=${whatsAppText}`;

  return (
    <main className="container mx-auto px-4 py-12 md:py-16 bg-cf-off-white">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-cf-green font-bold text-xs tracking-widest uppercase mb-2 block">Support & Sales</span>
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-cf-navy tracking-tight mb-3">
            Contact Cow Fresh
          </h1>
          <p className="text-cf-charcoal/70 text-sm md:text-base">
            Have a question about our milking process, delivery slots, or custom orders? Reach out via our form, WhatsApp, or email.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          
          {/* Left: Contact info cards (2 Cols) */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Quick Details Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-cf-sky/15 shadow-sm space-y-6">
              <h2 className="text-xl font-bold font-heading text-cf-navy">Get In Touch</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-cf-green/10 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                    📞
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-cf-navy">Phone Support</h3>
                    <p className="text-xs text-cf-charcoal/60 mt-0.5">+92 300 1234567</p>
                    <p className="text-[10px] text-cf-charcoal/40">Mon-Sat: 9:00 AM - 8:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-cf-sky/20 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                    📧
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-cf-navy">Email Inquiries</h3>
                    <p className="text-xs text-cf-charcoal/60 mt-0.5">hello@cowfresh.pk</p>
                    <p className="text-[10px] text-cf-charcoal/40">Response within 2 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-cf-navy/10 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                    📍
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-cf-navy">Distribution Center</h3>
                    <p className="text-xs text-cf-charcoal/60 mt-0.5">Plot 45-B, Sector V, DHA</p>
                    <p className="text-[10px] text-cf-charcoal/40">Lahore, Pakistan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Integration Card */}
            <div className="bg-gradient-to-br from-cf-navy to-[#000d2d] text-white rounded-3xl p-6 md:p-8 shadow-md space-y-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(69,197,23,0.25),transparent_50%)] pointer-events-none" />
              <h2 className="text-xl font-bold font-heading text-white">Instant WhatsApp Chat</h2>
              <p className="text-xs text-cf-sky/80 leading-relaxed">
                Want to place a quick order or ask a question directly? Chat with our team on WhatsApp for near-instant answers.
              </p>
              
              <a
                href={whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 text-sm"
              >
                {/* Custom WhatsApp SVG */}
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.59 1.97 14.122.946 11.5.946c-5.438 0-9.863 4.372-9.867 9.8.001 1.73.483 3.415 1.397 4.887l-.908 3.321 3.486-.921zM17.15 14.39c-.295-.149-1.75-.865-2.02-.964-.27-.099-.468-.149-.665.149-.197.297-.765.964-.938 1.162-.173.199-.347.223-.642.075-.295-.149-1.248-.46-2.378-1.472-.88-.786-1.474-1.756-1.647-2.054-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.665-1.608-.912-2.202-.24-.577-.482-.499-.665-.508-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.79.371-.27.297-1.03.101-1.03 2.527 0 2.426 1.766 4.767 2.01 5.09.244.323 3.482 5.322 8.434 7.464 1.178.508 2.098.812 2.816 1.04.183.376.549.324 1.1.244.693-.104 1.75-.716 1.996-1.409.247-.693.247-1.288.173-1.409-.074-.124-.27-.198-.567-.347z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>

          </div>

          {/* Right: Contact Form (3 Cols) */}
          <div className="md:col-span-3 bg-white rounded-3xl p-6 md:p-8 border border-cf-sky/15 shadow-sm">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <h2 className="text-xl font-bold font-heading text-cf-navy mb-2">Send Us a Message</h2>
                  
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-cf-navy uppercase tracking-wider mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-cf-off-white border rounded-xl text-sm text-cf-navy placeholder-cf-charcoal/30 focus:outline-none focus:ring-2 focus:ring-cf-green transition-all ${
                        errors.name ? "border-red-500" : "border-cf-sky/30"
                      }`}
                      placeholder="e.g. Abdullah Khan"
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-cf-navy uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-cf-off-white border rounded-xl text-sm text-cf-navy placeholder-cf-charcoal/30 focus:outline-none focus:ring-2 focus:ring-cf-green transition-all ${
                          errors.email ? "border-red-500" : "border-cf-sky/30"
                        }`}
                        placeholder="e.g. abdullah@gmail.com"
                      />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold text-cf-navy uppercase tracking-wider mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-cf-off-white border rounded-xl text-sm text-cf-navy placeholder-cf-charcoal/30 focus:outline-none focus:ring-2 focus:ring-cf-green transition-all ${
                          errors.phone ? "border-red-500" : "border-cf-sky/30"
                        }`}
                        placeholder="e.g. 03001234567"
                      />
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-bold text-cf-navy uppercase tracking-wider mb-1.5">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-cf-off-white border border-cf-sky/30 rounded-xl text-sm text-cf-navy focus:outline-none focus:ring-2 focus:ring-cf-green transition-all"
                    >
                      <option value="Product Inquiry">Product Inquiry</option>
                      <option value="Delivery Question">Delivery Question</option>
                      <option value="Business Partnership">Business Partnership</option>
                      <option value="Feedback / Complaint">Feedback / Complaint</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-cf-navy uppercase tracking-wider mb-1.5">
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-cf-off-white border rounded-xl text-sm text-cf-navy placeholder-cf-charcoal/30 focus:outline-none focus:ring-2 focus:ring-cf-green transition-all ${
                        errors.message ? "border-red-500" : "border-cf-sky/30"
                      }`}
                      placeholder="Write your message here..."
                    />
                    {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-cf-green hover:bg-cf-green/90 text-white font-bold py-4 rounded-xl shadow-md transition-all text-sm hover:scale-[1.01] flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending Message...
                      </>
                    ) : (
                      "Submit Inquiry"
                    )}
                  </button>

                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-10 space-y-6"
                >
                  <div className="w-16 h-16 bg-cf-green/10 text-cf-green rounded-full flex items-center justify-center text-3xl mx-auto border-2 border-cf-green/20 shadow-inner">
                    ✓
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold font-heading text-cf-navy">Message Sent!</h2>
                    <p className="text-sm text-cf-charcoal/70 max-w-md mx-auto leading-relaxed">
                      Thank you for contacting Cow Fresh, <strong>{formData.name}</strong>. Your inquiry has been received. Our team will get back to you shortly.
                    </p>
                  </div>
                  
                  <div className="bg-cf-off-white p-5 rounded-2xl border border-cf-sky/20 text-left max-w-md mx-auto text-xs space-y-1.5 text-cf-charcoal/70">
                    <p><strong>Subject:</strong> {formData.subject}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Phone:</strong> {formData.phone}</p>
                  </div>

                  <button
                    onClick={handleReset}
                    className="bg-cf-navy hover:bg-cf-navy/90 text-white font-bold py-3 px-8 rounded-full transition-all text-xs"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </main>
  );
}