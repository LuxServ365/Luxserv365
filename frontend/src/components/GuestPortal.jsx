import React from 'react';

export const GuestPortal = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Guest Concierge Portal</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Request assistance with anything you need during your stay. Our concierge team is here to help make your vacation perfect.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <iframe 
            src="https://docs.google.com/forms/d/1f01AuxP-jy3-8bI7bQa7qp-Ha7xNe9CpCzBYAdgAxvU/viewform?embedded=true" 
            width="100%" 
            height="1400" 
            frameBorder="0" 
            marginHeight="0" 
            marginWidth="0"
            className="rounded-lg"
            title="LuxServ 365 Guest Concierge Request Form"
          >
            Loading form...
          </iframe>
        </div>

        <div className="text-center mt-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Need Immediate Assistance?</h3>
            <div className="space-y-2 text-blue-700">
              <p><strong>Phone:</strong> (850) 774-0244</p>
              <p><strong>Email:</strong> 850realty@gmail.com</p>
              <p><strong>Response Time:</strong> 1-4 hours during business hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};