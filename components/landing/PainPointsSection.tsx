'use client';

import { useEffect, useRef, useState } from 'react';

export default function PainPointsSection() {
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

  const painPoints = [
    {
      icon: '📞',
      title: 'Endless Phone Calls',
      description: 'Customers keep calling to check waiting times and book appointments, taking up valuable time.',
    },
    {
      icon: '📝',
      title: 'Manual Booking Chaos',
      description: 'Managing bookings manually leads to errors, double bookings, and frustrated customers.',
    },
    {
      icon: '⏰',
      title: 'Queue Confusion',
      description: 'Queue gets messy during rush hours, leading to arguments and unhappy customers.',
    },
    {
      icon: '😞',
      title: 'Customer Dissatisfaction',
      description: 'Long waits, unclear expectations, and poor communication result in lost business.',
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-slate-50">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Say Goodbye to Salon Chaos
          </h2>
          <p className="text-xl text-slate-600">
            Running a salon shouldn&apos;t feel like managing a crisis. These common problems waste your time and hurt your business.
          </p>
        </div>

        {/* Pain points grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {painPoints.map((point, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-6 border border-slate-200 hover:border-purple-200 hover:shadow-lg transition-all duration-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="w-12 h-12 mb-4 bg-slate-100 rounded-lg flex items-center justify-center text-2xl">
                {point.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {point.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-12 transition-all duration-700 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center space-x-2 bg-purple-50 px-6 py-3 rounded-lg border border-purple-100">
            <span className="text-lg">✨</span>
            <span className="text-purple-900 font-semibold">
              TrimSetGo solves all these problems automatically
            </span>
            <span className="text-lg">✨</span>
          </div>
        </div>
      </div>
    </section>
  );
}