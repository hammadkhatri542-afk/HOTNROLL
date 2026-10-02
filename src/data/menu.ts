import { MenuItem } from '../types';

import burgerImg from '../assets/images/hero_signature_burger_1790345746043.jpg';
import rollImg from '../assets/images/product_gourmet_roll_1790345761717.jpg';
import pizzaImg from '../assets/images/product_woodfired_pizza_1790345778311.jpg';
import friesImg from '../assets/images/product_parmesan_fries_1790345791315.jpg';
import drinkImg from '../assets/images/product_craft_drink_1790345810667.jpg';
import chickenImg from '../assets/images/product_crispy_chicken_1790346501063.jpg';
import comboDealImg from '../assets/images/product_combo_deal_1790346520852.jpg';

export { burgerImg, rollImg, pizzaImg, friesImg, drinkImg, chickenImg, comboDealImg };

export const MENU_ITEMS: MenuItem[] = [
  // --- BURGERS ---
  {
    id: 'burger-truffle-beast',
    name: 'The Truffle Smoked Beast',
    category: 'burgers',
    price: 1450,
    rating: 4.9,
    ratingCount: 428,
    description: 'Double smashed prime Angus beef, aged white cheddar, crispy beef bacon, caramelized shallots, house truffle aioli on toasted sesame brioche.',
    image: burgerImg,
    badge: "Chef's Signature",
    calories: 780,
    prepTime: '10-12 mins',
    ingredients: ['100% Prime Angus Beef', 'Aged White Cheddar', 'Crispy Beef Bacon', 'Caramelized Shallots', 'Black Truffle Aioli', 'Brioche Bun'],
    spiceLevel: 'Mild'
  },
  {
    id: 'burger-classic-smash',
    name: 'HotnRoll Classic Smash',
    category: 'burgers',
    price: 1150,
    rating: 4.8,
    ratingCount: 312,
    description: 'Crispy lace-edged beef patty, double American cheddar, house dill pickles, minced sweet onion, secret HotnRoll ember sauce on toasted potato bun.',
    image: burgerImg,
    badge: 'Popular',
    calories: 680,
    prepTime: '8-10 mins',
    ingredients: ['Smashed Angus Beef', 'Double American Cheese', 'House Dill Pickles', 'Sweet Onion', 'Ember Sauce', 'Potato Bun'],
    spiceLevel: 'Mild'
  },
  {
    id: 'burger-flame-jalapeno',
    name: 'Flame Jalapeño Bacon Stack',
    category: 'burgers',
    price: 1290,
    rating: 4.9,
    ratingCount: 194,
    description: 'Double Angus beef patties, blistered charred jalapeños, smoked pepper jack cheese, chipotle crema, and crispy onion strings on buttered bun.',
    image: burgerImg,
    badge: 'Spicy Hit',
    calories: 820,
    prepTime: '10 mins',
    ingredients: ['Angus Beef', 'Charred Jalapeños', 'Pepper Jack Cheese', 'Chipotle Crema', 'Crispy Onions'],
    spiceLevel: 'Flame'
  },

  // --- ROLLS ---
  {
    id: 'roll-grilled-chicken',
    name: 'Fire-Grilled Spiced Chicken Roll',
    category: 'rolls',
    price: 650,
    rating: 4.9,
    ratingCount: 512,
    description: '48-hour spiced chargrilled chicken thigh, sliced ripe avocado, pickled red onions, purple slaw, and garlic herb crema wrapped tight in hot flatbread.',
    image: rollImg,
    badge: 'Bestseller',
    calories: 590,
    prepTime: '8-10 mins',
    ingredients: ['Chargrilled Spiced Chicken', 'Hass Avocado', 'Pickled Red Onions', 'Crisp Slaw', 'Garlic Herb Crema', 'Fresh Flatbread'],
    spiceLevel: 'Medium'
  },
  {
    id: 'roll-angus-brisket',
    name: 'Smoked Angus Brisket Roll',
    category: 'rolls',
    price: 850,
    rating: 4.8,
    ratingCount: 265,
    description: '8-hour hickory-smoked shredded brisket, charred jalapeño chimichurri, melted pepper jack cheese, and crispy shallots rolled in flaky paratha bread.',
    image: rollImg,
    badge: 'Smoky Craft',
    calories: 640,
    prepTime: '8-10 mins',
    ingredients: ['Hickory-Smoked Brisket', 'Jalapeño Chimichurri', 'Pepper Jack', 'Crispy Shallots', 'Flaky Paratha'],
    spiceLevel: 'Hot'
  },
  {
    id: 'roll-crispy-paneer',
    name: 'Charred Spiced Paneer Roll',
    category: 'rolls',
    price: 550,
    rating: 4.7,
    ratingCount: 148,
    description: 'Marinated cottage cheese cubes chargrilled on skewers, tossed with bell peppers, mint yogurt chutney, and pickled onions in warm handmade flatbread.',
    image: rollImg,
    badge: 'Vegetarian',
    calories: 520,
    prepTime: '7-9 mins',
    ingredients: ['Charred Spiced Paneer', 'Mint Yogurt Chutney', 'Bell Peppers', 'Pickled Onions', 'Handmade Roti'],
    spiceLevel: 'Medium'
  },

  // --- PIZZA ---
  {
    id: 'pizza-hot-honey-pep',
    name: 'Charred Hot Honey Pepperoni Pizza',
    category: 'pizza',
    price: 1850,
    rating: 4.9,
    ratingCount: 684,
    description: 'Leopard-spotted sourdough crust, San Marzano tomato reduction, melted fresh buffalo mozzarella, crispy cupped spicy pepperoni, hot wildflower honey, fresh basil.',
    image: pizzaImg,
    badge: 'House Special',
    calories: 890,
    prepTime: '12-14 mins',
    ingredients: ['72-hr Fermented Dough', 'San Marzano Tomatoes', 'Buffalo Mozzarella', 'Crisp Pepperoni', 'Organic Hot Honey', 'Fresh Basil'],
    spiceLevel: 'Hot'
  },
  {
    id: 'pizza-white-truffle',
    name: 'Wood-Fired Truffle Funghi Pizza',
    category: 'pizza',
    price: 1950,
    rating: 4.8,
    ratingCount: 219,
    description: 'Garlic whipped ricotta base, roasted wild foraged chanterelles and cremini mushrooms, smoked scamorza cheese, and white truffle oil drizzle.',
    image: pizzaImg,
    badge: 'Artisanal',
    calories: 820,
    prepTime: '12-14 mins',
    ingredients: ['Sourdough Base', 'Whipped Ricotta', 'Wild Mushrooms', 'Smoked Scamorza', 'White Truffle Oil'],
    spiceLevel: 'Mild'
  },

  // --- FRIES ---
  {
    id: 'fries-truffle-parm',
    name: 'Truffle Parmesan Hand-Cut Fries',
    category: 'fries',
    price: 490,
    rating: 4.9,
    ratingCount: 540,
    description: 'Crispy skin-on Russet potatoes hand-tossed with 24-month aged Reggiano parmesan, sea salt, fresh picked thyme, served with smoked garlic aioli.',
    image: friesImg,
    badge: 'Crispy Favorite',
    calories: 420,
    prepTime: '6-8 mins',
    ingredients: ['Hand-Cut Russet Potatoes', 'Aged Parmigiano-Reggiano', 'Fresh Thyme & Sea Salt', 'Smoked Garlic Aioli'],
    spiceLevel: 'Mild'
  },
  {
    id: 'fries-ember-loaded',
    name: 'Fire Loaded Ember Fries',
    category: 'fries',
    price: 750,
    rating: 4.8,
    ratingCount: 289,
    description: 'Golden fries topped with chopped smoked brisket burnt ends, melted aged cheddar sauce, diced pickled jalapeños, and house ember drizzle.',
    image: friesImg,
    badge: 'Loaded',
    calories: 620,
    prepTime: '8 mins',
    ingredients: ['Hand-Cut Fries', 'Smoked Brisket Ends', 'Melted Cheddar Sauce', 'Pickled Jalapeños', 'Ember Sauce'],
    spiceLevel: 'Medium'
  },

  // --- CHICKEN ---
  {
    id: 'chicken-crispy-tenders',
    name: 'Golden Buttermilk Crispy Tenders',
    category: 'chicken',
    price: 890,
    rating: 4.9,
    ratingCount: 382,
    description: 'Tender chicken breast strips soaked 24 hours in herbed spiced buttermilk, double dredge fried to golden crunch, served with honey mustard and garlic dip.',
    image: chickenImg,
    badge: 'Golden Crunch',
    calories: 640,
    prepTime: '8-10 mins',
    ingredients: ['Buttermilk Marinated Chicken', 'House Spiced Crumb', 'Garlic Herb Dip', 'Fresh Parsley & Sea Salt'],
    spiceLevel: 'Mild'
  },
  {
    id: 'chicken-flame-peri-wings',
    name: 'Smoky Peri-Flame Charred Wings',
    category: 'chicken',
    price: 990,
    rating: 4.8,
    ratingCount: 310,
    description: 'Eight jumbo chicken wings chargrilled over hot coals and tossed in fiery garlic peri-peri reduction with fresh lime squeeze.',
    image: chickenImg,
    badge: 'Charcoal Fired',
    calories: 580,
    prepTime: '10-12 mins',
    ingredients: ['Jumbo Chicken Wings', 'Bird’s Eye Chili Peri Sauce', 'Charred Lime', 'Smoked Sea Salt'],
    spiceLevel: 'Flame'
  },

  // --- DRINKS ---
  {
    id: 'drink-blood-orange',
    name: 'Blood Orange & Passionfruit Fizz',
    category: 'drinks',
    price: 380,
    rating: 4.9,
    ratingCount: 412,
    description: 'Cold-pressed Sicilian blood orange juice, aromatic passionfruit pulp, sparkling mineral water, fresh mint leaves, and dehydrated citrus wheel.',
    image: drinkImg,
    badge: 'Cold Pressed',
    calories: 140,
    prepTime: '3 mins',
    ingredients: ['Sicilian Blood Orange', 'Passionfruit Pulp', 'Sparkling Spring Water', 'Fresh Garden Mint', 'Raw Agave'],
    spiceLevel: 'Mild'
  },
  {
    id: 'drink-mint-lemonade',
    name: 'Charred Mint Lemonade Spritz',
    category: 'drinks',
    price: 320,
    rating: 4.7,
    ratingCount: 220,
    description: 'Freshly squeezed Eureka lemons, bruised garden spearmint, cane sugar, sparkling soda, and pinch of pink Himalayan salt over cracked ice.',
    image: drinkImg,
    badge: 'Refresher',
    calories: 120,
    prepTime: '3 mins',
    ingredients: ['Eureka Lemon Juice', 'Fresh Mint Leaves', 'Sparkling Soda', 'Pure Cane Sugar', 'Pink Salt'],
    spiceLevel: 'Mild'
  },

  // --- DEALS ---
  {
    id: 'deal-ember-duo',
    name: 'The Ember Duo Feast for Two',
    category: 'deals',
    price: 2650,
    rating: 4.9,
    ratingCount: 640,
    description: '1x The Truffle Smoked Beast Burger, 1x Fire-Grilled Spiced Chicken Roll, 1x Large Truffle Parmesan Fries, and 2x Craft Sodas. Save Rs. 400+!',
    image: comboDealImg,
    badge: 'Best Value',
    calories: 1680,
    prepTime: '12-15 mins',
    ingredients: ['Truffle Beast Burger', 'Spiced Chicken Roll', 'Large Truffle Fries', 'Two Craft Beverages', 'Assorted House Sauces'],
    spiceLevel: 'Medium'
  },
  {
    id: 'deal-solo-box',
    name: 'Solo Flame Craver Box',
    category: 'deals',
    price: 1550,
    rating: 4.8,
    ratingCount: 395,
    description: '1x HotnRoll Classic Smash, 3x Buttermilk Crispy Chicken Tenders, regular hand-cut fries, and 1x Craft Beverage with dipping sauces.',
    image: comboDealImg,
    badge: 'Chef Combo',
    calories: 1150,
    prepTime: '10-12 mins',
    ingredients: ['Classic Smash Burger', '3x Crispy Tenders', 'Hand-Cut Fries', 'Craft Beverage', 'Choice of Dipping Sauce'],
    spiceLevel: 'Mild'
  },
  {
    id: 'deal-pizza-wing-bundle',
    name: 'Wood-Fired Pizza & Wings Night',
    category: 'deals',
    price: 2990,
    rating: 4.9,
    ratingCount: 480,
    description: '1x Charred Hot Honey Pepperoni Pizza, 8x Smoky Peri-Flame Charred Wings, large dipping sauces, and 2x Cold Drinks.',
    image: comboDealImg,
    badge: 'Game Day Feast',
    calories: 1850,
    prepTime: '15 mins',
    ingredients: ['Pepperoni Pizza', '8x Peri Wings', 'Garlic Herb Dip', 'Two Cold Beverages'],
    spiceLevel: 'Hot'
  }
];
