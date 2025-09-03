import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Check, Star, Crown, Shield } from 'lucide-react';

export const Pricing = () => {
  const plans = [
    {
      name: "Essential Care",
      subtitle: "Budget-Friendly, Core Coverage",
      price: "$399",
      dailyValue: "$13.30",
      period: "/month",
      icon: Shield,
      features: [
        "Property monitoring",
        "1 monthly maintenance inspection",
        "Turnover coordination",
        "Non-urgent guest support",
        "Vendor recommendations",
        "Damage monitoring & recordkeeping"
      ],
      bgColor: "bg-white",
      textColor: "text-slate-900",
      buttonColor: "bg-slate-600 hover:bg-slate-700",
      iconColor: "text-slate-600",
      popular: false,
      description: "For cost-conscious owners who want reliable basics without overspending"
    },
    {
      name: "Premium Care",
      subtitle: "Most Popular Choice",
      price: "$599",
      dailyValue: "$19.97",
      period: "/month",
      icon: Star,
      features: [
        "Everything in Essential, plus:",
        "24/7 emergency response",
        "Bi-weekly maintenance inspections",
        "Priority scheduling for turnovers & maintenance assistance",
        "Guest check-in/out assistance",
        "Storm prep & post-storm checks",
        "Enhanced owner & guest support",
        "Inventory restock coordination",
        "On-site security assistance",
        "Custom property updates",
        "Revenue-boosting tips & seasonal readiness"
      ],
      bgColor: "bg-blue-600",
      textColor: "text-white",
      buttonColor: "bg-white text-blue-600 hover:bg-slate-100",
      iconColor: "text-yellow-400",
      popular: true,
      description: "The smart choice — proactive care, happier guests, and better reviews"
    },
    {
      name: "Elite Care",
      subtitle: "Luxury Partner Plan",
      price: "$799",
      dailyValue: "$26.63",
      period: "/month",
      icon: Crown,
      features: [
        "Everything in Premium, plus:",
        "Dedicated hands on property manager",
        "Weekly inspections",
        "Concierge-level guest support included",
        "Pre-arrival walkthroughs",
        "VIP guest experience services available",
        "Storm prep & post-storm documentation",
        "Smart tech monitoring assistance",
        "White-glove vendor management",
        "Damage claim support with photographs/video",
        "Competitive hosting advantages and resources"
      ],
      bgColor: "bg-gradient-to-br from-amber-500 to-orange-600",
      textColor: "text-white",
      buttonColor: "bg-white text-amber-600 hover:bg-slate-100",
      iconColor: "text-yellow-300",
      popular: false,
      description: "Exclusive partnership for owners who want total peace of mind and VIP guest experiences"
    }
  ];

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="pricing" className="pt-32 pb-20 bg-white overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Pricing Plans for Owners
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            We offer flexible service tiers so every owner finds the right fit.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-12 items-start justify-center">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <div key={index} className="flex-1 max-w-sm mx-auto relative">
                {/* Badge space for ALL cards - reserve space even if no badge */}
                <div className="text-center mb-8 pt-4 h-16 flex items-center justify-center">
                  {plan.popular && (
                    <span className="bg-yellow-400 text-slate-900 px-6 py-3 rounded-full text-base font-bold shadow-xl whitespace-nowrap inline-block border-2 border-yellow-600">
                      ⭐ MOST POPULAR ⭐
                    </span>
                  )}
                </div>
                <Card className={`relative p-8 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl border-0 shadow-lg ${plan.bgColor} overflow-visible`}>

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