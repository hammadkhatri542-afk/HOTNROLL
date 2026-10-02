import { db } from './index.ts';
import { products, orders, orderItems, reviews } from './schema.ts';
import { desc, eq } from 'drizzle-orm';

export interface CreateOrderInput {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
}

export interface CreateProductInput {
  id?: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  rating?: number;
  isAvailable?: boolean;
}

// -------------------------------------------------------------
// In-Memory Resilient Synchronized Fallback Store
// Ensures seamless operations even if Cloud SQL is sleeping or initializing
// -------------------------------------------------------------
interface MemoryProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  rating: number;
  isAvailable: boolean;
  createdAt: Date;
}

interface MemoryOrder {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  notes: string | null;
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
  createdAt: Date;
  assignedRiderId?: string;
  assignedRiderName?: string;
  assignedRiderPhone?: string;
  items: Array<{
    id: number;
    orderId: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
}

export interface MemoryRider {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  status: 'available' | 'delivering' | 'offline';
  activeOrdersCount: number;
  totalDelivered: number;
  rating: number;
  joinedDate: string;
}

interface MemoryReview {
  id: number;
  customerName: string;
  rating: number;
  reviewText: string;
  createdAt: Date;
}

// Seed memory products from verified menu items without importing .jpg directly in Node
const memoryProducts: MemoryProduct[] = [
  {
    id: 'burger-truffle-beast',
    name: 'The Truffle Smoked Beast',
    category: 'burgers',
    price: 1450,
    rating: 4.9,
    description: 'Double smashed prime Angus beef, aged white cheddar, crispy beef bacon, caramelized shallots, house truffle aioli on toasted sesame brioche.',
    imageUrl: '/src/assets/images/hero_signature_burger_1790345746043.jpg',
    isAvailable: true,
    createdAt: new Date(),
  },
  {
    id: 'burger-classic-smash',
    name: 'HotnRoll Classic Smash',
    category: 'burgers',
    price: 1150,
    rating: 4.8,
    description: 'Crispy lace-edged beef patty, double American cheddar, house dill pickles, minced sweet onion, secret HotnRoll ember sauce on toasted potato bun.',
    imageUrl: '/src/assets/images/hero_signature_burger_1790345746043.jpg',
    isAvailable: true,
    createdAt: new Date(),
  },
  {
    id: 'burger-flame-jalapeno',
    name: 'Flame Jalapeño Bacon Stack',
    category: 'burgers',
    price: 1290,
    rating: 4.9,
    description: 'Double Angus beef patties, blistered charred jalapeños, smoked pepper jack cheese, chipotle crema, and crispy onion strings on buttered bun.',
    imageUrl: '/src/assets/images/hero_signature_burger_1790345746043.jpg',
    isAvailable: true,
    createdAt: new Date(),
  },
  {
    id: 'roll-grilled-chicken',
    name: 'Fire-Grilled Spiced Chicken Roll',
    category: 'rolls',
    price: 650,
    rating: 4.9,
    description: '48-hour spiced chargrilled chicken thigh, sliced ripe avocado, pickled red onions, purple slaw, and garlic herb crema wrapped tight in hot flatbread.',
    imageUrl: '/src/assets/images/product_gourmet_roll_1790345761717.jpg',
    isAvailable: true,
    createdAt: new Date(),
  },
  {
    id: 'roll-angus-brisket',
    name: 'Smoked Angus Brisket Roll',
    category: 'rolls',
    price: 850,
    rating: 4.8,
    description: '8-hour hickory-smoked shredded brisket, charred jalapeño chimichurri, melted pepper jack cheese, and crispy shallots rolled in flaky paratha bread.',
    imageUrl: '/src/assets/images/product_gourmet_roll_1790345761717.jpg',
    isAvailable: true,
    createdAt: new Date(),
  },
  {
    id: 'roll-crispy-paneer',
    name: 'Charred Spiced Paneer Roll',
    category: 'rolls',
    price: 550,
    rating: 4.7,
    description: 'Marinated cottage cheese cubes chargrilled on skewers, tossed with bell peppers, mint yogurt chutney, and pickled onions in warm handmade flatbread.',
    imageUrl: '/src/assets/images/product_gourmet_roll_1790345761717.jpg',
    isAvailable: true,
    createdAt: new Date(),
  },
  {
    id: 'pizza-hot-honey-pep',
    name: 'Charred Hot Honey Pepperoni Pizza',
    category: 'pizza',
    price: 1850,
    rating: 4.9,
    description: 'Leopard-spotted sourdough crust, San Marzano tomato reduction, melted fresh buffalo mozzarella, crispy cupped spicy pepperoni, hot wildflower honey, fresh basil.',
    imageUrl: '/src/assets/images/product_woodfired_pizza_1790345778311.jpg',
    isAvailable: true,
    createdAt: new Date(),
  },
  {
    id: 'pizza-white-truffle',
    name: 'Wood-Fired Truffle Funghi Pizza',
    category: 'pizza',
    price: 1950,
    rating: 4.8,
    description: 'Garlic whipped ricotta base, roasted wild foraged chanterelles and cremini mushrooms, smoked scamorza cheese, and white truffle oil drizzle.',
    imageUrl: '/src/assets/images/product_woodfired_pizza_1790345778311.jpg',
    isAvailable: true,
    createdAt: new Date(),
  },
  {
    id: 'fries-truffle-parm',
    name: 'Truffle Parmesan Hand-Cut Fries',
    category: 'fries',
    price: 490,
    rating: 4.9,
    description: 'Crispy skin-on Russet potatoes hand-tossed with 24-month aged Reggiano parmesan, sea salt, fresh picked thyme, served with smoked garlic aioli.',
    imageUrl: '/src/assets/images/product_parmesan_fries_1790345791315.jpg',
    isAvailable: true,
    createdAt: new Date(),
  },
  {
    id: 'fries-ember-loaded',
    name: 'Fire Loaded Ember Fries',
    category: 'fries',
    price: 750,
    rating: 4.8,
    description: 'Golden fries topped with chopped smoked brisket burnt ends, melted aged cheddar sauce, diced pickled jalapeños, and house ember drizzle.',
    imageUrl: '/src/assets/images/product_parmesan_fries_1790345791315.jpg',
    isAvailable: true,
    createdAt: new Date(),
  },
  {
    id: 'chicken-crispy-tenders',
    name: 'Golden Buttermilk Crispy Tenders',
    category: 'chicken',
    price: 890,
    rating: 4.9,
    description: 'Tender chicken breast strips soaked 24 hours in herbed spiced buttermilk, double dredge fried to golden crunch, served with honey mustard and garlic dip.',
    imageUrl: '/src/assets/images/product_crispy_chicken_1790346501063.jpg',
    isAvailable: true,
    createdAt: new Date(),
  },
  {
    id: 'chicken-flame-peri-wings',
    name: 'Smoky Peri-Flame Charred Wings',
    category: 'chicken',
    price: 990,
    rating: 4.8,
    description: 'Eight jumbo chicken wings chargrilled over hot coals and tossed in fiery garlic peri-peri reduction with fresh lime squeeze.',
    imageUrl: '/src/assets/images/product_crispy_chicken_1790346501063.jpg',
    isAvailable: true,
    createdAt: new Date(),
  },
  {
    id: 'drink-blood-orange',
    name: 'Blood Orange & Passionfruit Fizz',
    category: 'drinks',
    price: 380,
    rating: 4.9,
    description: 'Cold-pressed Sicilian blood orange juice, aromatic passionfruit pulp, sparkling mineral water, fresh mint leaves, and dehydrated citrus wheel.',
    imageUrl: '/src/assets/images/product_craft_drink_1790345810667.jpg',
    isAvailable: true,
    createdAt: new Date(),
  },
  {
    id: 'drink-mint-lemonade',
    name: 'Charred Mint Lemonade Spritz',
    category: 'drinks',
    price: 320,
    rating: 4.7,
    description: 'Freshly squeezed Eureka lemons, bruised garden spearmint, cane sugar, sparkling soda, and pinch of pink Himalayan salt over cracked ice.',
    imageUrl: '/src/assets/images/product_craft_drink_1790345810667.jpg',
    isAvailable: true,
    createdAt: new Date(),
  },
  {
    id: 'deal-ember-duo',
    name: 'The Ember Duo Feast for Two',
    category: 'deals',
    price: 2650,
    rating: 4.9,
    description: '1x The Truffle Smoked Beast Burger, 1x Fire-Grilled Spiced Chicken Roll, 1x Large Truffle Parmesan Fries, and 2x Craft Sodas. Save Rs. 400+!',
    imageUrl: '/src/assets/images/product_combo_deal_1790346520852.jpg',
    isAvailable: true,
    createdAt: new Date(),
  },
  {
    id: 'deal-solo-box',
    name: 'Solo Flame Craver Box',
    category: 'deals',
    price: 1550,
    rating: 4.8,
    description: '1x HotnRoll Classic Smash, 3x Buttermilk Crispy Chicken Tenders, regular hand-cut fries, and 1x Craft Beverage with dipping sauces.',
    imageUrl: '/src/assets/images/product_combo_deal_1790346520852.jpg',
    isAvailable: true,
    createdAt: new Date(),
  },
  {
    id: 'deal-pizza-wing-bundle',
    name: 'Wood-Fired Pizza & Wings Night',
    category: 'deals',
    price: 2990,
    rating: 4.9,
    description: '1x Charred Hot Honey Pepperoni Pizza, 8x Smoky Peri-Flame Charred Wings, large dipping sauces, and 2x Cold Drinks.',
    imageUrl: '/src/assets/images/product_combo_deal_1790346520852.jpg',
    isAvailable: true,
    createdAt: new Date(),
  },
];

// Delivery Riders registry
const memoryRiders: MemoryRider[] = [
  {
    id: 'rider-1',
    name: 'Muhammad Bilal',
    phone: '+92 301 4589201',
    vehicle: 'Honda CD 70 (KHI-4921)',
    status: 'delivering',
    activeOrdersCount: 1,
    totalDelivered: 142,
    rating: 4.9,
    joinedDate: 'Jan 2026',
  },
  {
    id: 'rider-2',
    name: 'Zeeshan Tariq',
    phone: '+92 321 8923411',
    vehicle: 'Honda CG 125 (KHI-8192)',
    status: 'available',
    activeOrdersCount: 0,
    totalDelivered: 98,
    rating: 4.8,
    joinedDate: 'Feb 2026',
  },
  {
    id: 'rider-3',
    name: 'Hamza Ali',
    phone: '+92 333 7120934',
    vehicle: 'Yamaha YBR 125 (KHI-3041)',
    status: 'available',
    activeOrdersCount: 0,
    totalDelivered: 215,
    rating: 5.0,
    joinedDate: 'Nov 2025',
  },
  {
    id: 'rider-4',
    name: 'Usman Ghani',
    phone: '+92 345 5612980',
    vehicle: 'Suzuki GD 110 (KHI-5519)',
    status: 'offline',
    activeOrdersCount: 0,
    totalDelivered: 76,
    rating: 4.7,
    joinedDate: 'Mar 2026',
  },
];

// Seed memory reviews without external module dependencies
const memoryReviews: MemoryReview[] = [
  {
    id: 1,
    customerName: 'Marcus Vance',
    rating: 5,
    reviewText: 'The crust on the smashed burger patties is unmatched in this city. You can actually taste the sear from the flame. The Truffle Smoked Beast with hand-cut parmesan fries is now our Friday ritual.',
    createdAt: new Date(Date.now() - 3 * 3600 * 24 * 1000),
  },
  {
    id: 2,
    customerName: 'Elena Rostova',
    rating: 5,
    reviewText: 'Most rolled sandwiches get soggy after 5 minutes—HotnRoll’s flaky paratha wrap stays crisp and warm until the last bite. The charred garlic crema and pickled onions give it incredible brightness.',
    createdAt: new Date(Date.now() - 7 * 3600 * 24 * 1000),
  },
  {
    id: 3,
    customerName: 'David Chen',
    rating: 5,
    reviewText: 'Ordered for our studio team lunch of 12 people. Arrived exactly on the minute, hot and beautifully boxed. The charred hot honey pepperoni pizza disappeared in under 4 minutes flat.',
    createdAt: new Date(Date.now() - 14 * 3600 * 24 * 1000),
  },
  {
    id: 4,
    customerName: 'Sophia Martinez',
    rating: 5,
    reviewText: 'From the Blood Orange Fizz to the Rosemary Truffle Fries, everything tastes like it was prepared by a fine-dining kitchen with fast-casual soul. Outstanding quality.',
    createdAt: new Date(Date.now() - 21 * 3600 * 24 * 1000),
  },
];

// Initial starter orders for admin realism in Pakistani Rupees
const memoryOrders: MemoryOrder[] = [
  {
    id: 'HNR-4821',
    customerName: 'Marcus Vance',
    phone: '+92 301 2348901',
    address: 'House 428, Block 4, Clifton, Karachi',
    notes: 'Please buzz gate bell, extra truffle aioli if possible.',
    paymentMethod: 'cod',
    subtotal: 1940,
    deliveryFee: 150,
    total: 2090,
    status: 'Out for Delivery',
    createdAt: new Date(Date.now() - 25 * 60 * 1000),
    assignedRiderId: 'rider-1',
    assignedRiderName: 'Muhammad Bilal',
    assignedRiderPhone: '+92 301 4589201',
    items: [
      { id: 1, orderId: 'HNR-4821', productId: 'burger-truffle-beast', productName: 'The Truffle Smoked Beast', quantity: 1, price: 1450 },
      { id: 2, orderId: 'HNR-4821', productId: 'fries-truffle-parm', productName: 'Truffle Parmesan Hand-Cut Fries', quantity: 1, price: 490 },
    ],
  },
  {
    id: 'HNR-7193',
    customerName: 'Elena Rostova',
    phone: '+92 321 6784321',
    address: 'Suite 204, Phase 6, DHA, Karachi',
    notes: 'Contact-free delivery, leave with building reception.',
    paymentMethod: 'online_card',
    subtotal: 2880,
    deliveryFee: 0,
    total: 2880,
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 48 * 60 * 1000),
    items: [
      { id: 3, orderId: 'HNR-7193', productId: 'pizza-hot-honey-pep', productName: 'Charred Hot Honey Pepperoni Pizza', quantity: 1, price: 1850 },
      { id: 4, orderId: 'HNR-7193', productId: 'roll-grilled-chicken', productName: 'Fire-Grilled Spiced Chicken Roll', quantity: 1, price: 650 },
      { id: 5, orderId: 'HNR-7193', productId: 'drink-blood-orange', productName: 'Blood Orange & Passionfruit Fizz', quantity: 1, price: 380 },
    ],
  },
];

