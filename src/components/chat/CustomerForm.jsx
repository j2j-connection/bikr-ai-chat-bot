
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Mail, Phone, Send, CheckCircle, History, AlertCircle, Store } from "lucide-react";
import { useLightspeedIntegration } from "@/hooks/useLightspeedIntegration";

export default function CustomerForm({ diagnosis, onSubmit, isLoading = false }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  const [customerData, setCustomerData] = useState(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const lightspeed = useLightspeedIntegration();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Enhanced form data with Lightspeed integration
    const enhancedFormData = {
      ...formData,
      lightspeedData: customerData,
      isExistingCustomer: customerData && !customerData.isNewCustomer
    };
    
    // Try to create service estimate in Lightspeed if connected
    if (lightspeed.isConnected() && diagnosis) {
      try {
        await lightspeed.createServiceEstimate(formData, diagnosis);
      } catch (error) {
        console.error('Failed to create Lightspeed estimate:', error);
        // Don't block the main flow if Lightspeed estimate fails
      }
    }
    
    onSubmit(enhancedFormData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Trigger customer lookup when email is entered (and Lightspeed is connected)
    if (field === 'email' && value.includes('@') && lightspeed.isConnected()) {
      handleCustomerLookup(value);
    }
  };

  const handleCustomerLookup = async (email) => {
    if (!email || !email.includes('@')) return;
    
    setIsLookingUp(true);
    try {
      const data = await lightspeed.enhanceDiagnosisWithCustomerData(email);
      setCustomerData(data);
      
      // Auto-fill form if customer exists
      if (data && !data.isNewCustomer && data.customer) {
        setFormData(prev => ({
          ...prev,
          name: data.customer.name || prev.name,
          phone: data.customer.phone || prev.phone
        }));
      }
    } catch (error) {
      console.error('Customer lookup failed:', error);
    } finally {
      setIsLookingUp(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent': return 'border-red-200 bg-red-50';
      case 'high': return 'border-orange-200 bg-orange-50';
      case 'moderate': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-green-200 bg-green-50';
    }
  };

  const getUrgencyTextColor = (urgency) => {
    switch (urgency) {
      case 'urgent': return 'text-red-800';
      case 'high': return 'text-orange-800';
      case 'moderate': return 'text-yellow-800';
      default: return 'text-green-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="bg-white shadow-lg border-slate-200">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-emerald-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
            Diagnostic Complete
          </CardTitle>
          <p className="text-slate-600">
            Professional diagnosis report ready for service coordination
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Professional Diagnosis Summary */}
          <div className={`rounded-lg p-6 border-2 ${getUrgencyColor(diagnosis.urgency)}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">{diagnosis.issue}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getUrgencyTextColor(diagnosis.urgency)}`}>
                {diagnosis.urgency.toUpperCase()} PRIORITY
              </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm font-semibold text-slate-700 mb-1">Technical Description:</div>
                <p className="text-slate-900">{diagnosis.description}</p>
              </div>
              <div className="flex justify-between text-sm">
                <span><strong>Est. Service Time:</strong> {diagnosis.estimated_service_time}</span>
                <span><strong>Priority Level:</strong> {diagnosis.urgency}</span>
              </div>
            </div>
          </div>

          {/* Lightspeed Integration Status */}
          {lightspeed.isConnected() && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Store className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Lightspeed connected - customer lookup enabled
              </span>
            </div>
          )}

          {/* Customer History Display */}
          {customerData && !customerData.isNewCustomer && (
            <Alert className="border-green-200 bg-green-50">
              <History className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <div className="space-y-2">
                  <p className="font-medium">Existing Customer Found!</p>
                  <div className="text-sm space-y-1">
                    <p>• Total services: {customerData.totalServices}</p>
                    {customerData.lastService && (
                      <p>• Last service: {new Date(customerData.lastService.created_at).toLocaleDateString()}</p>
                    )}
                    {customerData.commonIssues.length > 0 && (
                      <div>
                        <p>• Previous issues: {customerData.commonIssues.slice(0, 3).map(issue => issue.issue).join(', ')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {customerData && customerData.isNewCustomer && lightspeed.isConnected() && (
            <Alert className="border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <p className="font-medium">New Customer</p>
                <p className="text-sm mt-1">This customer will be added to your Lightspeed database.</p>
              </AlertDescription>
            </Alert>
          )}

          {/* Customer Information Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <h4 className="font-semibold text-slate-900 mb-2">Customer Information</h4>
              <p className="text-sm text-slate-600">
                Provide contact details for service coordination and follow-up
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-medium">Full Name *</Label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="pl-10 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700 font-medium">Phone Number</Label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="pl-10 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">
                Email Address *
                {lightspeed.isConnected() && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Auto-lookup enabled
                  </Badge>
                )}
              </Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input
                  id="email"
                  type="email"
                  placeholder="customer@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10 pr-10 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
                {isLookingUp && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              {lightspeed.isConnected() && (
                <p className="text-xs text-slate-500">
                  Customer data will be automatically looked up from Lightspeed
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg py-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing Report...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Send Diagnostic Report
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
