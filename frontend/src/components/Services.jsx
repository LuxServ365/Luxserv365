import React from 'react';
import { Card } from './ui/card';
import { 
  AlertTriangle, 
  Sparkles, 
  Wrench, 
  Package, 
  Smartphone, 
  Cloud, 
  Users, 
  Monitor
} from 'lucide-react';

export const Services = () => {
  const ownerServices = [
    {
      icon: AlertTriangle,
      title: "24/7 Emergency Response",
      description: "Your local emergency team responds instantly when you can't be there—handling urgent property issues and guest situations around the clock."
    },
    {
      icon: Sparkles,
      title: "Professional Turnovers & Deep Cleans",
      description: "White-glove cleaning and property preparation between guests, ensuring 5-star experiences that drive positive reviews."
    },
    {
      icon: Wrench,
      title: "Preventative Maintenance & Repairs",
      description: "Proactive on-site maintenance and immediate repairs protect your investment and prevent costly emergencies."
    },
    {
      icon: Package,
      title: "Inventory Restock & Supply Management",
      description: "We keep your property fully stocked with premium amenities, linens, and essentials—your guests never notice what's missing."
    },
    {
      icon: Smartphone,
      title: "Smart Lock & Tech Monitoring",
      description: "Local tech support monitoring all smart home systems, ensuring seamless guest access and property security."
    },
    {
      icon: Cloud,
      title: "Hurricane & Storm Prep + Post-Storm Checks",
      description: "Complete storm preparation and immediate post-storm property assessments with photo/video documentation."
    },
    {
      icon: Users,
      title: "Local Vendor Coordination",
      description: "We manage your trusted network of pool, landscaping, HVAC, and repair professionals—no more coordinating from afar."
    },
    {
      icon: Monitor,
      title: "Owner Dashboard with Real-Time Updates",
      description: "Live property status, guest activities, and maintenance updates accessible from anywhere in the world."
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Owner Services */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Owner Services
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-4">
              Your Hands-On Local Team. Protecting Remote Investments.
            </p>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium">
              📌 Complete peace of mind for self-managing hosts, wherever you are
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ownerServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="p-6 h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 group">
                  <div className="flex flex-col items-start h-full">
                    <div className="bg-blue-100 p-3 rounded-xl mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-3 leading-tight">{service.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed flex-1">{service.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Guest Concierge Convenience for Owners */}
        <div className="mt-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Guest Concierge Convenience
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-4">
              Elevate your property's appeal and booking value with our premium guest concierge services.
            </p>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-100 text-teal-700 font-medium">
              📈 Increase your rental income & guest satisfaction
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Benefits List */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Why This Matters for Your Business</h3>
                <p className="text-lg text-slate-600 mb-8">
                  Our guest concierge services don't just make guests happy—they transform your property into a premium experience that commands higher rates and drives repeat bookings.
                </p>
              </div>

              <div className="space-y-6">
                <Card className="p-6 border-l-4 border-green-600 bg-green-50">
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-lg mr-4">
                      <span className="text-2xl">💰</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Command Premium Rates</h4>
                      <p className="text-slate-700 text-sm">
                        Properties with concierge services typically charge 20-30% higher nightly rates than standard rentals. Guests gladly pay more for convenience and luxury.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-l-4 border-blue-600 bg-blue-50">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-lg mr-4">
                      <span className="text-2xl">⭐</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">5-Star Reviews & Repeat Guests</h4>
                      <p className="text-slate-700 text-sm">
                        Exceptional service creates memorable experiences that generate glowing reviews and direct rebookings, reducing your marketing costs.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-l-4 border-purple-600 bg-purple-50">
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-lg mr-4">
                      <span className="text-2xl">🏆</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Competitive Advantage</h4>
                      <p className="text-slate-700 text-sm">
                        Stand out from thousands of basic listings. Guests choose properties with concierge services over standard rentals every time.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-l-4 border-orange-600 bg-orange-50">
                  <div className="flex items-start">
                    <div className="bg-orange-100 p-2 rounded-lg mr-4">
                      <span className="text-2xl">📱</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Zero Owner Hassle</h4>
                      <p className="text-slate-700 text-sm">
                        We handle all guest requests and coordination. You get the benefits of premium service without any of the work or interruptions.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Services Overview */}
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">What Your Guests Get</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">🛒</span>
                    <span className="font-semibold text-slate-900">Pre-Arrival Stocking</span>
                  </div>
                  <p className="text-xs text-slate-600">Fully stocked kitchen on arrival</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">🏖️</span>
                    <span className="font-semibold text-slate-900">Beach Gear</span>
                  </div>
                  <p className="text-xs text-slate-600">Premium equipment delivery</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">🎯</span>
                    <span className="font-semibold text-slate-900">Local Tours</span>
                  </div>
                  <p className="text-xs text-slate-600">Curated experience booking</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">💬</span>
                    <span className="font-semibold text-slate-900">24/7 Support</span>
                  </div>
                  <p className="text-xs text-slate-600">Instant text assistance</p>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => window.location.href = '/guest-services'}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 mb-4 inline-flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <span className="mr-2">View All Guest Services</span>
                  <span>→</span>
                </button>
                <p className="text-sm text-slate-600">
                  See how these services transform your property's appeal
                </p>
              </div>
            </div>
          </div>

          {/* ROI Callout */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 md:p-12 text-white text-center">
            <h3 className="text-3xl font-bold mb-4">Your Investment Returns</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
              <div>
                <div className="text-4xl font-bold mb-2">20-30%</div>
                <div className="text-lg opacity-90">Higher Nightly Rates</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">95%+</div>
                <div className="text-lg opacity-90">5-Star Reviews</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">60%</div>
                <div className="text-lg opacity-90">Repeat Bookings</div>
              </div>
            </div>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Transform your rental from a basic stay into a luxury experience that guests rave about and book again.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};