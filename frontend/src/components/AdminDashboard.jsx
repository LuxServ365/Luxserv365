import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { 
  Users, 
  CheckCircle,
  Clock,
  Mail,
  Phone,
  LogOut,
  RefreshCw,
  Home,
  Building2
} from 'lucide-react';
import { PropertyManagement } from './PropertyManagement';

export const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [completedRequests, setCompletedRequests] = useState(new Set());
  const [activeTab, setActiveTab] = useState('requests');

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token === 'admin_authenticated') {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginCredentials)
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('admin_token', result.token);
        localStorage.setItem('admin_username', result.username);
        setIsAuthenticated(true);
        loadData();
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/contact`);
      const result = await response.json();
      
      if (result.success && result.data) {
        setRequests(result.data);
      } else {
        setRequests([]);
      }
    } catch (err) {
      setError('Failed to load requests');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const markComplete = (requestId) => {
    setCompletedRequests(prev => new Set([...prev, requestId]));
  };

  const markPending = (requestId) => {
    setCompletedRequests(prev => {
      const newSet = new Set(prev);
      newSet.delete(requestId);
      return newSet;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    setIsAuthenticated(false);
    setRequests([]);
    setCompletedRequests(new Set());
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
  };

  const extractGuestInfo = (message) => {
    if (!message) return { name: 'Unknown', email: 'Unknown', phone: 'Unknown', property: 'Unknown' };
    
    const nameMatch = message.match(/Name:\s*([^\n]+)/);
    const emailMatch = message.match(/Email:\s*([^\n]+)/);
    const phoneMatch = message.match(/Phone:\s*([^\n]+)/);
    const propertyMatch = message.match(/Address:\s*([^\n]+)/);
    
    return {
      name: nameMatch ? nameMatch[1].trim() : 'Unknown',
      email: emailMatch ? emailMatch[1].trim() : 'Unknown', 
      phone: phoneMatch ? phoneMatch[1].trim() : 'Not provided',
      property: propertyMatch ? propertyMatch[1].trim() : 'Unknown'
    };
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Login
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={loginCredentials.username}
                onChange={(e) => setLoginCredentials({...loginCredentials, username: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={loginCredentials.password}
                onChange={(e) => setLoginCredentials({...loginCredentials, password: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Sign In
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">LuxServ 365 - Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={loadData} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'requests'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Home className="h-4 w-4 mr-2 inline" />
                Guest Requests
              </button>
              <button
                onClick={() => setActiveTab('properties')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'properties'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Building2 className="h-4 w-4 mr-2 inline" />
                Property Management
              </button>
            </nav>
          </div>
        </div>

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900">Guest Service Requests</h2>
              <p className="mt-1 text-sm text-gray-600">
                Total requests: {requests.length} | 
                Completed: {completedRequests.size} | 
                Pending: {requests.length - completedRequests.size}
              </p>
            </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-flex items-center">
              <RefreshCw className="animate-spin h-5 w-5 mr-2" />
              Loading requests...
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {!loading && requests.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No guest requests found.</p>
          </div>
        )}

        <div className="space-y-4">
          {requests.map((request) => {
            const guestInfo = extractGuestInfo(request.message);
            const isCompleted = completedRequests.has(request.id);
            
            return (
              <Card key={request.id} className={`p-6 ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {request.name || guestInfo.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {request.email || guestInfo.email}
                          </span>
                          {request.phone && (
                            <span className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              {request.phone}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isCompleted 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {isCompleted ? 'Completed' : 'Pending'}
                        </span>
                        {isCompleted ? (
                          <Button 
                            onClick={() => markPending(request.id)}
                            variant="outline"
                            size="sm"
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Mark Pending
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => markComplete(request.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                            size="sm"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Property:</p>
                          <p className="text-sm text-gray-900">{request.propertyAddress || guestInfo.property}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Submitted:</p>
                          <p className="text-sm text-gray-900">{formatDate(request.createdAt)}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Request Details:</p>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <pre className="text-sm text-gray-900 whitespace-pre-wrap">{request.message}</pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
          </>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <PropertyManagement />
        )}
      </div>
    </div>
  );
};