
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { createPageUrl } from '@/utils';
import { MessageCircle, Wrench, Shield, Zap, CheckCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">BikeBot</h1>
              <p className="text-xs text-slate-300">Enterprise Bike Diagnostics</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            AI-Powered Diagnostics
          </div>
          <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">
            Professional Bike
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              Diagnostic Platform
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Streamline your bike shop operations with AI-powered diagnostics. 
            Reduce diagnosis time, improve accuracy, and enhance customer satisfaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("Chat")}>
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-xl px-8 py-4 text-lg font-semibold">
                <MessageCircle className="mr-3 w-5 h-5" />
                Start Diagnosis
              </Button>
            </Link>
            <Link to={createPageUrl("Dashboard")}>
              <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-4 text-lg font-semibold">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Enterprise Security</h3>
              <p className="text-slate-300 leading-relaxed">
                Bank-grade security with role-based access control and encrypted data storage.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">AI-Powered Analysis</h3>
              <p className="text-slate-300 leading-relaxed">
                Advanced machine learning models trained on thousands of bike repair cases.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-6">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Proven Results</h3>
              <p className="text-slate-300 leading-relaxed">
                90%+ diagnostic accuracy with real-time confidence scoring and detailed reports.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-slate-800/30 rounded-2xl p-8 border border-slate-700 backdrop-blur-sm">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">90%+</div>
              <div className="text-slate-300">Diagnostic Accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">5min</div>
              <div className="text-slate-300">Average Diagnosis Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-slate-300">System Availability</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">1000+</div>
              <div className="text-slate-300">Issues Resolved</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