function isPostgresConfigured(): boolean {
  return Boolean(
    process.env.SQL_HOST &&
    process.env.SQL_USER &&
    process.env.SQL_PASSWORD &&
    process.env.SQL_DB_NAME
  );
}

// 1. Fetch all available products
export async function getDbProducts() {
  if (isPostgresConfigured()) {
    try {
      const result = await db.select().from(products).where(eq(products.isAvailable, true));
      if (result && result.length > 0) return result;
    } catch (error) {
      console.warn('Postgres getDbProducts query failed, serving from operational memory store:', error);
    }
  }
  return memoryProducts.filter((p) => p.isAvailable);
}

// 2. Fetch all reviews
export async function getDbReviews() {
  if (isPostgresConfigured()) {
    try {
      const result = await db.select().from(reviews).orderBy(desc(reviews.createdAt));
      if (result && result.length > 0) return result;
    } catch (error) {
      console.warn('Postgres getDbReviews query failed, serving from operational memory store:', error);
    }
  }
  return [...memoryReviews].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// 3. Create a new order with order items in a transaction
export async function createDbOrder(input: CreateOrderInput) {
  // Always record in memory store for immediate consistency
  const orderItemsData = (input.items || []).map((item, idx) => ({
    id: Date.now() + idx,
    orderId: input.id,
    productId: item.productId,
    productName: item.productName,
    quantity: item.quantity,
    price: Number(item.price),
  }));

  const newMemoryOrder: MemoryOrder = {
    id: input.id,
    customerName: input.customerName,
    phone: input.phone,
    address: input.address,
    notes: input.notes || null,
    paymentMethod: input.paymentMethod,
    subtotal: input.subtotal,
    deliveryFee: input.deliveryFee,
    total: input.total,
    status: 'Pending',
    createdAt: new Date(),
    items: orderItemsData,
  };

  memoryOrders.unshift(newMemoryOrder);

  if (isPostgresConfigured()) {
    try {
      const order = await db.transaction(async (tx) => {
        const [insertedOrder] = await tx
          .insert(orders)
          .values({
            id: input.id,
            customerName: input.customerName,
            phone: input.phone,
            address: input.address,
            notes: input.notes || null,
            paymentMethod: input.paymentMethod,
            subtotal: input.subtotal,
            deliveryFee: input.deliveryFee,
            total: input.total,
            status: 'Pending',
          })
          .returning();

        if (input.items && input.items.length > 0) {
          await tx.insert(orderItems).values(
            input.items.map((item) => ({
              orderId: insertedOrder.id,
              productId: item.productId,
              productName: item.productName,
              quantity: item.quantity,
              price: item.price,
            }))
          );
        }

        return insertedOrder;
      });
      return order;
    } catch (error) {
      console.warn('Postgres createDbOrder failed, persisted to operational memory store:', error);
    }
  }

  return newMemoryOrder;
}

// 4. Get order by ID with items
export async function getDbOrderById(orderId: string) {
  if (isPostgresConfigured()) {
    try {
      const orderRecord = await db.query.orders.findFirst({
        where: eq(orders.id, orderId),
        with: {
          items: true,
        },
      });
      if (orderRecord) return orderRecord;
    } catch (error) {
      console.warn(`Postgres getDbOrderById(${orderId}) failed, searching memory store:`, error);
    }
  }
  const found = memoryOrders.find((o) => o.id === orderId);
  return found || null;
}

// 5. Admin: Get all products (including unavailable ones)
export async function getAllDbProductsAdmin() {
  if (isPostgresConfigured()) {
    try {
      const all = await db.select().from(products).orderBy(products.category, products.name);
      if (all && all.length > 0) return all;
    } catch (error) {
      console.warn('Postgres getAllDbProductsAdmin failed, falling back to memory store:', error);
    }
  }
  return [...memoryProducts].sort((a, b) => a.name.localeCompare(b.name));
}

// 6. Admin: Create product
export async function createDbProduct(input: CreateProductInput) {
  const id = input.id || `${input.category}-${input.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}-${Date.now().toString().slice(-4)}`;
  const newProduct: MemoryProduct = {
    id,
    name: input.name,
    description: input.description,
    category: input.category,
    price: Number(input.price),
    imageUrl: input.imageUrl,
    rating: input.rating !== undefined ? Number(input.rating) : 5.0,
    isAvailable: input.isAvailable !== undefined ? Boolean(input.isAvailable) : true,
    createdAt: new Date(),
  };

  memoryProducts.unshift(newProduct);

  if (isPostgresConfigured()) {
    try {
      const [created] = await db
        .insert(products)
        .values({
          id,
          name: input.name,
          description: input.description,
          category: input.category,
          price: Number(input.price),
          imageUrl: input.imageUrl,
          rating: input.rating !== undefined ? Number(input.rating) : 5.0,
          isAvailable: input.isAvailable !== undefined ? Boolean(input.isAvailable) : true,
        })
        .returning();
      return created;
    } catch (error) {
      console.warn('Postgres createDbProduct failed, persisted to memory store:', error);
    }
  }

  return newProduct;
}

// 7. Admin: Update product
export async function updateDbProduct(id: string, updates: Partial<CreateProductInput>) {
  const index = memoryProducts.findIndex((p) => p.id === id);
  if (index !== -1) {
    memoryProducts[index] = {
      ...memoryProducts[index],
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.description !== undefined && { description: updates.description }),
      ...(updates.category !== undefined && { category: updates.category }),
      ...(updates.price !== undefined && { price: Number(updates.price) }),
      ...(updates.imageUrl !== undefined && { imageUrl: updates.imageUrl }),
      ...(updates.rating !== undefined && { rating: Number(updates.rating) }),
      ...(updates.isAvailable !== undefined && { isAvailable: Boolean(updates.isAvailable) }),
    };
  }

  if (isPostgresConfigured()) {
    try {
      const patch: Record<string, any> = {};
      if (updates.name !== undefined) patch.name = updates.name;
      if (updates.description !== undefined) patch.description = updates.description;
      if (updates.category !== undefined) patch.category = updates.category;
      if (updates.price !== undefined) patch.price = Number(updates.price);
      if (updates.imageUrl !== undefined) patch.imageUrl = updates.imageUrl;
      if (updates.isAvailable !== undefined) patch.isAvailable = Boolean(updates.isAvailable);
      if (updates.rating !== undefined) patch.rating = Number(updates.rating);

      const [updated] = await db
        .update(products)
        .set(patch)
        .where(eq(products.id, id))
        .returning();
      if (updated) return updated;
    } catch (error) {
      console.warn(`Postgres updateDbProduct(${id}) failed, memory updated:`, error);
    }
  }

  return index !== -1 ? memoryProducts[index] : null;
}

