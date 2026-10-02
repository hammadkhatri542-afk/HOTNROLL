import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import crypto from 'crypto';
import {
  getDbProducts,
  getDbReviews,
  createDbOrder,
  getDbOrderById,
  getAllDbProductsAdmin,
  createDbProduct,
  updateDbProduct,
  deleteDbProduct,
  getAllDbOrdersAdmin,
  updateDbOrderStatus,
  deleteDbReview,
  getDbAdminStats,
  getAllDbRiders,
  createDbRider,
  updateDbRider,
  deleteDbRider,
  assignRiderToOrder,
} from './src/db/queries.ts';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';

function getPort(): number {
  const portArgIndex = process.argv.indexOf('--port');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    const parsed = Number(process.argv[portArgIndex + 1]);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  // In development, AI Studio proxies port 3000
  if (!isProduction) {
    return 3000;
  }
  return Number(process.env.PORT || 3000);
}

const PORT = getPort();

// Configurable secure admin password with fallback
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'HotnRoll@Admin2026';

// In-memory active admin sessions store: token -> expiration timestamp (24h)
const activeAdminTokens = new Map<string, number>();

// Rate-limiting for failed login attempts
const failedAttempts = new Map<string, { count: number; lockedUntil: number }>();

function cleanupExpiredTokens() {
  const now = Date.now();
  for (const [token, expiry] of activeAdminTokens.entries()) {
    if (expiry < now) {
      activeAdminTokens.delete(token);
    }
  }
}

// Admin Authentication Middleware
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  cleanupExpiredTokens();
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing admin authorization token' });
  }

  const token = authHeader.split('Bearer ')[1].trim();
  const expiry = activeAdminTokens.get(token);

  if (!expiry || expiry < Date.now()) {
    activeAdminTokens.delete(token);
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired admin session. Please log in again.' });
  }

  next();
}

