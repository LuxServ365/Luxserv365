import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { 
  MessageSquare, 
  Send, 
  User, 
  MapPin, 
  Calendar,
  Phone,
  Mail,
  Users,
  Home,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowLeft,
  Camera,
  X,
  Upload
} from 'lucide-react';
import { guestApi } from '../services/api';

export const GuestPortal = () => {
  const [currentStep, setCurrentStep] = useState('form'); // 'form', 'success', 'status'
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    numberOfGuests: '',
    propertyAddress: '',
    checkInDate: '',
    checkOutDate: '',
    unitNumber: '',
    requestType: '',
    priority: 'normal',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [photoPreview, setPhotoPreview] = useState([]);

  const requestTypes = [
    {
      value: 'property-issues',
      label: '🏠 Property Issues (AC, WiFi, Appliances)',
      description: 'Report problems with air conditioning, internet, appliances, or other property features'
    },
    {
      value: 'housekeeping-requests',
      label: '🧹 Housekeeping Requests (Cleaning, Trash Removal, Party Clean up)',
      description: 'Request additional cleaning, trash removal, or post-event cleanup services'
    },
    {
      value: 'pre-arrival-grocery-stocking',
      label: '🛒 Pre-Arrival Grocery & Beverage Stocking',
      description: 'Have your vacation rental fully stocked with groceries and beverages before you arrive'
    },
    {
      value: 'concierge-services',
      label: '🎯 Concierge Services (Local info, visitor information, trip ideas & coordination)',
      description: 'Get local recommendations, visitor information, and help coordinating activities'
    },
    {
      value: 'beach-recreation-gear',
      label: '🏖️ Beach/Recreation Gear Coordination',
      description: 'Request beach chairs, umbrellas, water sports equipment, or recreation gear'
    },
    {
      value: 'transportation-assistance',
      label: '🚗 Personal Transportation Assistance/ Luggage Assistance',
      description: 'Airport pickup, local transportation, or luggage handling assistance'
    },
    {
      value: 'celebration-services',
      label: '🎉 Celebration Services',
      description: 'Special arrangements for birthdays, anniversaries, or other celebrations'
    },
    {
      value: 'emergency-urgent',
      label: '🆘 Emergency/Urgent',
      description: 'Immediate assistance required for urgent situations'
    },
    {
      value: 'general-inquiry',
      label: '💬 General Inquiry',
      description: 'General questions or requests not covered by other categories'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length !== files.length) {
      setError('Some files were not images and were skipped.');
    }
    
    // Limit to 10 photos total
    const totalPhotos = selectedPhotos.length + validFiles.length;
    if (totalPhotos > 10) {
      setError('Maximum 10 photos allowed. Some photos were not added.');
      const remainingSlots = 10 - selectedPhotos.length;
      validFiles.splice(remainingSlots);
    }
    
    setSelectedPhotos(prev => [...prev, ...validFiles]);
    
    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(prev => [...prev, {
          file: file,
          url: event.target.result,
          id: `${file.name}-${Date.now()}` 
        }]);
      };
      reader.readAsDataURL(file);
    });
    
    // Clear the input
    e.target.value = '';
  };

  const removePhoto = (photoId) => {
    const photoToRemove = photoPreview.find(p => p.id === photoId);
    if (photoToRemove) {
      setSelectedPhotos(prev => prev.filter(file => file !== photoToRemove.file));
      setPhotoPreview(prev => prev.filter(p => p.id !== photoId));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await guestApi.submitRequest(formData, selectedPhotos);
      
      if (response.success) {
        setConfirmationNumber(response.confirmationNumber);
        setCurrentStep('success');
      } else {
        setError(response.error || 'Failed to submit request');
      }
    } catch (err) {
      console.error('Guest request submission error:', err);
      setError(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      numberOfGuests: '',
      propertyAddress: '',
      checkInDate: '',
      checkOutDate: '',
      unitNumber: '',
      requestType: '',
      priority: 'normal',
      message: ''
    });
    setCurrentStep('form');
    setError(null);
    setConfirmationNumber('');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-2xl p-12 shadow-2xl border-0 bg-white text-center">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Request Submitted!</h2>
          <p className="text-xl text-slate-600 mb-6">
            Thank you for contacting LuxServ 365. We've received your request and will respond shortly.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Your Confirmation Number</h3>
            <div className="text-3xl font-bold text-blue-600 mb-2">{confirmationNumber}</div>
            <p className="text-sm text-blue-700">Save this number to track your request status</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-slate-900 mb-4">What happens next?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-slate-700">
                  {formData.priority === 'urgent' ? 'Response within 2 hours' : 
                   formData.priority === 'high' ? 'Response within 4 hours' : 
                   'Response within 24 hours'}
                </span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-slate-700">Email confirmation sent to {formData.guestEmail}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-slate-700">Our team may call you for urgent requests</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              onClick={resetForm}
              variant="outline"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
            >
              Submit Another Request
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Back to Home
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-slate-500 text-sm mb-2">Need immediate assistance?</p>
            <div className="flex justify-center space-x-6">
              <a href="tel:+18503309933" className="text-blue-600 hover:text-blue-700 font-medium">
                Main: (850) 330-9933
              </a>
              <a href="tel:+15049391371" className="text-red-600 hover:text-red-700 font-medium">
                Emergency: (504) 939-1371
              </a>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative mb-6">
            <h1 className="text-3xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-blue-700 bg-clip-text text-transparent drop-shadow-sm">
                LuxServ
              </span>
              <span className="text-slate-800 ml-1 relative">
                365
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse"></div>
              </span>
            </h1>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-blue-600 via-teal-500 to-blue-700 rounded-full"></div>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Guest Portal</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            We're here to make your stay perfect. Let us know how we can help!
          </p>
        </div>

        {/* Form */}
        <Card className="p-8 shadow-2xl border-0 bg-white">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Guest Information */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <User className="h-6 w-6 mr-2 text-blue-600" />
                Guest Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="guestName" className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="guestName"
                    name="guestName"
                    required
                    value={formData.guestName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label htmlFor="guestEmail" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="guestEmail"
                    name="guestEmail"
                    required
                    value={formData.guestEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="guestPhone" className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="guestPhone"
                    name="guestPhone"
                    value={formData.guestPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="(850) 123-4567"
                  />
                </div>
                <div>
                  <label htmlFor="numberOfGuests" className="block text-sm font-medium text-slate-700 mb-2">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    id="numberOfGuests"
                    name="numberOfGuests"
                    min="1"
                    max="20"
                    value={formData.numberOfGuests}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="4"
                  />
                </div>
              </div>
            </div>

            {/* Property Information */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <Home className="h-6 w-6 mr-2 text-blue-600" />
                Property Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="propertyAddress" className="block text-sm font-medium text-slate-700 mb-2">
                    Property Address/Name *
                  </label>
                  <input
                    type="text"
                    id="propertyAddress"
                    name="propertyAddress"
                    required
                    value={formData.propertyAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="123 Beach Boulevard, Panama City Beach, FL"
                  />
                </div>
                <div>
                  <label htmlFor="checkInDate" className="block text-sm font-medium text-slate-700 mb-2">
                    Check-in Date *
                  </label>
                  <input
                    type="date"
                    id="checkInDate"
                    name="checkInDate"
                    required
                    value={formData.checkInDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="checkOutDate" className="block text-sm font-medium text-slate-700 mb-2">
                    Check-out Date *
                  </label>
                  <input
                    type="date"
                    id="checkOutDate"
                    name="checkOutDate"
                    required
                    value={formData.checkOutDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="unitNumber" className="block text-sm font-medium text-slate-700 mb-2">
                    Unit/Room Number
                  </label>
                  <input
                    type="text"
                    id="unitNumber"
                    name="unitNumber"
                    value={formData.unitNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Unit 204"
                  />
                </div>
              </div>
            </div>

            {/* Request Details */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <MessageSquare className="h-6 w-6 mr-2 text-blue-600" />
                Request Details
              </h3>
              <div className="space-y-6">
                <div>
                  <label htmlFor="requestType" className="block text-sm font-medium text-slate-700 mb-2">
                    Request Type *
                  </label>
                  <select
                    id="requestType"
                    name="requestType"
                    required
                    value={formData.requestType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Please select a request type</option>
                    {requestTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {formData.requestType && (
                    <p className="mt-2 text-sm text-slate-600">
                      {requestTypes.find(t => t.value === formData.requestType)?.description}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-slate-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="normal">🟢 Normal (Response within 24 hours)</option>
                    <option value="high">🟡 High (Response within 4 hours)</option>
                    <option value="urgent">🔴 Urgent (Response within 2 hours)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                    Detailed Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Please provide detailed information about your request. The more specific you are, the better we can assist you."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-slate-200">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting Request...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Send className="h-5 w-5 mr-2" />
                    Submit Request
                  </div>
                )}
              </Button>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </form>
        </Card>

        {/* Contact Information */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Need Immediate Assistance?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="tel:+18503309933"
                className="flex items-center justify-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
              >
                <Phone className="h-5 w-5 mr-3 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium text-slate-900">Main Line</p>
                  <p className="text-sm text-slate-600">(850) 330-9933</p>
                </div>
              </a>
              <a
                href="tel:+15049391371"
                className="flex items-center justify-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
              >
                <Phone className="h-5 w-5 mr-3 text-red-600" />
                <div className="text-left">
                  <p className="font-medium text-slate-900">Emergency</p>
                  <p className="text-sm text-slate-600">(504) 939-1371</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};