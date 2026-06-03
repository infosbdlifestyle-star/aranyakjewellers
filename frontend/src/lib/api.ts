const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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

  // Products
  async getProducts(filters?: Record<string, string>) {
    const params = new URLSearchParams(filters || {});
    const res = await fetch(`${this.baseUrl}/products?${params.toString()}`);
    return res.json();
  }

  async getProduct(slugOrId: string) {
    const res = await fetch(`${this.baseUrl}/products/${slugOrId}`);
    return res.json();
  }

  // Categories
  async getCategories() {
    const res = await fetch(`${this.baseUrl}/categories`);
    return res.json();
  }

  async getCategoryHierarchy() {
    const res = await fetch(`${this.baseUrl}/categories/hierarchy`);
    return res.json();
  }

  // Gold Price
  async getGoldPrices() {
    const res = await fetch(`${this.baseUrl}/gold-price`);
    return res.json();
  }

  // Banners
  async getBanners() {
    const res = await fetch(`${this.baseUrl}/banners`);
    return res.json();
  }

  // Auth
  async login(email: string, password: string) {
    const res = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  }

  async register(data: { name: string; email: string; password: string; mobile?: string }) {
    const res = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  }

  // Cart
  async getCart(token: string) {
    const res = await fetch(`${this.baseUrl}/cart`, {
      headers: this.getHeaders(token),
    });
    return res.json();
  }

  async addToCart(token: string, productId: string, quantity: number = 1) {
    const res = await fetch(`${this.baseUrl}/cart/add`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify({ productId, quantity }),
    });
    return res.json();
  }

  async removeFromCart(token: string, itemId: string) {
    const res = await fetch(`${this.baseUrl}/cart/item/${itemId}`, {
      method: 'DELETE',
      headers: this.getHeaders(token),
    });
    return res.json();
  }

  // Wishlist
  async getWishlist(token: string) {
    const res = await fetch(`${this.baseUrl}/wishlist`, {
      headers: this.getHeaders(token),
    });
    return res.json();
  }

  async toggleWishlist(token: string, productId: string) {
    const res = await fetch(`${this.baseUrl}/wishlist/toggle`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify({ productId }),
    });
    return res.json();
  }

  // Orders
  async createOrder(token: string, shippingAddress: any, items: any[], totalAmount: number) {
    const res = await fetch(`${this.baseUrl}/orders`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify({ shippingAddress, items, totalAmount }),
    });
    return res.json();
  }

  async getMyOrders(token: string) {
    const res = await fetch(`${this.baseUrl}/orders/my`, {
      headers: this.getHeaders(token),
    });
    return res.json();
  }

  // Admin Actions
  async updateGoldPrice(token: string, purity: number, pricePer10g: number) {
    const res = await fetch(`${this.baseUrl}/gold-price`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify({ purity, pricePer10g }),
    });
    return res.json();
  }

  async createProduct(token: string, data: any) {
    const res = await fetch(`${this.baseUrl}/products`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async updateProduct(token: string, id: string, data: any) {
    const res = await fetch(`${this.baseUrl}/products/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async deleteProduct(token: string, id: string) {
    const res = await fetch(`${this.baseUrl}/products/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(token),
    });
    return res.json();
  }
}

export const api = new ApiClient();
