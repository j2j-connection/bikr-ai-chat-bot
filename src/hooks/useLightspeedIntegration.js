import { useState, useCallback } from 'react';
import lightspeedClient from '@/api/lightspeedClient';

export function useLightspeedIntegration() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if Lightspeed is connected
  const isConnected = useCallback(() => {
    return lightspeedClient.isAuthenticated();
  }, []);

  // Search customers by email or phone
  const searchCustomers = useCallback(async (query) => {
    if (!isConnected()) {
      throw new Error('Lightspeed not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Search by email or phone
      const customers = await lightspeedClient.getCustomers({
        search: query,
        limit: 10
      });

      return customers.data || [];
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get customer by ID with full details
  const getCustomer = useCallback(async (customerId) => {
    if (!isConnected()) {
      throw new Error('Lightspeed not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const customer = await lightspeedClient.apiRequest(`/customers/${customerId}`);
      return customer;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get customer service history
  const getCustomerServiceHistory = useCallback(async (customerId) => {
    if (!isConnected()) {
      throw new Error('Lightspeed not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get sales/service records for the customer
      const sales = await lightspeedClient.apiRequest('/sales', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Filter sales by customer ID
      const customerSales = sales.data?.filter(sale => 
        sale.customer_id === customerId
      ) || [];

      return customerSales;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Search bike-related inventory items
  const searchBikeParts = useCallback(async (query, category = null) => {
    if (!isConnected()) {
      throw new Error('Lightspeed not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = {
        search: query,
        limit: 20
      };

      if (category) {
        params.category_id = category;
      }

      const items = await lightspeedClient.getItems(params);
      return items.data || [];
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get bike categories
  const getBikeCategories = useCallback(async () => {
    if (!isConnected()) {
      throw new Error('Lightspeed not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const categories = await lightspeedClient.getCategories();
      
      // Filter for bike-related categories
      const bikeCategories = categories.data?.filter(cat => 
        cat.name?.toLowerCase().includes('bike') ||
        cat.name?.toLowerCase().includes('bicycle') ||
        cat.name?.toLowerCase().includes('cycle') ||
        cat.name?.toLowerCase().includes('part') ||
        cat.name?.toLowerCase().includes('component')
      ) || [];

      return bikeCategories;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a service estimate/quote
  const createServiceEstimate = useCallback(async (customerData, diagnosis, parts = []) => {
    if (!isConnected()) {
      throw new Error('Lightspeed not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      // This would create a quote/estimate in Lightspeed
      // The exact implementation depends on your Lightspeed setup and permissions
      
      const estimate = {
        customer_email: customerData.email,
        customer_name: customerData.name,
        customer_phone: customerData.phone,
        diagnosis: {
          issue: diagnosis.issue,
          description: diagnosis.description,
          urgency: diagnosis.urgency,
          estimated_service_time: diagnosis.estimated_service_time
        },
        recommended_parts: parts,
        created_via: 'BikeBot Diagnostics',
        status: 'estimate',
        notes: `AI Diagnostic Report: ${diagnosis.description}`
      };

      // In a real implementation, you might create this as a sale with status 'quote'
      // or use a custom field to track diagnostic estimates
      console.log('Service estimate created:', estimate);
      
      return estimate;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Enhanced customer lookup for diagnostics
  const enhanceDiagnosisWithCustomerData = useCallback(async (customerEmail) => {
    if (!isConnected() || !customerEmail) {
      return null;
    }

    try {
      // Search for customer by email
      const customers = await searchCustomers(customerEmail);
      
      if (customers.length === 0) {
        return { isNewCustomer: true };
      }

      const customer = customers[0];
      
      // Get service history
      const serviceHistory = await getCustomerServiceHistory(customer.id);
      
      // Analyze service history for patterns
      const bikeServiceHistory = serviceHistory.filter(sale => 
        sale.notes?.toLowerCase().includes('bike') ||
        sale.notes?.toLowerCase().includes('bicycle') ||
        sale.items?.some(item => 
          item.name?.toLowerCase().includes('bike') ||
          item.name?.toLowerCase().includes('bicycle')
        )
      );

      return {
        isNewCustomer: false,
        customer: customer,
        serviceHistory: bikeServiceHistory,
        lastService: bikeServiceHistory[0] || null,
        totalServices: bikeServiceHistory.length,
        commonIssues: extractCommonIssues(bikeServiceHistory)
      };
    } catch (err) {
      console.error('Error enhancing diagnosis with customer data:', err);
      return null;
    }
  }, [searchCustomers, getCustomerServiceHistory]);

  // Helper function to extract common issues from service history
  const extractCommonIssues = (serviceHistory) => {
    const issues = [];
    
    serviceHistory.forEach(service => {
      if (service.notes) {
        const notes = service.notes.toLowerCase();
        
        // Common bike issues to look for
        const commonProblems = [
          'brake', 'chain', 'gear', 'tire', 'wheel', 'derailleur', 
          'cable', 'shifter', 'pedal', 'crank', 'bottom bracket',
          'headset', 'fork', 'suspension'
        ];
        
        commonProblems.forEach(problem => {
          if (notes.includes(problem)) {
            issues.push({
              issue: problem,
              date: service.created_at,
              notes: service.notes
            });
          }
        });
      }
    });

    return issues;
  };

  return {
    // State
    isLoading,
    error,
    
    // Connection
    isConnected,
    
    // Customer functions
    searchCustomers,
    getCustomer,
    getCustomerServiceHistory,
    enhanceDiagnosisWithCustomerData,
    
    // Inventory functions
    searchBikeParts,
    getBikeCategories,
    
    // Service functions
    createServiceEstimate,
    
    // Utility
    clearError: () => setError(null)
  };
} 