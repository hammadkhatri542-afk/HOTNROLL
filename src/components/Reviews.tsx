import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import { RATING_SUMMARY } from '../data/reviews.ts';
import { useCart } from '../context/CartContext.tsx';

export const Reviews: React.FC = () => {
  const { reviews, isLoadingReviews } = useCart();

  return (
    <section id="reviews" className="py-20 lg:py-28 bg-[#FCFAF7] border-t border-[#EAE4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Real Rating Metrics */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C8351B] mb-2">
              <span>Verified Guest Opinions</span>
              <span aria-hidden="true" className="text-[#181615]/30">·</span>
              <span>Real Diners · Verified Feedback</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#181615] tracking-tight">
              Loved by Foodies, Critic Approved
            </h2>
            <p className="text-sm sm:text-base text-[#181615]/70 mt-2 max-w-xl">
              Hear firsthand from our regulars, late-night food lovers, and local culinary enthusiasts.
            </p>
          </div>

          {/* Rating Summary Block */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#EAE4DC] shadow-xs flex items-center gap-6 shrink-0">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-4xl font-black text-[#181615] tabular-nums">
                  {RATING_SUMMARY.average}
                </span>
                <span className="text-xs text-[#181615]/50 font-bold">/ 5.0</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-[#C8351B]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-[#C8351B]" />
                ))}
              </div>
            </div>

            <div className="h-10 w-px bg-[#EAE4DC]" />

            <div>
              <p className="text-sm font-bold text-[#181615] tabular-nums">
                {RATING_SUMMARY.totalReviews.toLocaleString()}+ Reviews
              </p>
              <p className="text-xs text-[#181615]/60 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C8351B]" />
                {RATING_SUMMARY.recommendedPercent}% Recommendation Rate
              </p>
            </div>
          </div>
        </div>

        {/* Loading State or Review Cards Grid */}
        {isLoadingReviews ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[#EAE4DC] animate-pulse space-y-3">
                <div className="h-4 bg-stone-200 rounded w-1/2" />
                <div className="h-16 bg-stone-200 rounded" />
                <div className="h-10 bg-stone-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl p-6 border border-[#EAE4DC] hover:border-[#181615]/30 transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Header: Stars & Date */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-0.5 text-[#C8351B]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#181615]/50 font-medium">
                      {rev.date}
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-[#181615]/80 leading-relaxed italic">
                    “{rev.comment}”
                  </p>
                </div>

                {/* Author & Favorite Dish Footer */}
                <div className="mt-6 pt-4 border-t border-[#F2ECE4]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#181615] text-white flex items-center justify-center font-display font-bold text-xs shrink-0">
                      {rev.avatarText}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display font-bold text-xs sm:text-sm text-[#181615] truncate">
                        {rev.author}
                      </h4>
                      <p className="text-[11px] text-[#181615]/55 truncate">
                        {rev.role}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 text-[11px] text-[#181615]/60 flex items-center gap-1 truncate">
                    <span className="font-semibold text-[#C8351B]">Favorite:</span>
                    <span className="truncate">{rev.favoriteDish}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
