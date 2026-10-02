import React from 'react';
import { Flame, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';

export const AboutStory: React.FC = () => {
  return (
    <section id="about" className="py-20 lg:py-28 bg-[#F5F1EB] border-t border-[#EAE4DC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Philosophy & Standards (7 cols) */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C8351B] mb-3">
              <Flame className="w-4 h-4 text-[#C8351B]" />
              <span>The HotnRoll Kitchen Standard</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#181615] tracking-tight leading-[1.15] mb-6">
              Born from a simple belief: fast food deserves fine-dining craft.
            </h2>

            <p className="text-sm sm:text-base text-[#181615]/75 leading-relaxed mb-6">
              Founded in 2021 in the bustling culinary heart of Ember District, HotnRoll began as a passion project between two line chefs who grew weary of commercial reheated food and bland wraps.
            </p>

            <p className="text-sm sm:text-base text-[#181615]/75 leading-relaxed mb-8">
              We decided that every single bun should be rolled and baked fresh, every brisket smoked over natural hickory for eight continuous hours, and every wrap rolled tightly by hand with house-emulsified herb dressings.
            </p>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-6 border-t border-[#E2DBD1]">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#C8351B]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Flame className="w-4 h-4 text-[#C8351B]" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-[#181615]">500° Cast Iron Sear</h4>
                  <p className="text-xs text-[#181615]/70 mt-1">
                    Delivering the crispiest lacy edges on our smash patties while sealing in prime natural juices.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#181615]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-[#181615]" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-[#181615]">Daily Hand-Rolled Breads</h4>
                  <p className="text-xs text-[#181615]/70 mt-1">
                    No factory-frozen flatbreads. Rolled, rested, and griddled live right in front of your eyes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#181615]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-[#181615]" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-[#181615]">100% Halal Angus Cuts</h4>
                  <p className="text-xs text-[#181615]/70 mt-1">
                    Ethically raised, hormone-free pasture beef sourced directly from regional partner family ranches.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#C8351B]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <HeartHandshake className="w-4 h-4 text-[#C8351B]" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-[#181615]">Scratch Sauces Only</h4>
                  <p className="text-xs text-[#181615]/70 mt-1">
                    Our charred garlic crema, hot chili honey, and black truffle aioli are whipped fresh each morning.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Culinary Proof Card & Chef Note (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white p-7 sm:p-9 rounded-2xl border border-[#EAE4DC] shadow-sm relative">
              <div className="flex items-center justify-between pb-6 border-b border-[#F2ECE4]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#181615] text-white flex items-center justify-center font-display font-bold text-lg">
                    T
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-base text-[#181615]">Tariq Al-Mansoor</h4>
                    <p className="text-xs text-[#181615]/60">Head Chef & Co-Founder</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#C8351B] uppercase tracking-wider">
                  Ember District
                </span>
              </div>

              <blockquote className="text-sm sm:text-base italic text-[#181615]/80 leading-relaxed mt-6">
                “When you smell our flatbread hitting the fire and see the burger sizzle on seasoned iron, you understand the difference. There is no replacement for patience, heat, and genuine respect for food.”
              </blockquote>

              <div className="mt-8 pt-6 border-t border-[#F2ECE4] flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#181615]/50 font-bold">Kitchen Hours</p>
                  <p className="text-sm font-bold text-[#181615] mt-0.5">Mon–Sun from 11:00 AM</p>
                </div>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#C8351B] hover:text-[#B32D15]"
                >
                  Visit Kitchen &rarr;
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
