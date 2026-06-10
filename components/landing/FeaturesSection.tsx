'use client';

import { useEffect, useRef, useState } from 'react';
import { features } from '@/data/features';

export default function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
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

  return (
    <section 
      id="features" 
      ref={sectionRef} 
      className="py-20 bg-white"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-block mb-4">
            <span className="bg-purple-50 text-purple-700 px-4 py-1.5 rounded-md text-sm font-semibold">
              POWERFUL FEATURES
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Everything You Need to Run a Modern Salon
          </h2>
          <p className="text-xl text-slate-600">
            Streamline operations, delight customers, and grow your business with our complete suite of tools.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`bg-white rounded-xl p-8 border border-slate-200 hover:border-purple-200 hover:shadow-lg transition-all duration-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="w-14 h-14 mb-6 bg-purple-100 rounded-lg flex items-center justify-center text-3xl">
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional features list */}
        <div className={`bg-slate-50 rounded-xl p-8 md:p-10 border border-slate-200 transition-all duration-700 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Plus Many More Features
            </h3>
            <p className="text-slate-600">
              Built with salon owners in mind, designed for growth
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🔔', text: 'SMS & Email Notifications' },
              { icon: '📊', text: 'Analytics & Reports' },
              { icon: '👥', text: 'Staff Management' },
              { icon: '💳', text: 'Payment Integration' },
              { icon: '📱', text: 'Mobile Responsive' },
              { icon: '🎨', text: 'Customizable Branding' },
            ].map((item, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-slate-200"
              >
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                  {item.icon}
                </div>
                <span className="font-semibold text-slate-800">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}