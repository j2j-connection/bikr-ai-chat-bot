// Lightspeed Retail API Client with OAuth2 Authentication
class LightspeedClient {
  constructor() {
    // Get configuration from environment variables
    this.clientId = import.meta.env.VITE_LIGHTSPEED_CLIENT_ID || 'your_client_id_here';
    this.clientSecret = import.meta.env.VITE_LIGHTSPEED_CLIENT_SECRET || 'your_client_secret_here';
    this.callbackUrl = import.meta.env.VITE_LIGHTSPEED_CALLBACK_URL || 'http://localhost:5173/lightspeed/callback';
    
    // OAuth URLs
    this.authUrl = 'https://secure.retail.lightspeed.app/connect';
    
    // Storage keys
    this.ACCESS_TOKEN_KEY = 'lightspeed_access_token';
    this.REFRESH_TOKEN_KEY = 'lightspeed_refresh_token';
    this.DOMAIN_PREFIX_KEY = 'lightspeed_domain_prefix';
    this.TOKEN_EXPIRES_KEY = 'lightspeed_token_expires';

    // Demo flag: if no real token present, client returns mock data for safe UI flows
    this.isDemo = !import.meta.env.VITE_LIGHTSPEED_CLIENT_ID || !localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  // Generate a random state string for OAuth security
  generateState() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // Get the authorization URL for OAuth flow
  getAuthorizationUrl(domainPrefix) {
    const state = this.generateState();
    sessionStorage.setItem('oauth_state', state);
    sessionStorage.setItem('domain_prefix', domainPrefix);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.callbackUrl,
      state: state,
    });

