import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Store, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Shield,
  Zap
} from 'lucide-react';
import lightspeedClient from '@/api/lightspeedClient';

export default function LightspeedConnect() {
  const navigate = useNavigate();
  const [domainPrefix, setDomainPrefix] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [isAlreadyConnected, setIsAlreadyConnected] = useState(false);

  useEffect(() => {
    // Check if already connected
    if (lightspeedClient.isAuthenticated()) {
      setIsAlreadyConnected(true);
    }
  }, []);

  const handleConnect = async (e) => {
    e.preventDefault();
    
    if (!domainPrefix.trim()) {
      setError('Please enter your store domain prefix');
      return;
    }

    // Validate domain prefix format (basic check)
    const cleanPrefix = domainPrefix.trim().toLowerCase();
    if (!/^[a-z0-9-]+$/.test(cleanPrefix)) {
      setError('Domain prefix should only contain lowercase letters, numbers, and hyphens');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      // Generate authorization URL and redirect
      const authUrl = lightspeedClient.getAuthorizationUrl(cleanPrefix);
      console.log('Redirecting to Lightspeed authorization:', authUrl);
      
      // Redirect to Lightspeed OAuth
      window.location.href = authUrl;
      
    } catch (err) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to initiate connection');
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    lightspeedClient.disconnect();
    setIsAlreadyConnected(false);
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  if (isAlreadyConnected) {
    const domainPrefix = lightspeedClient.getDomainPrefix();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-slate-900">
              Already Connected
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-medium text-green-800 mb-2">
                Connected to Lightspeed Store:
              </p>
              <p className="text-green-700 font-mono text-sm">
                {domainPrefix}.retail.lightspeed.app
              </p>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleGoToDashboard}
                className="flex-1"
              >
                Go to Dashboard
              </Button>
              <Button 
                onClick={handleDisconnect}
                variant="outline"
                className="flex-1"
              >
                Disconnect
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
            Connect to Lightspeed
          </CardTitle>
          <p className="text-slate-600">
            Connect your Lightspeed Retail store to BikeBot for enhanced diagnostics and inventory integration
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Benefits */}
          <div className="grid gap-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-900 text-sm">Enhanced Diagnostics</p>
                <p className="text-blue-700 text-xs mt-1">
                  Access customer history and bike service records for better diagnosis
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-900 text-sm">Inventory Integration</p>
                <p className="text-green-700 text-xs mt-1">
                  Check part availability and create service orders directly
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <Shield className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-purple-900 text-sm">Secure Connection</p>
                <p className="text-purple-700 text-xs mt-1">
                  OAuth2 authentication ensures your data remains secure
                </p>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Connection Form */}
          <form onSubmit={handleConnect} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="domain-prefix" className="text-slate-700 font-medium">
                Store Domain Prefix
              </Label>
              <div className="relative">
                <Input
                  id="domain-prefix"
                  type="text"
                  placeholder="mystoreprefix"
                  value={domainPrefix}
                  onChange={(e) => setDomainPrefix(e.target.value)}
                  className="pr-32"
                  disabled={isConnecting}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-xs text-slate-400">.retail.lightspeed.app</span>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Find this in your Lightspeed URL: https://
                <strong>mystoreprefix</strong>.retail.lightspeed.app
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isConnecting}
            >
              {isConnecting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Connecting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Connect to Lightspeed
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>

          {/* Help Text */}
          <div className="border-t pt-4 space-y-3">
            <p className="text-xs text-slate-600 font-medium">What happens next:</p>
            <ol className="text-xs text-slate-500 space-y-1 ml-4 list-decimal">
              <li>You'll be redirected to Lightspeed's secure login</li>
              <li>Log in with your admin credentials</li>
              <li>Authorize BikeBot to access your store data</li>
              <li>You'll be redirected back to complete the setup</li>
            </ol>
            
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-3">
              <ExternalLink className="w-3 h-3" />
              <span>This will open Lightspeed in a new tab</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 