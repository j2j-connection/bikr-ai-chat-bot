
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChatSession } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  MessageCircle, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Users,
  TrendingUp,
  Calendar,
  Filter,
  Store,
  Link,
  Settings
} from "lucide-react";
import { format } from "date-fns";
import lightspeedClient from "@/api/lightspeedClient";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [lightspeedConnected, setLightspeedConnected] = useState(false);
  const [retailerInfo, setRetailerInfo] = useState(null);
  const [showConnectionSuccess, setShowConnectionSuccess] = useState(false);

  useEffect(() => {
    loadSessions();
    checkLightspeedConnection();
    
    // Check if we just connected from callback
    if (searchParams.get('connected') === 'true') {
      setShowConnectionSuccess(true);
      // Clear the parameter after showing success
      setTimeout(() => setShowConnectionSuccess(false), 5000);
    }
  }, []);

  const checkLightspeedConnection = async () => {
    if (lightspeedClient.isAuthenticated()) {
      setLightspeedConnected(true);
      try {
        const retailer = await lightspeedClient.getRetailer();
        setRetailerInfo(retailer);
      } catch (error) {
        console.error('Error fetching retailer info:', error);
        // If we can't fetch retailer info, connection might be invalid
        setLightspeedConnected(false);
      }
    }
  };

  const handleConnectLightspeed = () => {
    navigate('/lightspeed/connect');
  };

  const handleDisconnectLightspeed = () => {
    lightspeedClient.disconnect();
    setLightspeedConnected(false);
    setRetailerInfo(null);
  };

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const data = await ChatSession.list("-created_date", 50);
      setSessions(data);
    } catch (error) {
      console.error("Error loading sessions:", error);
    }
    setIsLoading(false);
  };

  const getStatusStats = () => {
    const stats = {
      total: sessions.length,
      diagnosed: sessions.filter(s => s.status === "diagnosed" || s.status === "sent_to_shop" || s.status === "completed").length,
      active: sessions.filter(s => s.status === "active").length,
      completed: sessions.filter(s => s.status === "completed").length
    };

    stats.success_rate = stats.total > 0 ? Math.round((stats.diagnosed / stats.total) * 100) : 0;
    
    return stats;
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'diagnosed':
      case 'sent_to_shop': return <MessageCircle className="w-4 h-4 text-green-600" />;
      case 'active': return <Clock className="w-4 h-4 text-amber-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredSessions = sessions.filter(session => {
    if (filter === "all") return true;
    return session.status === filter;
  });

  const stats = getStatusStats();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Analytics Dashboard</h1>
        <p className="text-slate-600">Monitor diagnostic performance and customer interactions</p>
      </div>

      {/* Connection Success Alert */}
      {showConnectionSuccess && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Successfully connected to Lightspeed!</strong> Your store integration is now active.
          </AlertDescription>
        </Alert>
      )}

      {/* Lightspeed Connection Card */}
      <Card className="mb-8 border-2 border-dashed border-slate-200 bg-slate-50/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">
                  {lightspeedConnected ? 'Lightspeed Integration' : 'Connect to Lightspeed'}
                </CardTitle>
                <p className="text-sm text-slate-600">
                  {lightspeedConnected 
                    ? 'Access customer data and inventory for enhanced diagnostics'
                    : 'Enhance diagnostics with customer history and inventory data'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {lightspeedConnected ? (
                <>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                    <Link className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                  <Button
                    onClick={handleDisconnectLightspeed}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleConnectLightspeed}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Connect Store
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        {lightspeedConnected && retailerInfo && (
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg border border-slate-200">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Store Name</p>
                <p className="text-sm font-semibold text-slate-900">{retailerInfo.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Domain</p>
                                 <p className="text-sm font-mono text-slate-700">
                   {lightspeedClient.getDomainPrefix()}.retail.lightspeed.app
                 </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Status</p>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-slate-700">Active</p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Professional Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Sessions</CardTitle>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-1">{stats.total}</div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-emerald-600 font-medium">All time</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Success Rate</CardTitle>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-1">{stats.success_rate}%</div>
            <div className="text-sm text-slate-600">{stats.diagnosed} successful diagnoses</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Active Sessions</CardTitle>
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-1">{stats.active}</div>
            <div className="text-sm text-slate-600">In progress</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Completed</CardTitle>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-1">{stats.completed}</div>
            <div className="text-sm text-slate-600">Sent to service</div>
          </CardContent>
        </Card>
      </div>

      {/* Professional Sessions Table */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-900">Diagnostic Sessions</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Sessions</option>
                <option value="active">Active</option>
                <option value="diagnosed">Diagnosed</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500">Loading diagnostic sessions...</p>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No sessions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSessions.map((session) => (
                <div 
                  key={session.id}
                  className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(session.status)}
                      <div>
                        <h3 className="font-semibold text-slate-900 text-lg">
                          {session.customer_name || 'Anonymous Session'}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {format(new Date(session.created_date), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize font-medium">
                      {session.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  {session.diagnosis && (
                    <div className="bg-slate-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-slate-900">{session.diagnosis.issue}</h4>
                        <Badge className={`border font-medium ${getUrgencyColor(session.diagnosis.urgency)}`}>
                          {session.diagnosis.urgency.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{session.diagnosis.description}</p>
                      <div className="flex items-center gap-6 text-xs text-slate-500">
                        <span><strong>Service Time:</strong> {session.diagnosis.estimated_service_time}</span>
                      </div>
                    </div>
                  )}

                  {session.customer_email && (
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span>{session.customer_email}</span>
                      {session.customer_phone && <span>{session.customer_phone}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
