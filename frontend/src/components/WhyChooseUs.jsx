import React from 'react';
import { Card } from './ui/card';
import { Check, Calendar, Award, Users, Target, Star } from 'lucide-react';

export const WhyChooseUs = () => {
  const features = [
    {
      icon: Calendar,
      title: "365-Day Reliability",
      description: "Year-round support and service, every single day of the year."
    },
    {
      icon: Award,
      title: "Decade of Experience in Vacation Rentals",
      description: "Over 10 years of proven expertise in the short-term rental industry."
    },
    {
      icon: Users,
      title: "Hands-On Local Team",
      description: "Our team lives and works in Panama City Beach and 30A area."
    },
    {
      icon: Target,
      title: "Dual Focus: Owner Protection + Guest Satisfaction",
      description: "We balance protecting your investment with creating amazing guest experiences."
    },
    {
      icon: Star,
      title: "Luxury-Level Service, Accessible to All",
      description: "Premium service quality at pricing that works for every property owner."
    }
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {/* Logo Section */}
          <div className="mb-12">
            <img 
              src="https://customer-assets.emergentagent.com/job_beach-owner-hub/artifacts/b0exabcq_ChatGPT%20Image%20Aug%2031%2C%202025%2C%2004_12_53%20PM.png"
              alt="LuxServ 365 Logo"
              className="h-32 w-auto mx-auto mb-6"
            />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Why Choose LuxServ 365?
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            We're not just another property management company. We're your trusted partners in vacation rental success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="p-8 h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border-0 shadow-lg bg-white group relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full transform translate-x-6 -translate-y-6 opacity-50"></div>
                
                <div className="relative flex flex-col items-start h-full">
                  <div className="flex items-center mb-6">
                    <div className="bg-green-100 p-3 rounded-xl mr-4 group-hover:bg-green-200 transition-colors duration-300">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors duration-300">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-xl text-slate-900 mb-4 leading-tight">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed flex-1">{feature.description}</p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Ready to Experience the LuxServ 365 Difference?
            </h3>
            <p className="text-slate-600 mb-6">
              Join hundreds of satisfied property owners who trust us with their vacation rental success.
            </p>
            <button 
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Your Free Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};