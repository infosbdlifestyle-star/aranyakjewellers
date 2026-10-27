export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
  }

  private getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async safeJson(res: Response, fallback: any = []) {
    try {
      if (!res || !res.ok) return fallback;
      const text = await res.text();
      if (!text || text.trim().startsWith('<') || text.includes('Internal Server Error')) {
        return fallback;
      }
      return JSON.parse(text);
    } catch {
      return fallback;
    }
  }

  // Generic methods
  private async get(path: string, tokenOrFallback?: string | any, possibleFallback: any = []) {
    let token: string | undefined = undefined;
    let fallback = possibleFallback;
    if (typeof tokenOrFallback === 'string') {
      token = tokenOrFallback;
    } else if (tokenOrFallback !== undefined) {
      fallback = tokenOrFallback;
    }
    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        cache: 'no-store',
        headers: this.getHeaders(token),
      });
      return await this.safeJson(res, fallback);
    } catch {
      return fallback;
    }
  }

  private async post(path: string, token: string | undefined, data: any, fallback: any = null) {
    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify(data),
      });
      return this.safeJson(res, fallback);
    } catch { return fallback; }
  }

  private async put(path: string, token: string | undefined, data: any, fallback: any = null) {
    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        method: 'PUT',
        headers: this.getHeaders(token),
        body: JSON.stringify(data),
      });
      return this.safeJson(res, fallback);
    } catch { return fallback; }
  }

  private async del(path: string, token: string | undefined, fallback: any = { success: true }) {
    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        method: 'DELETE',
        headers: this.getHeaders(token),
      });
      return this.safeJson(res, fallback);
    } catch { return fallback; }
  }

  // Products
  async getProducts(filters?: Record<string, string>) {
    let query = '';
    if (filters) query = '?' + new URLSearchParams(filters).toString();
    return this.get(`/products${query}`, []);
  }
  async getProduct(slugOrId: string) { return this.get(`/products/slug/${slugOrId}`, null); }
  async createProduct(token: string, data: any) { return this.post('/products', token, data); }
  async updateProduct(token: string, id: string, data: any) { return this.put(`/products/${id}`, token, data); }
  async deleteProduct(token: string, id: string) { return this.del(`/products/${id}`, token); }

  // Categories
  async getCategories() { return this.get('/categories', []); }
  async getCategoryHierarchy() { return this.get('/categories/hierarchy', []); }
  async createCategory(token: string, data: any) { return this.post('/categories', token, data); }
  async updateCategory(token: string, id: string, data: any) { return this.put(`/categories/${id}`, token, data); }
  async deleteCategory(token: string, id: string) { return this.del(`/categories/${id}`, token); }

  // Banners
  async getBanners() { return this.get('/banners', []); }
  async createBanner(token: string, data: any) { return this.post('/banners', token, data); }
  async updateBanner(token: string, id: string, data: any) { return this.put(`/banners/${id}`, token, data); }
  async deleteBanner(token: string, id: string) { return this.del(`/banners/${id}`, token); }

  // Stores
  async getStores() { return this.get('/stores', []); }
  async createStore(token: string, data: any) { return this.post('/stores', token, data); }
  async updateStore(token: string, id: string, data: any) { return this.put(`/stores/${id}`, token, data); }
  async deleteStore(token: string, id: string) { return this.del(`/stores/${id}`, token); }

  // Settings
  async getSettings(): Promise<Record<string, string>> {
    const fallbackSettings: Record<string, string> = {
      contact_email: 'aranyakjeweller@gmail.com',
      contact_phone: '+919436501506',
      marquee_text: '🌸 আরণ্যক জুয়েলার্স বিশেষ পুজো অফার',
      social_instagram: 'https://instagram.com/aranyakjewellers',
      social_facebook: 'https://facebook.com/aranyakjewellers',
      home_editorial_image: '/hero-necklace.png',
      home_bridal_image: '/bridal-edit.png',
      home_showroom_image: '/showroom.jpg',
      about_p1: 'Founded in 1995...',
      about_p2: 'We believe that every piece of jewelry carries a soul...'
    };
    try {
      const data = await this.get('/settings', []);
      if (Array.isArray(data) && data.length > 0) {
        const map: Record<string, string> = {};
        data.forEach((s: any) => { if (s.key) map[s.key] = s.value; });
        return { ...fallbackSettings, ...map };
      }
    } catch {}
    return fallbackSettings;
  }
  async updateSettings(token: string, settingsMap: Record<string, string>) {
    const payload = Object.keys(settingsMap).map(key => ({ key, value: settingsMap[key] }));
    return this.post('/settings/bulk', token, payload, { success: true });
  }

  // Auth
  async login(email: string, password: string, totpCode?: string) {
    return this.post('/auth/login', undefined, { email: email.toLowerCase().trim(), password: password.trim(), totpCode }, { statusCode: 500, message: 'Network connection failed' });
  }
  async register(data: { name: string; email: string; password: string; mobile?: string }) {
    return this.post('/auth/register', undefined, data, { statusCode: 500 });
  }
  async generateTotp(token: string) { return this.post('/auth/totp/generate', token, {}, { error: 'Failed' }); }
  async enableTotp(token: string, totpToken: string) { return this.post('/auth/totp/enable', token, { token: totpToken }, { error: 'Failed' }); }
  async disableTotp(token: string) { return this.post('/auth/totp/disable', token, {}, { error: 'Failed' }); }
  async forgotPassword(email: string) { return this.post('/auth/forgot-password', undefined, { email }, { error: 'Failed' }); }
  async resetPassword(token: string, password: string) { return this.post('/auth/reset-password', undefined, { token, password }, { error: 'Failed' }); }
  async getProfile(token: string) { return this.get('/auth/me', token, null); }
  async updateProfile(token: string, data: { name?: string; mobile?: string; currentPassword?: string; newPassword?: string }) {
    return this.put('/auth/me', token, data);
  }
  async addAddress(token: string, address: { fullName: string; street: string; city: string; state: string; zip: string; phone: string; isDefault?: boolean }) {
    return this.post('/auth/addresses', token, address);
  }
  async deleteAddress(token: string, addressId: string) {
    return this.del(`/auth/addresses/${addressId}`, token);
  }
  async setDefaultAddress(token: string, addressId: string) {
    return this.put(`/auth/addresses/${addressId}/default`, token, {});
  }

  // Website Media Manager
  async getMedia(section?: string) {
    const query = section && section !== 'all' ? `?section=${encodeURIComponent(section)}` : '';
    return this.get(`/media${query}`, []);
  }
  async getMediaMap(): Promise<Record<string, string>> {
    return this.get('/media/map', {});
  }
  async createMedia(token: string, data: any) {
    return this.post('/media', token, data);
  }
  async updateMedia(token: string, id: string, data: any) {
    return this.put(`/media/${id}`, token, data);
  }
  async replaceMedia(token: string, id: string, data: { url: string; altText?: string }) {
    return this.post(`/media/${id}/replace`, token, data);
  }
  async restoreMedia(token: string, id: string) {
    return this.post(`/media/${id}/restore`, token, {});
  }
  async deleteMedia(token: string, id: string) {
    return this.del(`/media/${id}`, token);
  }
  async seedDefaultMedia(token: string) {
    return this.post('/media/seed-defaults', token, {});
  }

  // Cart
  async getCart(token: string) { return this.get('/cart', token, { items: [] }); }
  async addToCart(token: string, productId: string, quantity: number = 1) { return this.post('/cart/add', token, { productId, quantity }, { error: 'Failed' }); }
  async removeFromCart(token: string, itemId: string) { return this.del(`/cart/item/${itemId}`, token, { error: 'Failed' }); }

  // Wishlist
  async getWishlist(token: string) { return this.get('/wishlist', token, []); }
  async toggleWishlist(token: string, productId: string) { return this.post('/wishlist/toggle', token, { productId }, { error: 'Failed' }); }

  // Orders
  async createOrder(token: string, shippingAddress: any, items?: any[], totalAmount?: number) { return this.post('/orders', token, { shippingAddress, items, totalAmount }, { error: 'Failed' }); }
  async getMyOrders(token: string) { return this.get('/orders/my', token, []); }

  // Users
  async getUsers(token: string) { return this.get('/users', []); }
  async createUser(token: string, data: any) { return this.post('/users', token, data); }
  async updateUser(token: string, id: string, data: any) { return this.put(`/users/${id}`, token, data); }
  async deleteUser(token: string, id: string) { return this.del(`/users/${id}`, token); }

  // Image Upload
  async uploadImage(token: string, file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const headers: HeadersInit = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${this.baseUrl}/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });
      return this.safeJson(res, null);
    } catch (e: any) {
      return { error: e.message };
    }
  }

  // Gold Prices
  async getGoldPrices() { return this.get('/gold-rates', []); }
  async updateGoldPrice(token: string, purity: number, pricePer10g: number) { return this.put(`/gold-rates/${purity}`, token, { pricePer10g }); }
  async resetLiveGoldPrices() { return this.post('/gold-rates/reset', undefined, {}); }
}

export const api = new ApiClient();
