import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { 
  MapPin, 
  TrendingUp, 
  Star, 
  Shield, 
  Clock, 
  Users,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export const RemoteHostSupport = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const benefits = [
    {
      icon: TrendingUp,
      title: "Maximize Revenue",
      description: "Professional property management drives higher occupancy rates and premium pricing"
    },
    {
      icon: Star,
      title: "Earn 5-Star Reviews",
      description: "Exceptional guest experiences through detailed attention and rapid response"
    },
    {
      icon: Shield,
      title: "Protect Your Investment",
      description: "Proactive maintenance and monitoring prevent costly repairs and damage"
    },
    {
      icon: Clock,
      title: "24/7 Peace of Mind",
      description: "Round-the-clock support handling emergencies and guest needs instantly"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left side - Text content */}
          <div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-6">
              <MapPin className="h-4 w-4 mr-2" />
              Perfect for Remote & Busy Self-Managing Hosts
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Your <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Local Hands & Eyes</span> When You Can't Be There
            </h2>
            
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              <strong>Live out of state? Too busy to manage day-to-day?</strong> We become your trusted local team, handling everything from emergency repairs to guest check-ins. You maintain control and ownership while we provide the hands-on support that ensures your property operates like a 5-star hotel.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg mb-8">
              <h3 className="font-bold text-blue-900 mb-2">The Self-Managing Host's Dilemma:</h3>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• Can't respond to guest emergencies at 2 AM</li>
                <li>• Miss maintenance issues that become expensive repairs</li>
                <li>• Struggle to provide white-glove guest experiences</li>
                <li>• Lose revenue due to poor reviews or extended vacancies</li>
              </ul>
            </div>

            <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg mb-8">
              <h3 className="font-bold text-green-900 mb-2">The LuxServ 365 Solution:</h3>
              <ul className="text-green-800 space-y-1 text-sm">
                <li>• <strong>We become your local presence</strong> - handling everything on-site</li>
                <li>• <strong>Proactive property care</strong> - catching issues before they're expensive</li>
                <li>• <strong>Guest experience excellence</strong> - delivering 5-star service consistently</li>
                <li>• <strong>Revenue optimization</strong> - professional management drives higher income</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => scrollToSection('contact')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
              >
                Get Your Local Support Team
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                onClick={() => scrollToSection('pricing')}
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                View Plans & Pricing
              </Button>
            </div>
          </div>

          {/* Right side - Benefits grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="p-6 h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 group">
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="bg-blue-100 p-4 rounded-2xl mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                      <IconComponent className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-3 text-lg">{benefit.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed flex-1">{benefit.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Success stories section */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-3xl p-8 md:p-12 text-white">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Real Results for Remote Hosts</h3>
            <p className="text-blue-200 text-lg max-w-3xl mx-auto">
              See how we help self-managing hosts maximize their success from anywhere
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/10 rounded-2xl p-6 mb-4">
                <div className="text-4xl font-bold text-green-400 mb-2">+38%</div>
                <div className="text-blue-200">Average Revenue Increase</div>
              </div>
              <p className="text-sm text-blue-100">
                Professional management drives higher occupancy and premium rates
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/10 rounded-2xl p-6 mb-4">
                <div className="text-4xl font-bold text-yellow-400 mb-2">4.9★</div>
                <div className="text-blue-200">Average Guest Rating</div>
              </div>
              <p className="text-sm text-blue-100">
                Consistent 5-star experiences through professional guest services
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/10 rounded-2xl p-6 mb-4">
                <div className="text-4xl font-bold text-blue-400 mb-2">2min</div>
                <div className="text-blue-200">Average Response Time</div>
              </div>
              <p className="text-sm text-blue-100">
                Lightning-fast response to guest needs and property emergencies
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-blue-200 mb-4">
              <strong>"LuxServ 365 is like having a property manager, maintenance team, and concierge all in one. 
              I manage 3 properties from 500 miles away with complete confidence."</strong>
            </p>
            <div className="text-sm text-blue-300">- Linda M., Multi-Property Owner, Alabama</div>
          </div>
        </div>
      </div>
    </section>
  );
};