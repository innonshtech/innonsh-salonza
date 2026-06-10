'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function PricingSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const plans = [
    {
      name: 'Basic',
      description: 'Perfect for solo stylists and small salons',
      monthlyPrice: 299,
      annualPrice: 2990,
      popular: false,
      features: [
        'Branded booking website',
        'Live queue system',
        'Owner dashboard',
        'Up to 50 bookings/month',
        'SMS & Email notifications',
        'Basic analytics',
        'Mobile responsive',
        'Email support',
      ],
    },
    {
      name: 'Pro',
      description: 'For growing salons with multiple staff',
      monthlyPrice: 699,
      annualPrice: 6990,
      popular: true,
      features: [
        'Everything in Basic',
        'Unlimited bookings',
        'Staff management',
        'Multi-chair queue system',
        'Advanced analytics',
        'Priority customer support',
        'Custom branding',
        'Payment integration',
        'API access',
      ],
    },
  ];

  return (
    <section 
      id="pricing" 
      ref={sectionRef} 
      className="section-padding bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid opacity-20"></div>

      <div className="container-custom mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className={`text-center max-w-3xl mx-auto mb-12 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-block mb-4">
            <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
              SIMPLE PRICING
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Choose Your <span className="gradient-text">Perfect Plan</span>
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Start with a 14-day free trial. No credit card required.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-md border border-slate-200">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                !isAnnual
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                isAnnual
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                Save 16%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              } ${plan.popular ? 'md:scale-105' : ''}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className={`relative h-full bg-white rounded-3xl p-8 shadow-xl border-2 ${
                plan.popular ? 'pricing-card-popular' : 'border-slate-200'
              } hover:shadow-2xl hover:-translate-y-2 transition-all duration-300`}>
                {/* Plan header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-slate-600 mb-6">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-start justify-center">
                      <span className="text-2xl font-bold text-slate-900 mt-2">₹</span>
                      <span className="text-6xl font-bold gradient-text">
                        {isAnnual 
                          ? Math.floor(plan.annualPrice / 12)
                          : plan.monthlyPrice
                        }
                      </span>
                      <span className="text-slate-600 mt-8 ml-2">/month</span>
                    </div>
                    {isAnnual && (
                      <div className="text-sm text-slate-500 mt-2">
                        Billed annually at ₹{plan.annualPrice}
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Link
                    href="/register"
                    className={`block w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg hover:shadow-xl'
                        : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    Start Free Trial
                  </Link>
                </div>

                {/* Features list */}
                <div className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-slate-700">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className={`text-center mt-12 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <p className="text-slate-600 mb-4">
            All plans include 14-day free trial • No credit card required • Cancel anytime
          </p>
          <p className="text-slate-500 text-sm">
            Need a custom plan for multiple locations? <Link href="/contact" className="text-purple-600 hover:underline font-semibold">Contact us</Link>
          </p>
        </div>
      </div>
    </section>
  );
}