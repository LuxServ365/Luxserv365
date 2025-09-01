import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { 
  Users, 
  Search, 
  Filter,
  Eye,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  BarChart3,
  Download,
  Reply,
  Camera,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Square,
  CheckSquare,
  Trash2
} from 'lucide-react';
import { adminApi } from '../services/api';

export const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });
  const [requests, setRequests] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [requestTypeFilter, setRequestTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRequest, setExpandedRequest] = useState(null);
  
  // Reply modal
  const [replyModal, setReplyModal] = useState({ open: false, requestId: null, guestName: '', guestEmail: '' });
  const [replyData, setReplyData] = useState({ subject: '', message: '' });

  // Bulk operations
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [bulkOperationModal, setBulkOperationModal] = useState({ open: false, operation: '' });
  const [bulkData, setBulkData] = useState({ status: '', priority: '', note: '' });

  useEffect(() => {
    // Check if already authenticated (simple demo - in production use proper JWT)
    const authToken = localStorage.getItem('admin_token');
    if (authToken === 'admin_authenticated') {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await adminApi.login(loginCredentials);
      if (response.success) {
        localStorage.setItem('admin_token', response.token);
        localStorage.setItem('admin_username', response.username);
        setIsAuthenticated(true);
        loadData();
      } else {
        setError(response.error || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    setIsAuthenticated(false);
    setRequests([]);
    setAnalytics(null);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Load requests and analytics in parallel
      const [requestsResponse, analyticsResponse] = await Promise.all([
        adminApi.getRequests({
          page: currentPage,
          search: searchTerm,
          status: statusFilter,
          priority: priorityFilter,
          request_type: requestTypeFilter
        }),
        adminApi.getAnalytics()
      ]);

      if (requestsResponse.success) {
        setRequests(requestsResponse.data.requests);
      }

      if (analyticsResponse.success) {
        setAnalytics(analyticsResponse.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      const response = await adminApi.updateRequest(requestId, {
        status: newStatus,
        adminUsername: localStorage.getItem('admin_username')
      });

      if (response.success) {
        loadData(); // Reload data
      } else {
        setError(response.error || 'Failed to update status');
      }
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  };

  const handleAddNote = async (requestId, note) => {
    try {
      const response = await adminApi.updateRequest(requestId, {
        internalNote: note,
        adminUsername: localStorage.getItem('admin_username')
      });

      if (response.success) {
        loadData(); // Reload data
      } else {
        setError(response.error || 'Failed to add note');
      }
    } catch (err) {
      setError(err.message || 'Failed to add note');
    }
  };

  const handleSendReply = async () => {
    try {
      const response = await adminApi.sendReply(replyModal.requestId, {
        subject: replyData.subject,
        message: replyData.message,
        adminUsername: localStorage.getItem('admin_username')
      });

      if (response.success) {
        setReplyModal({ open: false, requestId: null, guestName: '', guestEmail: '' });
        setReplyData({ subject: '', message: '' });
        loadData(); // Reload data
      } else {
        setError(response.error || 'Failed to send reply');
      }
    } catch (err) {
      setError(err.message || 'Failed to send reply');
    }
  };

  // Bulk operation functions
  const handleSelectAll = () => {
    if (selectedRequests.length === requests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(requests.map(request => request.id));
    }
  };

  const handleSelectRequest = (requestId) => {
    setSelectedRequests(prev => {
      if (prev.includes(requestId)) {
        return prev.filter(id => id !== requestId);
      } else {
        return [...prev, requestId];
      }
    });
  };

  const handleBulkOperation = (operation) => {
    if (selectedRequests.length === 0) {
      setError('Please select at least one request');
      return;
    }
    setBulkOperationModal({ open: true, operation });
  };

  const executeBulkOperation = async () => {
    try {
      const updateData = {
        adminUsername: localStorage.getItem('admin_username')
      };

      if (bulkOperationModal.operation === 'complete') {
        updateData.status = 'completed';
        updateData.internalNote = 'Bulk completed via admin dashboard';
      } else if (bulkOperationModal.operation === 'cancel') {
        updateData.status = 'cancelled';
        updateData.internalNote = 'Bulk cancelled via admin dashboard';
      } else if (bulkData.status) {
        updateData.status = bulkData.status;
        if (bulkData.note) {
          updateData.internalNote = bulkData.note;
        }
      }

      const response = await adminApi.bulkUpdateRequests(selectedRequests, updateData);

      if (response.success) {
        setBulkOperationModal({ open: false, operation: '' });
        setBulkData({ status: '', priority: '', note: '' });
        setSelectedRequests([]);
        loadData(); // Reload data
      } else {
        setError(response.error || 'Bulk operation failed');
      }
    } catch (err) {
      setError(err.message || 'Bulk operation failed');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      default: return 'text-blue-600 bg-blue-100 border-blue-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 border-green-200';
      case 'in-progress': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const formatRequestType = (type) => {
    const types = {
      'property-issues': '🏠 Property Issues',
      'housekeeping-requests': '🧹 Housekeeping',
      'pre-arrival-grocery-stocking': '🛒 Grocery Stocking',
      'concierge-services': '🎯 Concierge',
      'beach-recreation-gear': '🏖️ Beach Gear',
      'transportation-assistance': '🚗 Transportation',
      'celebration-services': '🎉 Celebrations',
      'emergency-urgent': '🆘 Emergency',
      'general-inquiry': '💬 General'
    };
    return types[type] || type;
  };

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md p-8 shadow-2xl border-0 bg-white">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-blue-700 bg-clip-text text-transparent">
                LuxServ
              </span>
              <span className="text-slate-800 ml-1">365</span>
            </h1>
            <p className="text-lg text-slate-600 mt-2">Admin Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                required
                value={loginCredentials.username}
                onChange={(e) => setLoginCredentials(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                required
                value={loginCredentials.password}
                onChange={(e) => setLoginCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter password"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </form>
        </Card>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-blue-700 bg-clip-text text-transparent">
                  LuxServ 365
                </span> Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600">Welcome back, {localStorage.getItem('admin_username')}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.overview.total_requests}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.overview.pending_requests}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.overview.completed_requests}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Urgent</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.overview.urgent_requests}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={requestTypeFilter}
                onChange={(e) => setRequestTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="property-issues">Property Issues</option>
                <option value="housekeeping-requests">Housekeeping</option>
                <option value="pre-arrival-grocery-stocking">Grocery Stocking</option>
                <option value="concierge-services">Concierge</option>
                <option value="beach-recreation-gear">Beach Gear</option>
                <option value="transportation-assistance">Transportation</option>
                <option value="celebration-services">Celebrations</option>
                <option value="emergency-urgent">Emergency</option>
                <option value="general-inquiry">General</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <Button
                onClick={loadData}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Bulk Operations */}
        {requests.length > 0 && (
          <Card className="p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handleSelectAll}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  {selectedRequests.length === requests.length ? 
                    <CheckSquare className="h-4 w-4 mr-2" /> : 
                    <Square className="h-4 w-4 mr-2" />
                  }
                  {selectedRequests.length === requests.length ? 'Select None' : 'Select All'}
                </Button>
                
                {selectedRequests.length > 0 && (
                  <span className="text-sm text-gray-600">
                    {selectedRequests.length} request{selectedRequests.length > 1 ? 's' : ''} selected
                  </span>
                )}
              </div>
              
              {selectedRequests.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => handleBulkOperation('complete')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Completed
                  </Button>
                  <Button
                    onClick={() => handleBulkOperation('cancel')}
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-50"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Cancel Orders
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Requests Table */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Guest Requests</h3>
              {selectedRequests.length > 0 && (
                <span className="text-sm text-blue-600 font-medium">
                  {selectedRequests.length} selected
                </span>
              )}
            </div>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No requests found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((request) => (
                    <React.Fragment key={request.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{request.guestName}</p>
                              <p className="text-sm text-gray-500">{request.guestEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{formatRequestType(request.requestType)}</p>
                            <p className="text-sm text-gray-500">{request.propertyAddress}</p>
                            {request.photos.length > 0 && (
                              <p className="text-xs text-blue-600 flex items-center mt-1">
                                <Camera className="h-3 w-3 mr-1" />
                                {request.photos.length} photo(s)
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(request.priority)}`}>
                            {request.priority.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={request.status}
                            onChange={(e) => handleStatusUpdate(request.id, e.target.value)}
                            className={`text-xs font-medium rounded-full border px-2 py-1 ${getStatusColor(request.status)}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setExpandedRequest(expandedRequest === request.id ? null : request.id)}
                            >
                              {expandedRequest === request.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setReplyModal({
                                open: true,
                                requestId: request.id,
                                guestName: request.guestName,
                                guestEmail: request.guestEmail
                              })}
                            >
                              <Reply className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expanded Row Details */}
                      {expandedRequest === request.id && (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 bg-gray-50">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium text-gray-900">Message</h4>
                                <p className="text-sm text-gray-700 mt-1">{request.message}</p>
                              </div>
                              
                              {request.guestPhone && (
                                <div>
                                  <h4 className="font-medium text-gray-900">Contact</h4>
                                  <p className="text-sm text-gray-700 mt-1 flex items-center">
                                    <Phone className="h-4 w-4 mr-2" />
                                    {request.guestPhone}
                                  </p>
                                </div>
                              )}
                              
                              {request.internalNotes && request.internalNotes.length > 0 && (
                                <div>
                                  <h4 className="font-medium text-gray-900">Internal Notes</h4>
                                  <div className="mt-1 space-y-1">
                                    {request.internalNotes.map((note, index) => (
                                      <p key={index} className="text-sm text-gray-600">{note}</p>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Add Internal Note</h4>
                                <div className="flex space-x-2">
                                  <input
                                    type="text"
                                    placeholder="Add a note..."
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter' && e.target.value.trim()) {
                                        handleAddNote(request.id, e.target.value.trim());
                                        e.target.value = '';
                                      }
                                    }}
                                  />
                                  <Button size="sm">Add Note</Button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Reply Modal */}
      {replyModal.open && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Reply to {replyModal.guestName}
              </h3>
              <p className="text-sm text-gray-600">{replyModal.guestEmail}</p>
            </div>
            
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={replyData.subject}
                  onChange={(e) => setReplyData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Email subject"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={replyData.message}
                  onChange={(e) => setReplyData(prev => ({ ...prev, message: e.target.value }))}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your reply message..."
                />
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setReplyModal({ open: false, requestId: null, guestName: '', guestEmail: '' });
                  setReplyData({ subject: '', message: '' });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendReply}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Reply
              </Button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed top-4 right-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg shadow-lg z-50">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-red-700">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-600 p-1.5 hover:bg-red-100"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};