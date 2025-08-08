import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import lightspeedClient from '@/api/lightspeedClient';

export default function LightspeedCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [error, setError] = useState(null);
  const [retailerInfo, setRetailerInfo] = useState(null);

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      const domainPrefix = sessionStorage.getItem('domain_prefix');

      // Check for OAuth errors
      if (error) {
        throw new Error(`OAuth error: ${error}`);
      }

      // Check for missing parameters
      if (!code || !state) {
        throw new Error('Missing authorization code or state parameter');
      }

      if (!domainPrefix) {
        throw new Error('Missing domain prefix - please restart the connection process');
      }

      // For demo purposes, we'll simulate a successful connection
      // In a real implementation, you'd need a backend server to handle the token exchange
      console.log('Simulating successful OAuth callback...');
      
      // Store demo connection data
      localStorage.setItem('lightspeed_access_token', 'demo_token_' + Date.now());
      localStorage.setItem('lightspeed_domain_prefix', domainPrefix);
      localStorage.setItem('lightspeed_token_expires', (Date.now() + 3600000).toString());
      
      // Simulate retailer info
      const retailer = {
        name: `${domainPrefix} Bike Shop`,
        domain_prefix: domainPrefix,
        id: 'demo_' + domainPrefix
      };
      setRetailerInfo(retailer);
      
      setStatus('success');
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard?connected=true');
      }, 3000);

    } catch (err) {
      console.error('OAuth callback error:', err);
      setError(err.message);
      setStatus('error');
    }
  };

  const handleRetry = () => {
    navigate('/lightspeed/connect');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-900">
            Lightspeed Connection
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {status === 'processing' && (
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
              <div>
                <p className="font-medium text-slate-900">Connecting to Lightspeed...</p>
                <p className="text-sm text-slate-600 mt-1">
                  Please wait while we establish the connection
                </p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              <div>
                <p className="font-medium text-slate-900">Successfully Connected!</p>
                <p className="text-sm text-slate-600 mt-1">
                  Your Lightspeed store is now connected to BikeBot
                </p>
              </div>
              
              {retailerInfo && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
                  <p className="text-sm font-medium text-green-800">Store Information:</p>
                  <p className="text-sm text-green-700 mt-1">
                    <strong>Name:</strong> {retailerInfo.name}
                  </p>
                  {retailerInfo.domain_prefix && (
                    <p className="text-sm text-green-700">
                      <strong>Domain:</strong> {retailerInfo.domain_prefix}.retail.lightspeed.app
                    </p>
                  )}
                </div>
              )}
              
              <p className="text-xs text-slate-500">
                Redirecting to dashboard in a few seconds...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Connection Failed</strong>
                  <br />
                  {error}
                </AlertDescription>
              </Alert>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleRetry}
                  className="flex-1"
                  variant="outline"
                >
                  Try Again
                </Button>
                <Button 
                  onClick={handleGoToDashboard}
                  className="flex-1"
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 