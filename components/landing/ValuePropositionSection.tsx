'use client';

import { useEffect, useRef, useState } from 'react';
import { valueProps } from '@/data/valueProps';

export default function ValuePropositionSection() {
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
    <section ref={sectionRef} className="section-padding bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container-custom mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Choose TrimSetGo?
          </h2>
          <p className="text-xl text-purple-100">
            We&apos;ve thought of everything to make your salon management effortless and efficient.
          </p>
        </div>

        {/* Value props grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {valueProps.map((prop, index) => (
            <div
              key={prop.id}
              className={`group bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {prop.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3">
                {prop.title}
              </h3>
              <p className="text-purple-100 leading-relaxed">
                {prop.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom stat bar */}
        <div className={`mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {[
            { value: '500+', label: 'Active Salons' },
            { value: '10K+', label: 'Happy Customers' },
            { value: '80%', label: 'Fewer Phone Calls' },
            { value: '4.9/5', label: 'Customer Rating' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-purple-200 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}