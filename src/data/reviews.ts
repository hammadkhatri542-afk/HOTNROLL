import { Review } from '../types';

export const REVIEWS_DATA: Review[] = [
  {
    id: 'rev-1',
    author: 'Marcus Vance',
    role: 'Verified Local Diner · 14 orders',
    avatarText: 'MV',
    rating: 5,
    date: '3 days ago',
    comment: 'The crust on the smashed burger patties is unmatched in this city. You can actually taste the sear from the flame. The Truffle Smoked Beast with hand-cut parmesan fries is now our Friday ritual.',
    favoriteDish: 'The Truffle Smoked Beast'
  },
  {
    id: 'rev-2',
    author: 'Elena Rostova',
    role: 'Culinary Writer & Regular',
    avatarText: 'ER',
    rating: 5,
    date: '1 week ago',
    comment: 'Most rolled sandwiches get soggy after 5 minutes—HotnRoll’s flaky paratha wrap stays crisp and warm until the last bite. The charred garlic crema and pickled onions give it incredible brightness.',
    favoriteDish: 'Fire-Grilled Spiced Chicken Roll'
  },
  {
    id: 'rev-3',
    author: 'David Chen',
    role: 'Verified Diner · Ember District',
    avatarText: 'DC',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Ordered for our studio team lunch of 12 people. Arrived exactly on the minute, hot and beautifully boxed. The charred hot honey pepperoni pizza disappeared in under 4 minutes flat.',
    favoriteDish: 'Charred Hot Honey Pepperoni'
  },
  {
    id: 'rev-4',
    author: 'Sophia Martinez',
    role: 'Verified Diner · 6 orders',
    avatarText: 'SM',
    rating: 5,
    date: '3 weeks ago',
    comment: 'From the Blood Orange Fizz to the Rosemary Truffle Fries, everything tastes like it was prepared by a fine-dining kitchen with fast-casual soul. Outstanding quality.',
    favoriteDish: 'Truffle Parmesan Hand-Cut Fries'
  }
];

export const RATING_SUMMARY = {
  average: 4.9,
  totalReviews: 2840,
  recommendedPercent: 98,
  starBreakdown: [
    { stars: 5, percent: 91 },
    { stars: 4, percent: 7 },
    { stars: 3, percent: 2 },
    { stars: 2, percent: 0 },
    { stars: 1, percent: 0 }
  ]
};
