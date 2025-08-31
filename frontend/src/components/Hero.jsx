import React from 'react';
import { Button } from './ui/button';
import { Star, Shield, Clock, Users } from 'lucide-react';

export const Hero = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-16 pb-20 overflow-hidden">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8 animate-fade-in">
            <Star className="h-4 w-4 mr-2 fill-current" />
            Your Hands-On Support Team for Panama City Beach & 30A
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-8 leading-relaxed">
            <span className="block mb-4 pb-2">Empowering</span>
            <span className="block bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent pb-4">
              self-managing hosts to succeed
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            With over a decade of hands-on experience, we serve as your boots on the ground for vacation rental properties. Whether you live miles away or simply need trusted local support, we handle the day-to-day operations so you can focus on growing your business.
          </p>

          {/* Value proposition */}
          <p className="text-lg md:text-xl font-semibold text-slate-800 mb-12 max-w-3xl mx-auto">
            <span className="bg-yellow-100 px-3 py-1 rounded-full">Your local hands-on support team</span> maximizing revenue, ensuring 5-star reviews, and protecting your investment—even when you can't be there.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              onClick={() => scrollToSection('contact')}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Started Today
            </Button>
            <Button 
              onClick={() => scrollToSection('services')}
              variant="outline"
              size="lg"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              View Our Services
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="bg-white rounded-2xl p-6 shadow-lg group-hover:shadow-xl transition-all duration-200 transform group-hover:-translate-y-1">
                <Shield className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 mb-1">10+ Years</h3>
                <p className="text-sm text-slate-600">Industry Experience</p>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white rounded-2xl p-6 shadow-lg group-hover:shadow-xl transition-all duration-200 transform group-hover:-translate-y-1">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 mb-1">24/7</h3>
                <p className="text-sm text-slate-600">Emergency Response</p>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white rounded-2xl p-6 shadow-lg group-hover:shadow-xl transition-all duration-200 transform group-hover:-translate-y-1">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 mb-1">365 Days</h3>
                <p className="text-sm text-slate-600">Year-Round Support</p>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white rounded-2xl p-6 shadow-lg group-hover:shadow-xl transition-all duration-200 transform group-hover:-translate-y-1">
                <Star className="h-8 w-8 text-blue-600 mx-auto mb-3 fill-current" />
                <h3 className="font-bold text-slate-900 mb-1">Local Team</h3>
                <p className="text-sm text-slate-600">Panama City & 30A</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};