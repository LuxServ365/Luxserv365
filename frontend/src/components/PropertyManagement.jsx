import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ExternalLink,
  User,
  MapPin,
  FileText,
  Camera,
  MessageSquare,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { adminApi } from '../services/api';

export const PropertyManagement = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState({
    ownerEmail: '',
    ownerName: '',
    propertyAddress: '',
    googleDocsUrl: '',
    googlePhotosUrl: '',
    googleFormsUrl: '',
    propertyType: '',
    notes: ''
  });

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllProperties({ limit: 100 });
      if (response.success) {
        setProperties(response.data.properties);
      }
    } catch (err) {
      setError('Failed to load properties');
      console.error('Error loading properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProperty) {
        // Update existing property
        const response = await adminApi.updateProperty(editingProperty.id, formData);
        if (response.success) {
          await loadProperties();
          setEditingProperty(null);
          setShowAddForm(false);
          resetForm();
        }
      } else {
        // Create new property
        const response = await adminApi.createProperty(formData);
        if (response.success) {
          await loadProperties();
          setShowAddForm(false);
          resetForm();
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to save property');
    }
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setFormData({
      ownerEmail: property.ownerEmail,
      ownerName: property.ownerName,
      propertyAddress: property.propertyAddress,
      googleDocsUrl: property.googleDocsUrl || '',
      googlePhotosUrl: property.googlePhotosUrl || '',
      googleFormsUrl: property.googleFormsUrl || '',
      propertyType: property.propertyType || '',
      notes: property.notes || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        const response = await adminApi.deleteProperty(propertyId);
        if (response.success) {
          await loadProperties();
        }
      } catch (err) {
        setError(err.message || 'Failed to delete property');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      ownerEmail: '',
      ownerName: '',
      propertyAddress: '',
      googleDocsUrl: '',
      googlePhotosUrl: '',
      googleFormsUrl: '',
      propertyType: '',
      notes: ''
    });
  };

  const filteredProperties = properties.filter(property =>
    property.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.ownerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading properties...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Property Management</h2>
          <p className="text-gray-600">Manage owner properties and Google resource assignments</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setEditingProperty(null);
            setShowAddForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search properties by owner or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingProperty ? 'Edit Property' : 'Add New Property'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner Email *
                </label>
                <input
                  type="email"
                  name="ownerEmail"
                  value={formData.ownerEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="owner@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner Name *
                </label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Smith"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Address *
              </label>
              <input
                type="text"
                name="propertyAddress"
                value={formData.propertyAddress}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="123 Beach Boulevard, Panama City Beach, FL"
              />
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Google Services URLs</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Google Forms URL (Messaging)
                </label>
                <input
                  type="url"
                  name="googleFormsUrl"
                  value={formData.googleFormsUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://docs.google.com/forms/d/e/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Google Docs URL (Inspection Reports)
                </label>
                <input
                  type="url"
                  name="googleDocsUrl"
                  value={formData.googleDocsUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://docs.google.com/document/d/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Google Photos URL (Property Album)
                </label>
                <input
                  type="url"
                  name="googlePhotosUrl"
                  value={formData.googlePhotosUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://photos.app.goo.gl/..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Type</option>
                  <option value="condo">Condo</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Internal notes about this property..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProperty(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                {editingProperty ? 'Update Property' : 'Create Property'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Properties List */}
      <div className="grid gap-6">
        {filteredProperties.length === 0 ? (
          <Card className="p-12 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'No properties match your search.' : 'Start by adding your first property.'}
            </p>
          </Card>
        ) : (
          filteredProperties.map((property) => (
            <Card key={property.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <User className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">{property.ownerName}</h3>
                    <span className="ml-2 text-sm text-gray-500">({property.ownerEmail})</span>
                  </div>
                  <div className="flex items-center mb-3">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-700">{property.propertyAddress}</span>
                  </div>
                  {property.propertyType && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {property.propertyType}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleEdit(property)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(property.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Google Services Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <MessageSquare className="h-5 w-5 mr-3 text-gray-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Messaging Form</p>
                    <div className="flex items-center mt-1">
                      {property.googleFormsUrl ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-xs text-green-700">Configured</span>
                          <a
                            href={property.googleFormsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2"
                          >
                            <ExternalLink className="h-3 w-3 text-blue-600" />
                          </a>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 text-orange-500 mr-1" />
                          <span className="text-xs text-orange-700">Not Set</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <FileText className="h-5 w-5 mr-3 text-gray-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Inspection Report</p>
                    <div className="flex items-center mt-1">
                      {property.googleDocsUrl ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-xs text-green-700">Configured</span>
                          <a
                            href={property.googleDocsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2"
                          >
                            <ExternalLink className="h-3 w-3 text-blue-600" />
                          </a>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 text-orange-500 mr-1" />
                          <span className="text-xs text-orange-700">Not Set</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Camera className="h-5 w-5 mr-3 text-gray-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Photo Album</p>
                    <div className="flex items-center mt-1">
                      {property.googlePhotosUrl ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-xs text-green-700">Configured</span>
                          <a
                            href={property.googlePhotosUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2"
                          >
                            <ExternalLink className="h-3 w-3 text-blue-600" />
                          </a>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 text-orange-500 mr-1" />
                          <span className="text-xs text-orange-700">Not Set</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {property.notes && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Admin Notes:</strong> {property.notes}
                  </p>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};