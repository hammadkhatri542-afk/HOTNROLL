import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#F5F1EB] border-t border-[#EAE4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C8351B] mb-2">
            <span>Find Us & Say Hello</span>
            <span aria-hidden="true" className="text-[#181615]/30">·</span>
            <span>Ember District Kitchen</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#181615] tracking-tight">
            Get in Touch with HotnRoll
          </h2>
          <p className="text-sm sm:text-base text-[#181615]/70 mt-3">
            Have a catering request, question about dietary accommodations, or want to reserve our communal table? Send us a note or drop by.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left Column: Direct Info & Hours (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Contact Details Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#EAE4DC] shadow-xs space-y-5">
              <h3 className="font-display text-lg font-bold text-[#181615] pb-3 border-b border-[#F2ECE4]">
                Direct Kitchen Contact
              </h3>

              <div className="space-y-4">
                <a
                  href="tel:+15553927655"
                  className="flex items-start gap-3.5 group text-[#181615] hover:text-[#C8351B] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F5F1EB] group-hover:bg-[#C8351B]/10 flex items-center justify-center shrink-0 transition-colors">
                    <Phone className="w-4 h-4 text-[#C8351B]" />
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-[#181615]/50 block">Direct Hotline</span>
                    <span className="text-sm font-semibold">+1 (555) 392-7655</span>
                  </div>
                </a>

                <a
                  href="mailto:orders@hotnroll.com"
                  className="flex items-start gap-3.5 group text-[#181615] hover:text-[#C8351B] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F5F1EB] group-hover:bg-[#C8351B]/10 flex items-center justify-center shrink-0 transition-colors">
                    <Mail className="w-4 h-4 text-[#C8351B]" />
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-[#181615]/50 block">Inquiries & Catering</span>
                    <span className="text-sm font-semibold">orders@hotnroll.com</span>
                  </div>
                </a>

                <div className="flex items-start gap-3.5 text-[#181615]">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F1EB] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#C8351B]" />
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-[#181615]/50 block">Flagship Kitchen</span>
                    <span className="text-sm font-semibold">482 Culinary Row, Ember District, NY 10012</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Opening Hours Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#EAE4DC] shadow-xs">
              <div className="flex items-center gap-2 pb-3 border-b border-[#F2ECE4] mb-4">
                <Clock className="w-4 h-4 text-[#C8351B]" />
                <h3 className="font-display text-lg font-bold text-[#181615]">
                  Kitchen & Delivery Hours
                </h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center py-1 border-b border-[#F2ECE4]">
                  <span className="font-medium text-[#181615]/80">Monday – Thursday</span>
                  <span className="font-semibold text-[#181615] tabular-nums">11:00 AM – 10:30 PM</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#F2ECE4]">
                  <span className="font-medium text-[#181615]/80">Friday – Saturday</span>
                  <span className="font-semibold text-[#C8351B] tabular-nums">11:00 AM – 12:00 AM (Late)</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-medium text-[#181615]/80">Sunday</span>
                  <span className="font-semibold text-[#181615] tabular-nums">12:00 PM – 10:00 PM</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F2ECE4] text-[11px] text-[#181615]/60 flex items-center justify-between">
                <span>Free order pickup available at counter</span>
                <span className="font-bold text-[#181615]">Dine-In & Takeout</span>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-7 sm:p-9 border border-[#EAE4DC] shadow-xs">
            {submitted ? (
              <div className="py-12 text-center animate-in fade-in duration-300">
                <div className="w-16 h-16 bg-[#C8351B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-[#C8351B]" />
                </div>
                <h3 className="font-display text-2xl font-bold text-[#181615]">
                  Message Received!
                </h3>
                <p className="text-sm text-[#181615]/70 mt-2 max-w-md mx-auto">
                  Thank you, <span className="font-semibold">{formData.name}</span>. Our team at HotnRoll will review your note and respond within 2 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: 'general', message: '' });
                  }}
                  className="mt-6 px-6 py-2.5 bg-[#181615] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-black transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-display text-xl font-bold text-[#181615] mb-2">
                  Send Us a Direct Message
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#181615]/70 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jordan Miller"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#EAE4DC] bg-[#FCFAF7] focus:bg-white focus:outline-hidden focus:border-[#C8351B] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#181615]/70 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#EAE4DC] bg-[#FCFAF7] focus:bg-white focus:outline-hidden focus:border-[#C8351B] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#181615]/70 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#EAE4DC] bg-[#FCFAF7] focus:bg-white focus:outline-hidden focus:border-[#C8351B] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#181615]/70 mb-1.5">
                      Inquiry Topic
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#EAE4DC] bg-[#FCFAF7] focus:bg-white focus:outline-hidden focus:border-[#C8351B] transition-colors"
                    >
                      <option value="general">General Inquiries</option>
                      <option value="reservation">Table Reservation</option>
                      <option value="catering">Event Catering & Bulk Orders</option>
                      <option value="feedback">Order Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#181615]/70 mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what you need, party size, dietary requests, or questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#EAE4DC] bg-[#FCFAF7] focus:bg-white focus:outline-hidden focus:border-[#C8351B] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 text-xs font-bold uppercase tracking-wider text-white bg-[#C8351B] hover:bg-[#B32D15] rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span>Sending your note...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
