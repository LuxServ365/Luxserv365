import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Check, Star, Crown, Shield } from 'lucide-react';

export const Pricing = () => {
  const plans = [
    {
      name: "Essential Care",
      subtitle: "Budget-Friendly, Core Coverage",
      price: "$299",
      dailyValue: "$9.97",
      period: "/month",
      icon: Shield,
      features: [
        "1 monthly maintenance inspection",
        "Turnover coordination (at cost per clean)",
        "Discounted guest services",
        "Vendor recommendations",
        "Owner and guest support"
      ],
      bgColor: "bg-white",
      textColor: "text-slate-900",
      buttonColor: "bg-slate-600 hover:bg-slate-700",
      iconColor: "text-slate-600",
      popular: false,
      description: "Perfect for cost-conscious owners"
    },
    {
      name: "Premium Care",
      subtitle: "Most Popular Choice",
      price: "$449",
      dailyValue: "$14.97",
      period: "/month",
      icon: Star,
      features: [
        "Everything in Essential, plus:",
        "24/7 emergency response",
        "Bi-weekly maintenance inspections",
        "Priority scheduling for turnovers & maintenance",
        "Inventory restock coordination",
        "Storm prep readiness checks",
        "Guest check-in/out assistance",
        "On-site security options"
      ],
      bgColor: "bg-blue-600",
      textColor: "text-white",
      buttonColor: "bg-white text-blue-600 hover:bg-slate-100",
      iconColor: "text-yellow-400",
      popular: true,
      description: "Balanced for quality & peace of mind"
    },
    {
      name: "Elite Care",
      subtitle: "Luxury Partner for Premium Properties",
      price: "$599",
      dailyValue: "$19.97",
      period: "/month",
      icon: Crown,
      features: [
        "Everything in Premium, plus:",
        "Weekly inspections",
        "Concierge-level guest support included",
        "Pre-arrival walkthroughs for every booking",
        "Smart tech monitoring (locks, WiFi, cameras)",
        "White-glove vendor management",
        "Storm prep & post-storm documentation with photos/video"
      ],
      bgColor: "bg-gradient-to-br from-amber-500 to-orange-600",
      textColor: "text-white",
      buttonColor: "bg-white text-amber-600 hover:bg-slate-100",
      iconColor: "text-yellow-300",
      popular: false,
      description: "White-glove service for owners who want total peace of mind"
    }
  ];

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Pricing Plans for Owners
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            We offer flexible service tiers so every owner finds the right fit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <Card key={index} className={`relative p-8 h-full transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl border-0 shadow-lg ${plan.bgColor} overflow-hidden`}>
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-yellow-400 text-slate-900 px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                {/* Daily Value Sticker */}
                <div className="absolute top-4 right-4 transform rotate-12">
                  <div className={`px-3 py-2 rounded-full text-xs font-bold shadow-lg border-2 ${
                    plan.name === 'Essential Care' 
                      ? 'bg-green-100 text-green-800 border-green-300' 
                      : plan.name === 'Premium Care'
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    <div className="text-center">
                      <div className="text-xs opacity-75">Only</div>
                      <div className="font-black text-sm">{plan.dailyValue}/day</div>
                    </div>
                  </div>
                </div>

                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full transform translate-x-6 -translate-y-6"></div>

                <div className={`relative ${plan.textColor}`}>
                  {/* Plan header */}
                  <div className="text-center mb-8">
                    <div className="mb-4">
                      <IconComponent className={`h-12 w-12 mx-auto ${plan.iconColor}`} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 drop-shadow-sm">{plan.name}</h3>
                    <p className={`text-sm font-bold mb-2 drop-shadow-sm ${plan.popular ? 'text-blue-100' : 'text-slate-700'} ${plan.name === 'Elite Care' ? 'text-white drop-shadow-md' : ''}`}>
                      {plan.subtitle}
                    </p>
                    {plan.description && (
                      <p className={`text-xs mb-4 font-medium drop-shadow-sm ${plan.popular ? 'text-blue-200' : 'text-slate-600'} ${plan.name === 'Elite Care' ? 'text-amber-100 drop-shadow-md' : ''}`}>
                        {plan.description}
                      </p>
                    )}
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold drop-shadow-sm">{plan.price}</span>
                      <span className={`text-lg ml-1 drop-shadow-sm ${plan.popular ? 'text-blue-200' : 'text-slate-500'} ${plan.name === 'Elite Care' ? 'text-amber-200' : ''}`}>
                        {plan.period}
                      </span>
                    </div>
                    {/* Daily value text under price */}
                    <div className={`text-sm mt-2 font-medium opacity-75 ${plan.name === 'Elite Care' ? 'text-amber-200' : plan.popular ? 'text-blue-200' : 'text-slate-500'}`}>
                      That's just {plan.dailyValue} per day
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 drop-shadow-sm ${plan.popular ? 'text-blue-200' : 'text-green-500'} ${plan.name === 'Elite Care' ? 'text-amber-200' : ''}`} />
                        <span className={`text-sm leading-relaxed font-medium drop-shadow-sm ${plan.name === 'Elite Care' ? 'text-white' : ''}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button 
                    onClick={scrollToContact}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${plan.buttonColor}`}
                  >
                    Get Started
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Custom packages note */}
        <div className="text-center">
          <div className="bg-slate-100 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Need Something Different?
            </h3>
            <p className="text-slate-600 mb-4">
              Custom packages available for multi-property owners.
            </p>
            <Button 
              onClick={scrollToContact}
              variant="outline"
              className="border-2 border-slate-600 text-slate-600 hover:bg-slate-600 hover:text-white transition-all duration-200"
            >
              Contact Us for Custom Pricing
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};