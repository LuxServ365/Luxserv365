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


      </div>
    </section>
  );
};