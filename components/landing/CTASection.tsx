'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function CTASection() {
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
    <section ref={sectionRef} className="section-padding bg-white relative overflow-hidden">
      <div className="container-custom mx-auto px-6">
        <div className={`relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-3xl overflow-hidden transition-all duration-1000 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          {/* Background decorations */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
          </div>

          {/* Content */}
          <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 text-center">
            <div className="max-w-4xl mx-auto">
              {/* Badge */}
              <div className={`inline-block mb-6 transition-all duration-1000 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                  <span className="text-white font-semibold">🎉 Join 500+ Happy Salon Owners</span>
                </div>
              </div>

              {/* Headline */}
              <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                Ready to Transform Your Salon?
              </h2>

              {/* Subtext */}
              <p className={`text-xl md:text-2xl text-purple-100 mb-10 max-w-2xl mx-auto transition-all duration-1000 delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                Start your free 14-day trial today. No credit card required. 
                Set up in minutes and start delighting customers.
              </p>

              {/* CTA Buttons */}
              <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <Link
                  href="/register"
                  className="group px-10 py-5 bg-white text-purple-700 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
                >
                  Start Free Trial
                  <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link
                  href="/demo"
                  className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300 shadow-lg"
                >
                  Watch Demo
                </Link>
              </div>

              {/* Trust indicators */}
              <div className={`flex flex-wrap items-center justify-center gap-6 mt-10 text-purple-100 transition-all duration-1000 delay-600 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Free 14-day trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Setup in under 10 minutes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative bottom wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.1"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}