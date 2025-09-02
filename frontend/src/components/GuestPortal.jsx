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
  ArrowLeft
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

  const requestTypes = [
    {
      value: 'property-issues',
      label: '🏠 Property Issues (AC, WiFi, Appliances)',
      description: 'Report problems with air conditioning, internet, appliances, or other property features'
    },
    {
      value: 'housekeeping-requests',
      label: '🧹 Housekeeping Requests',
      description: 'Request additional cleaning, fresh linens, towels, or housekeeping services'
    },
    {
      value: 'pre-arrival-grocery-stocking',
      label: '🛒 Pre-Arrival Grocery & Beverage Stocking',
      description: 'Have groceries, beverages, or essentials stocked before your arrival'
    },
    {
      value: 'concierge-services',
      label: '🎩 Concierge Services (Recommendations, Reservations)',
      description: 'Get local recommendations, restaurant reservations, activity bookings, and travel assistance'
    },
    {
      value: 'beach-recreation-gear',
      label: '🏖️ Beach & Recreation Gear Rental',
      description: 'Request beach chairs, umbrellas, boogie boards, bikes, or other recreational equipment'
    },
    {
      value: 'transportation-assistance',
      label: '🚗 Transportation Assistance',
      description: 'Help with ride arrangements, airport transfers, or local transportation information'
    },
    {
      value: 'celebration-services',
      label: '🎉 Celebration Services (Flowers, Cake, Decorations)',
      description: 'Arrange special celebration amenities for birthdays, anniversaries, or special occasions'
    },
    {
      value: 'pet-services',
      label: '🐕 Pet Services & Accommodations',
      description: 'Pet-friendly arrangements, pet supplies, walking services, or pet care recommendations'
    },
    {
      value: 'emergency-urgent',
      label: '🚨 Emergency / Urgent Request',
      description: 'For immediate assistance or urgent issues requiring prompt attention'
    },
    {
      value: 'general-inquiry',
      label: '💬 General Inquiry',
      description: 'Questions about the property, area, or services not covered by other categories'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Use the working contact form endpoint with formatted message
      const contactData = {
        name: formData.guestName,
        email: formData.guestEmail,
        phone: formData.guestPhone || null,
        propertyAddress: formData.propertyAddress,
        currentlyManaging: "Guest Request",
        message: `GUEST SERVICE REQUEST

Guest Information:
- Name: ${formData.guestName}
- Email: ${formData.guestEmail}
- Phone: ${formData.guestPhone || 'Not provided'}
- Number of Guests: ${formData.numberOfGuests || 'Not provided'}

Property Information:
- Address: ${formData.propertyAddress}
- Check-in Date: ${formData.checkInDate}
- Check-out Date: ${formData.checkOutDate}
- Unit Number: ${formData.unitNumber || 'Not provided'}

Request Details:
- Type: ${requestTypes.find(type => type.value === formData.requestType)?.label || formData.requestType}
- Priority: ${formData.priority.toUpperCase()}
- Message: ${formData.message}

Please process this guest service request promptly.`
      };

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData)
      });

      const result = await response.json();
      
      if (result.success) {
        // Generate a simple confirmation number from timestamp
        const confirmationNumber = Date.now().toString(36).toUpperCase().slice(-8);
        setConfirmationNumber(confirmationNumber);
        setCurrentStep('success');
      } else {
        setError(result.error || 'Failed to submit request');
      }
    } catch (err) {
      console.error('Guest request submission error:', err);
      setError('Failed to submit request. Please try again.');
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 shadow-lg border-green-200">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Request Submitted Successfully!</h1>
              <div className="bg-green-50 p-6 rounded-lg mb-6">
                <h2 className="text-xl font-semibold text-green-800 mb-2">Confirmation Number</h2>
                <div className="text-2xl font-mono font-bold text-green-700 bg-white p-3 rounded border">
                  {confirmationNumber}
                </div>
                <p className="text-green-600 mt-2 text-sm">Please save this number for your records</p>
              </div>
              <div className="text-left bg-blue-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">What happens next?</h3>
                <div className="space-y-3 text-blue-700">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Email Confirmation</p>
                      <p className="text-sm">You'll receive an email confirmation with your request details</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Response Time</p>
                      <p className="text-sm">Our team will respond within 1-4 hours during business hours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Updates</p>
                      <p className="text-sm">We'll keep you informed via email about your request status</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={resetForm}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                >
                  Submit Another Request
                </Button>
                <Button 
                  onClick={() => setCurrentStep('status')}
                  variant="outline"
                  className="px-6 py-2"
                >
                  Check Request Status
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (currentStep === 'status') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 shadow-lg">
            <div className="mb-6">
              <Button 
                onClick={() => setCurrentStep('form')}
                variant="outline"
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Request Form
              </Button>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Check Request Status</h1>
              <p className="text-gray-600">Enter your confirmation number to track your request</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmation Number
                </label>
                <input
                  type="text"
                  placeholder="Enter your 8-character confirmation number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono uppercase"
                  maxLength={8}
                />
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
                Check Status
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Guest Concierge Portal</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Request assistance with anything you need during your stay. Our concierge team is here to help make your vacation perfect.
          </p>
        </div>

        <Card className="p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Guest Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Guest Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="guestName"
                    value={formData.guestName}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="guestEmail"
                    value={formData.guestEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="guestPhone"
                    value={formData.guestPhone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="(123) 456-7890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    name="numberOfGuests"
                    value={formData.numberOfGuests}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="2"
                  />
                </div>
              </div>
            </div>

            {/* Property Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Home className="h-5 w-5" />
                Property Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Address or Name *
                  </label>
                  <input
                    type="text"
                    name="propertyAddress"
                    value={formData.propertyAddress}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123 Beach Drive, Panama City Beach, FL or Property Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Date *
                  </label>
                  <input
                    type="date"
                    name="checkInDate"
                    value={formData.checkInDate}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Date *
                  </label>
                  <input
                    type="date"
                    name="checkOutDate"
                    value={formData.checkOutDate}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit/Room Number (if applicable)
                  </label>
                  <input
                    type="text"
                    name="unitNumber"
                    value={formData.unitNumber}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Unit 101, Room A, etc."
                  />
                </div>
              </div>
            </div>

            {/* Request Details */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Request Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type of Request *
                  </label>
                  <select
                    name="requestType"
                    value={formData.requestType}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a request type</option>
                    {requestTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {formData.requestType && (
                    <p className="mt-2 text-sm text-gray-600">
                      {requestTypes.find(type => type.value === formData.requestType)?.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="normal">Normal - Response within 4 hours</option>
                    <option value="high">High - Response within 2 hours</option>
                    <option value="urgent">Urgent - Immediate response needed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Please provide detailed information about your request. Include any specific preferences, timing requirements, or special instructions."
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting Request...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Submit Request
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};