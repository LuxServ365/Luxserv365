import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { 
  MessageSquare, 
  User, 
  MapPin,
  Phone,
  Mail,
  Users,
  Home,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';

export const GuestPortal = () => {
  const [currentStep, setCurrentStep] = useState('form'); // 'form', 'success'

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

  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 shadow-lg border-green-200">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Request Submitted Successfully!</h1>
              <div className="bg-green-50 p-6 rounded-lg mb-6">
                <h2 className="text-xl font-semibold text-green-800 mb-2">Confirmation</h2>
                <div className="text-2xl font-mono font-bold text-green-700 bg-white p-3 rounded border">
                  Your request has been received
                </div>
                <p className="text-green-600 mt-2 text-sm">We will contact you within 1-4 hours</p>
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
                    <Phone className="h-5 w-5 mt-0.5 flex-shrink-0" />
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
              <Button 
                onClick={() => setCurrentStep('form')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              >
                Submit Another Request
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
          <form onSubmit={handleFormSubmit}>
            {/* Guest Information */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
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
                    name="name"
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
                    name="email"
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
                    name="phone"
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
                    min="1"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="2"
                  />
                </div>
              </div>
            </div>

            {/* Property Information */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Unit 101, Room A, etc."
                  />
                </div>
              </div>
            </div>

            {/* Request Details */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    name="priority"
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
                    name="guestMessage"
                    required
                    rows={6}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Please provide detailed information about your request. Include any specific preferences, timing requirements, or special instructions."
                  />
                </div>
              </div>
            </div>

            {/* Hidden fields to format the message properly */}
            <input type="hidden" name="currentlyManaging" value="Guest Request" />
            
            <div className="flex justify-center">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Submit Request
                </div>
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};