'use client';

import { useEffect, useRef, useState } from 'react';

export default function ScreenshotsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
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

  const screenshots = [
    {
      title: 'Owner Dashboard',
      description: 'Manage your entire salon from one beautiful, intuitive dashboard',
      features: ['Real-time bookings', 'Queue overview', 'Staff scheduling', 'Revenue analytics'],
    },
    {
      title: 'Queue Management',
      description: 'Keep your queue organized and customers informed automatically',
      features: ['Live position updates', 'Wait time estimates', 'Automated notifications', 'Walk-in support'],
    },
    {
      title: 'Public Booking Page',
      description: 'Your customers get a beautiful, branded booking experience',
      features: ['Easy appointment booking', 'Service selection', 'Time slot availability', 'Instant confirmation'],
    },
    {
      title: 'Service Management',
      description: 'Create and customize services with pricing and duration',
      features: ['Add unlimited services', 'Custom pricing', 'Duration settings', 'Service categories'],
    },
  ];

  return (
    <section ref={sectionRef} className="section-padding bg-white relative overflow-hidden">
      <div className="container-custom mx-auto px-6">
        {/* Section header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-block mb-4">
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
              SEE IT IN ACTION
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Beautiful, <span className="gradient-text">Professional</span> Interface
          </h2>
          <p className="text-xl text-slate-600">
            Designed to be simple yet powerful. Your team will love using it.
          </p>
        </div>

        {/* Tab navigation */}
        <div className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {screenshots.map((screenshot, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === index
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg scale-105'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {screenshot.title}
            </button>
          ))}
        </div>

        {/* Screenshot display */}
        <div className={`transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Screenshot mockup */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border-8 border-slate-800">
                {/* Browser header */}
                <div className="bg-slate-800 px-4 py-3 flex items-center space-x-2">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-slate-700 rounded px-3 py-1 text-slate-400 text-xs">
                    TrimSetGo.com/dashboard
                  </div>
                </div>
                
                {/* Screenshot placeholder */}
                <div className="bg-gradient-to-br from-purple-50 to-white p-8 min-h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl mx-auto mb-6 flex items-center justify-center text-5xl shadow-xl">
                      {screenshots[activeTab].title === 'Owner Dashboard' && '📊'}
                      {screenshots[activeTab].title === 'Queue Management' && '⏱️'}
                      {screenshots[activeTab].title === 'Public Booking Page' && '📅'}
                      {screenshots[activeTab].title === 'Service Management' && '✂️'}
                    </div>
                    <p className="text-slate-500 text-sm">
                      Interactive {screenshots[activeTab].title}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Description */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-slate-900">
                {screenshots[activeTab].title}
              </h3>
              <p className="text-xl text-slate-600 leading-relaxed">
                {screenshots[activeTab].description}
              </p>
              
              <div className="space-y-4">
                {screenshots[activeTab].features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 group">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg text-slate-700 group-hover:text-purple-600 transition-colors">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}