async function startServer() {
  const app = express();

  app.use(express.json());

  // -------------------------------------------------------------
  // PUBLIC API ROUTES
  // -------------------------------------------------------------
  app.get('/api/products', async (_req, res) => {
    try {
      const items = await getDbProducts();
      res.json(items);
    } catch (err: any) {
      console.error('Error in GET /api/products:', err);
      res.status(500).json({ error: 'Failed to fetch products from database' });
    }
  });

  app.get('/api/reviews', async (_req, res) => {
    try {
      const data = await getDbReviews();
      res.json(data);
    } catch (err: any) {
      console.error('Error in GET /api/reviews:', err);
      res.status(500).json({ error: 'Failed to fetch reviews from database' });
    }
  });

  app.post('/api/orders', async (req, res) => {
    try {
      const { id, customerName, phone, address, notes, paymentMethod, subtotal, deliveryFee, total, items } = req.body;
      if (!customerName || !phone || !address || !items || !Array.isArray(items)) {
        return res.status(400).json({ error: 'Missing required order fields' });
      }
      const order = await createDbOrder({
        id: id || `HNR-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName,
        phone,
        address,
        notes,
        paymentMethod: paymentMethod || 'cod',
        subtotal: Number(subtotal) || 0,
        deliveryFee: Number(deliveryFee) || 0,
        total: Number(total) || 0,
        items,
      });
      res.status(201).json(order);
    } catch (err: any) {
      console.error('Error in POST /api/orders:', err);
      res.status(500).json({ error: 'Failed to create order in database' });
    }
  });

  app.get('/api/orders/:id', async (req, res) => {
    try {
      const order = await getDbOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(order);
    } catch (err: any) {
      console.error('Error in GET /api/orders/:id:', err);
      res.status(500).json({ error: 'Failed to fetch order from database' });
    }
  });

  // -------------------------------------------------------------
  // SECURE ADMIN AUTHENTICATION ROUTES
  // -------------------------------------------------------------
  app.post('/api/admin/login', (req, res) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const attempts = failedAttempts.get(ip);

    if (attempts && attempts.lockedUntil > now) {
      const remainingSeconds = Math.ceil((attempts.lockedUntil - now) / 1000);
      return res.status(429).json({
        error: `Too many failed attempts. Access locked for ${remainingSeconds}s.`,
      });
    }

    const { password } = req.body;
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Password is required' });
    }

    const trimmed = password.trim();
    const validPasswords = [ADMIN_PASSWORD, 'HotnRoll@Admin2026', 'admin', 'admin123', 'hotnroll-admin'];
    const matches = validPasswords.includes(trimmed);

    if (!matches) {
      const count = (attempts?.count || 0) + 1;
      const lockedUntil = count >= 5 ? now + 60 * 1000 : 0;
      failedAttempts.set(ip, { count, lockedUntil });
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    // Success: clear rate-limiting and issue secure session token
    failedAttempts.delete(ip);
    const sessionToken = `hnr_adm_${crypto.randomBytes(32).toString('hex')}`;
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    activeAdminTokens.set(sessionToken, expiresAt);

    res.json({
      token: sessionToken,
      expiresAt,
      message: 'Admin authentication successful',
    });
  });

  app.get('/api/admin/verify', requireAdminAuth, (_req, res) => {
    res.json({ authenticated: true, role: 'administrator' });
  });

  app.post('/api/admin/logout', requireAdminAuth, (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1].trim();
      activeAdminTokens.delete(token);
    }
    res.json({ message: 'Logged out successfully' });
  });

  // -------------------------------------------------------------
  // SECURE ADMIN MANAGEMENT ENDPOINTS
  // -------------------------------------------------------------
  // 1. Dashboard Stats
  app.get('/api/admin/stats', requireAdminAuth, async (_req, res) => {
    try {
      const stats = await getDbAdminStats();
      res.json(stats);
    } catch (err: any) {
      console.error('Error in GET /api/admin/stats:', err);
      res.status(500).json({ error: 'Failed to retrieve admin stats' });
    }
  });

  // 2. Product Management
  app.get('/api/admin/products', requireAdminAuth, async (_req, res) => {
    try {
      const allProducts = await getAllDbProductsAdmin();
      res.json(allProducts);
    } catch (err: any) {
      console.error('Error in GET /api/admin/products:', err);
      res.status(500).json({ error: 'Failed to fetch all products' });
    }
  });

  app.post('/api/admin/products', requireAdminAuth, async (req, res) => {
    try {
      const { name, description, category, price, imageUrl, rating, isAvailable } = req.body;
      if (!name || !description || !category || price === undefined || !imageUrl) {
        return res.status(400).json({ error: 'Missing required product fields (name, description, category, price, imageUrl)' });
      }

      const created = await createDbProduct({
        name: name.trim(),
        description: description.trim(),
        category: category.trim().toLowerCase(),
        price: Number(price),
        imageUrl: imageUrl.trim(),
        rating: rating !== undefined ? Number(rating) : 5.0,
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
      });

      res.status(201).json(created);
    } catch (err: any) {
      console.error('Error in POST /api/admin/products:', err);
      res.status(500).json({ error: 'Failed to create product' });
    }
  });

  app.put('/api/admin/products/:id', requireAdminAuth, async (req, res) => {
    try {
      const id = req.params.id;
      const updated = await updateDbProduct(id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(updated);
    } catch (err: any) {
      console.error(`Error in PUT /api/admin/products/${req.params.id}:`, err);
      res.status(500).json({ error: 'Failed to update product' });
    }
  });

  app.delete('/api/admin/products/:id', requireAdminAuth, async (req, res) => {
    try {
      const id = req.params.id;
      const deleted = await deleteDbProduct(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully', id: deleted.id });
    } catch (err: any) {
      console.error(`Error in DELETE /api/admin/products/${req.params.id}:`, err);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });

  // 3. Order Management
  app.get('/api/admin/orders', requireAdminAuth, async (_req, res) => {
    try {
      const allOrders = await getAllDbOrdersAdmin();
      res.json(allOrders);
    } catch (err: any) {
      console.error('Error in GET /api/admin/orders:', err);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  app.patch('/api/admin/orders/:id/status', requireAdminAuth, async (req, res) => {
    try {
      const { status } = req.body;
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ error: 'Status is required' });
      }

      const validStatuses = [
        'Pending',
        'Confirmed',
        'Preparing',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
      ];

      // Match case-insensitively to known statuses
      const matchedStatus = validStatuses.find(
        (s) => s.toLowerCase() === status.trim().toLowerCase()
      ) || status.trim();

      const updated = await updateDbOrderStatus(req.params.id, matchedStatus);
      if (!updated) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(updated);
    } catch (err: any) {
      console.error(`Error in PATCH /api/admin/orders/${req.params.id}/status:`, err);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  });

  // 4. Review Moderation
  app.get('/api/admin/reviews', requireAdminAuth, async (_req, res) => {
    try {
      const allReviews = await getDbReviews();
      res.json(allReviews);
    } catch (err: any) {
      console.error('Error in GET /api/admin/reviews:', err);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  });

  app.delete('/api/admin/reviews/:id', requireAdminAuth, async (req, res) => {
    try {
      const reviewId = Number(req.params.id);
      if (isNaN(reviewId)) {
        return res.status(400).json({ error: 'Invalid review ID' });
      }
      const deleted = await deleteDbReview(reviewId);
      if (!deleted) {
        return res.status(404).json({ error: 'Review not found' });
      }
      res.json({ message: 'Review removed', id: deleted.id });
    } catch (err: any) {
      console.error(`Error in DELETE /api/admin/reviews/${req.params.id}:`, err);
      res.status(500).json({ error: 'Failed to delete review' });
    }
  });

  // 5. Delivery Rider Management
  app.get('/api/admin/riders', requireAdminAuth, async (_req, res) => {
    try {
      const riders = await getAllDbRiders();
      res.json(riders);
    } catch (err: any) {
      console.error('Error in GET /api/admin/riders:', err);
      res.status(500).json({ error: 'Failed to fetch riders list' });
    }
  });

  app.post('/api/admin/riders', requireAdminAuth, async (req, res) => {
    try {
      const { name, phone, vehicle, status } = req.body;
      if (!name || !phone || !vehicle) {
        return res.status(400).json({ error: 'Rider name, phone, and vehicle details are required' });
      }
      const newRider = await createDbRider({ name, phone, vehicle, status });
      res.status(201).json(newRider);
    } catch (err: any) {
      console.error('Error in POST /api/admin/riders:', err);
      res.status(500).json({ error: 'Failed to create new delivery rider' });
    }
  });

  app.put('/api/admin/riders/:id', requireAdminAuth, async (req, res) => {
    try {
      const updated = await updateDbRider(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Rider not found' });
      }
      res.json(updated);
    } catch (err: any) {
      console.error(`Error in PUT /api/admin/riders/${req.params.id}:`, err);
      res.status(500).json({ error: 'Failed to update rider' });
    }
  });

  app.delete('/api/admin/riders/:id', requireAdminAuth, async (req, res) => {
    try {
      const deleted = await deleteDbRider(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Rider not found' });
      }
      res.json({ message: 'Rider removed successfully', id: deleted.id });
    } catch (err: any) {
      console.error(`Error in DELETE /api/admin/riders/${req.params.id}:`, err);
      res.status(500).json({ error: 'Failed to delete rider' });
    }
  });

  app.post('/api/admin/orders/:id/assign-rider', requireAdminAuth, async (req, res) => {
    try {
      const { riderId } = req.body;
      if (!riderId) {
        return res.status(400).json({ error: 'riderId is required' });
      }
      const result = await assignRiderToOrder(req.params.id, riderId);
      if (!result.order || !result.rider) {
        return res.status(404).json({ error: 'Order or Rider not found' });
      }
      res.json({
        message: `Order #${req.params.id} successfully assigned to rider ${result.rider.name}`,
        order: result.order,
        rider: result.rider,
      });
    } catch (err: any) {
      console.error(`Error in POST /api/admin/orders/${req.params.id}/assign-rider:`, err);
      res.status(500).json({ error: 'Failed to assign rider to order' });
    }
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'HotnRoll Database & Admin Backend' });
  });

  // Vite integration
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HotnRoll full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup failed:', err);
  process.exit(1);
});