// 8. Admin: Delete product
export async function deleteDbProduct(id: string) {
  const index = memoryProducts.findIndex((p) => p.id === id);
  let deletedMemory: MemoryProduct | null = null;
  if (index !== -1) {
    deletedMemory = memoryProducts.splice(index, 1)[0];
  }

  if (isPostgresConfigured()) {
    try {
      const [deleted] = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning();
      if (deleted) return deleted;
    } catch (error) {
      console.warn(`Postgres deleteDbProduct(${id}) failed, memory removed:`, error);
    }
  }

  return deletedMemory;
}

// 9. Admin: Get all orders with items
export async function getAllDbOrdersAdmin() {
  if (isPostgresConfigured()) {
    try {
      const allOrders = await db.query.orders.findMany({
        with: {
          items: true,
        },
        orderBy: [desc(orders.createdAt)],
      });
      if (allOrders && allOrders.length > 0) return allOrders;
    } catch (error) {
      console.warn('Postgres getAllDbOrdersAdmin failed, falling back to memory store:', error);
    }
  }
  return [...memoryOrders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// 10. Admin: Update order status
export async function updateDbOrderStatus(id: string, status: string) {
  const order = memoryOrders.find((o) => o.id === id);
  if (order) {
    order.status = status;
  }

  if (isPostgresConfigured()) {
    try {
      const [updated] = await db
        .update(orders)
        .set({ status })
        .where(eq(orders.id, id))
        .returning();
      if (updated) return updated;
    } catch (error) {
      console.warn(`Postgres updateDbOrderStatus(${id}, ${status}) failed, memory updated:`, error);
    }
  }

  return order || null;
}

// 11. Admin: Delete / moderate review
export async function deleteDbReview(id: number) {
  const index = memoryReviews.findIndex((r) => r.id === id);
  let deleted: MemoryReview | null = null;
  if (index !== -1) {
    deleted = memoryReviews.splice(index, 1)[0];
  }

  if (isPostgresConfigured()) {
    try {
      const [sqlDeleted] = await db
        .delete(reviews)
        .where(eq(reviews.id, id))
        .returning();
      if (sqlDeleted) return sqlDeleted;
    } catch (error) {
      console.warn(`Postgres deleteDbReview(${id}) failed, memory removed:`, error);
    }
  }

  return deleted;
}

// 12. Admin: Dashboard Stats
export async function getDbAdminStats() {
  const allOrders = await getAllDbOrdersAdmin();
  const allProducts = await getAllDbProductsAdmin();
  const allReviews = await getDbReviews();

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  let todayOrdersCount = 0;
  let totalRevenue = 0;
  let pendingOrdersCount = 0;

  for (const order of allOrders) {
    const orderDate = order.createdAt ? new Date(order.createdAt).getTime() : 0;
    if (orderDate >= startOfToday) {
      todayOrdersCount++;
    }

    const st = (order.status || '').toLowerCase();
    if (st !== 'cancelled') {
      totalRevenue += Number(order.total) || 0;
    }

    if (st === 'pending' || st === 'received') {
      pendingOrdersCount++;
    }
  }

  return {
    totalOrders: allOrders.length,
    todayOrders: todayOrdersCount,
    totalRevenue: Number(totalRevenue.toFixed(2)),
    pendingOrders: pendingOrdersCount,
    totalProducts: allProducts.length,
    availableProducts: allProducts.filter((p: any) => p.isAvailable).length,
    totalReviews: allReviews.length,
    totalRiders: memoryRiders.length,
    activeRiders: memoryRiders.filter((r) => r.status === 'delivering' || r.status === 'available').length,
    recentOrders: allOrders.slice(0, 8),
  };
}

// 13. Admin: Rider Management Functions
export async function getAllDbRiders(): Promise<MemoryRider[]> {
  return [...memoryRiders];
}

export async function createDbRider(input: {
  name: string;
  phone: string;
  vehicle: string;
  status?: 'available' | 'delivering' | 'offline';
}): Promise<MemoryRider> {
  const id = `rider-${Date.now().toString().slice(-4)}`;
  const newRider: MemoryRider = {
    id,
    name: input.name.trim(),
    phone: input.phone.trim(),
    vehicle: input.vehicle.trim(),
    status: input.status || 'available',
    activeOrdersCount: 0,
    totalDelivered: 0,
    rating: 5.0,
    joinedDate: new Date().toLocaleDateString([], { month: 'short', year: 'numeric' }),
  };
  memoryRiders.unshift(newRider);
  return newRider;
}

export async function updateDbRider(
  id: string,
  updates: Partial<Omit<MemoryRider, 'id'>>
): Promise<MemoryRider | null> {
  const rider = memoryRiders.find((r) => r.id === id);
  if (!rider) return null;
  if (updates.name !== undefined) rider.name = updates.name.trim();
  if (updates.phone !== undefined) rider.phone = updates.phone.trim();
  if (updates.vehicle !== undefined) rider.vehicle = updates.vehicle.trim();
  if (updates.status !== undefined) rider.status = updates.status;
  if (updates.activeOrdersCount !== undefined) rider.activeOrdersCount = updates.activeOrdersCount;
  if (updates.totalDelivered !== undefined) rider.totalDelivered = updates.totalDelivered;
  if (updates.rating !== undefined) rider.rating = updates.rating;
  return rider;
}

export async function deleteDbRider(id: string): Promise<MemoryRider | null> {
  const index = memoryRiders.findIndex((r) => r.id === id);
  if (index === -1) return null;
  const deleted = memoryRiders.splice(index, 1)[0];
  return deleted;
}

export async function assignRiderToOrder(
  orderId: string,
  riderId: string
): Promise<{ order: MemoryOrder | null; rider: MemoryRider | null }> {
  const order = memoryOrders.find((o) => o.id === orderId);
  const rider = memoryRiders.find((r) => r.id === riderId);
  if (!order || !rider) {
    return { order: null, rider: null };
  }

  // Update order with rider information and set status to Out for Delivery
  order.assignedRiderId = rider.id;
  order.assignedRiderName = rider.name;
  order.assignedRiderPhone = rider.phone;
  order.status = 'Out for Delivery';

  // Update rider status and load
  rider.status = 'delivering';
  rider.activeOrdersCount = (rider.activeOrdersCount || 0) + 1;

  if (isPostgresConfigured()) {
    try {
      await db
        .update(orders)
        .set({ status: 'Out for Delivery' })
        .where(eq(orders.id, orderId));
    } catch (e) {
      console.warn('Postgres assign rider error:', e);
    }
  }

  return { order, rider };
}

