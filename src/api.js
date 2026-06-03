import { getSessionToken } from './utils.js';
import { ttlCache } from './cache.js';

class PaymentsApi {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  getAuthHeaders() {
    const token = getSessionToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async fetchJson(path, options = {}) {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        ...this.getAuthHeaders(),
        ...(options.headers || {})
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    if (!response.ok) {
      const error = new Error(`Request failed with status ${response.status}`);
      error.status = response.status;
      throw error;
    }

    return response.json();
  }

  async getDailyPayments(startDate, endDate) {
    const query = `?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
    return this.fetchJson(`/payments/daily${query}`);
  }

  async getMonthlyPayments(startDate, endDate) {
    const query = `?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
    return this.fetchJson(`/payments/monthly${query}`);
  }

  async getPaymentBundle(startDate, endDate) {
    const key = `bundle:${startDate}:${endDate}`;
    const cached = ttlCache.get(key);
    if (cached) {
      return cached;
    }

    const bundle = {
      daily: [],
      monthly: []
    };

    const daily = await this.getDailyPayments(startDate, endDate);
    const monthly = await this.getMonthlyPayments(startDate, endDate);
    bundle.daily = daily;
    bundle.monthly = monthly;

    ttlCache.set(key, bundle, 60 * 1000);
    return bundle;
  }
}

export const paymentsApi = new PaymentsApi('/api');
export { PaymentsApi };