    return `${this.authUrl}?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code, state, domainPrefix) {
    // Verify state parameter
    const storedState = sessionStorage.getItem('oauth_state');
    if (state !== storedState) {
      throw new Error('Invalid state parameter - potential CSRF attack');
    }

    const tokenUrl = `https://${domainPrefix}.retail.lightspeed.app/api/1.0/token`;
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: code,
        redirect_uri: this.callbackUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Token exchange failed: ${response.status} - ${errorData}`);
    }

    const tokenData = await response.json();
    
    // Store tokens and domain prefix
    const expiresAt = Date.now() + (tokenData.expires_in * 1000);
    
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokenData.access_token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokenData.refresh_token);
    localStorage.setItem(this.DOMAIN_PREFIX_KEY, domainPrefix);
    localStorage.setItem(this.TOKEN_EXPIRES_KEY, expiresAt.toString());

    // Clean up session storage
    sessionStorage.removeItem('oauth_state');
    sessionStorage.removeItem('domain_prefix');

    return tokenData;
  }

  // Refresh the access token
  async refreshAccessToken() {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    const domainPrefix = localStorage.getItem(this.DOMAIN_PREFIX_KEY);

    if (!refreshToken || !domainPrefix) {
      throw new Error('No refresh token or domain prefix available');
    }

    const tokenUrl = `https://${domainPrefix}.retail.lightspeed.app/api/1.0/token`;
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      // If refresh fails, clear stored tokens
      this.clearTokens();
      throw new Error('Token refresh failed - please re-authenticate');
    }

    const tokenData = await response.json();
    const expiresAt = Date.now() + (tokenData.expires_in * 1000);
    
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokenData.access_token);
    localStorage.setItem(this.TOKEN_EXPIRES_KEY, expiresAt.toString());
    
    if (tokenData.refresh_token) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, tokenData.refresh_token);
    }

    return tokenData;
  }

  // Get current access token, refreshing if necessary
  async getValidAccessToken() {
    const accessToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    const expiresAt = localStorage.getItem(this.TOKEN_EXPIRES_KEY);

    if (!accessToken) {
      throw new Error('No access token available - please authenticate');
    }

    // Check if token is expired (with 5 minute buffer)
    const now = Date.now();
    const expiry = parseInt(expiresAt) - (5 * 60 * 1000); // 5 minute buffer

    if (now >= expiry) {
      console.log('Token expired, refreshing...');
      await this.refreshAccessToken();
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }

    return accessToken;
  }

  // Make authenticated API request
  async apiRequest(endpoint, options = {}) {
    const domainPrefix = localStorage.getItem(this.DOMAIN_PREFIX_KEY);
    if (!domainPrefix) {
      throw new Error('No domain prefix available - please authenticate');
    }

    const accessToken = await this.getValidAccessToken();
    const baseUrl = `https://${domainPrefix}.retail.lightspeed.app/api/2.0`;
    
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token might be invalid, try refreshing once
        try {
          await this.refreshAccessToken();
          const newToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
          
          const retryResponse = await fetch(`${baseUrl}${endpoint}`, {
            ...options,
            headers: {
              'Authorization': `Bearer ${newToken}`,
              'Content-Type': 'application/json',
              ...options.headers,
            },
          });

          if (!retryResponse.ok) {
            throw new Error(`API request failed: ${retryResponse.status}`);
          }

          return await retryResponse.json();
        } catch (refreshError) {
          this.clearTokens();
          throw new Error('Authentication failed - please re-authenticate');
        }
      } else {
        const errorData = await response.text();
        throw new Error(`API request failed: ${response.status} - ${errorData}`);
      }
    }

    return await response.json();
  }

  // Convenience methods for common API calls
  async getRetailer() {
    // For demo purposes, return mock retailer data
    const domainPrefix = this.getDomainPrefix();
    if (!domainPrefix) {
      throw new Error('Not connected to Lightspeed');
    }
    
    return {
      name: `${domainPrefix} Bike Shop`,
      domain_prefix: domainPrefix,
      id: 'demo_' + domainPrefix,
      email: `admin@${domainPrefix}.com`,
      phone: '(555) 123-4567'
    };
  }

  async getItems(params = {}) {
    if (this.isDemo) {
      return {
        data: [
          { id: 1, name: 'Brake Pads', type: 'part', category: 'Brakes', price: 25.99, stock: 15 },
          { id: 2, name: 'Chain', type: 'part', category: 'Drivetrain', price: 35.50, stock: 8 },
          { id: 3, name: 'Tire 700x25c', type: 'part', category: 'Wheels', price: 45.00, stock: 12 },
          { id: 101, name: 'Brake Adjustment', type: 'service', category: 'Services', price: 25.00, stock: null },
          { id: 102, name: 'Gear Adjustment', type: 'service', category: 'Services', price: 30.00, stock: null }
        ]
      };
    }
    const queryString = new URLSearchParams(params).toString();
    return await this.apiRequest(`/items${queryString ? '?' + queryString : ''}`);
  }

  async getCustomers(params = {}) {
    if (this.isDemo) {
      return {
        data: [
          { id: 1, name: 'John Doe', email: 'john@example.com', phone: '(555) 123-4567', last_service: '2024-01-15' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '(555) 987-6543', last_service: '2024-02-20' }
        ]
      };
    }
    const queryString = new URLSearchParams(params).toString();
    return await this.apiRequest(`/customers${queryString ? '?' + queryString : ''}`);
  }

  async getCategories() {
    if (this.isDemo) {
      return { data: [
        { id: 1, name: 'Brakes' },
        { id: 2, name: 'Drivetrain' },
        { id: 3, name: 'Wheels' },
        { id: 4, name: 'Frame' },
        { id: 5, name: 'Accessories' },
        { id: 9, name: 'Services' }
      ] };
    }
    return await this.apiRequest('/categories');
  }

  // Services convenience
  async listServiceItems() {
    // Prefer dedicated Services category if present; else type=service
    const categories = await this.getCategories();
    const servicesCat = (categories.data || []).find(c => (c.name || '').toLowerCase() === 'services');
    if (servicesCat && !this.isDemo) {
      return this.getItems({ category_id: servicesCat.id, limit: 50 });
    }
    // Demo or fallback
    const items = await this.getItems({ limit: 100 });
    return { data: (items.data || []).filter(i => (i.type || '').toLowerCase() === 'service' || (i.category || '').toLowerCase() === 'services') };
  }

  async getSalesByCustomer(customerId, params = {}) {
    if (this.isDemo) {
      return { data: [
        { id: 'S-1001', customer_id: customerId, created_at: '2024-02-10', lines: [ { item_id: 101, name: 'Brake Adjustment', type: 'service', price: 25.00 } ] },
        { id: 'S-1002', customer_id: customerId, created_at: '2024-05-22', lines: [ { item_id: 2, name: 'Chain', type: 'part', price: 35.50 } ] }
      ] };
    }
    const query = new URLSearchParams({ customer_id: customerId, limit: 50, ...params }).toString();
    return await this.apiRequest(`/sales?${query}`);
  }

  async createEstimate({ customer_id, lines = [], note }) {
    // Feature flag this in UI; in demo we simulate success
    if (this.isDemo) {
      return { id: 'Q-12345', status: 'quote', customer_id, lines, note };
    }
    const payload = {
      customer_id,
      note,
      status: 'quote',
      line_items: lines.map(l => ({ item_id: l.item_id, quantity: l.quantity, price: l.price }))
    };
    return await this.apiRequest(`/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  // Check if user is authenticated
  isAuthenticated() {
    const accessToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    const domainPrefix = localStorage.getItem(this.DOMAIN_PREFIX_KEY);
    return !!(accessToken && domainPrefix);
  }

  // Get stored domain prefix
  getDomainPrefix() {
    return localStorage.getItem(this.DOMAIN_PREFIX_KEY);
  }

  // Clear all stored tokens
  clearTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.DOMAIN_PREFIX_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRES_KEY);
    sessionStorage.removeItem('oauth_state');
    sessionStorage.removeItem('domain_prefix');
  }

  // Disconnect from Lightspeed
  disconnect() {
    this.clearTokens();
  }
}

export const lightspeedClient = new LightspeedClient();
export default lightspeedClient; 