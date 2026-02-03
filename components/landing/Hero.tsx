'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative bg-white pt-32 pb-20 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-md mb-8">
              <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
              <span className="text-sm font-medium text-purple-900">Trusted by 500+ Salons</span>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
              The Smart Way to Manage Your Salon
            </h1>

            {/* Subtext */}
            <p className="text-xl text-slate-600 mb-4">
              No calls. No waiting. Just smooth bookings.
            </p>

            <p className="text-lg text-slate-500 mb-10">
              A complete queue & booking automation system for salons & spas. Reduce phone calls by 80%. Delight customers with instant booking.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link 
                href="/register" 
                className="px-8 py-4 bg-purple-600 text-white rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors text-center"
              >
                Start Free Trial
              </Link>
              <Link 
                href="/demo" 
                className="px-8 py-4 bg-white text-slate-900 rounded-lg font-semibold text-lg border-2 border-slate-200 hover:border-slate-300 transition-colors text-center"
              >
                See Demo
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No credit card</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Right content - Dashboard mockup */}
          <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            {/* Main dashboard mockup */}
            <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
              <div className="bg-slate-900 px-6 py-3 flex items-center space-x-2">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                  <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                  <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                </div>
                <div className="flex-1 text-center text-white text-sm font-medium">Dashboard</div>
              </div>
              <div className="p-8 bg-slate-50">
                {/* Stats cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white p-5 rounded-lg border border-slate-200">
                    <div className="text-3xl font-bold text-slate-900">24</div>
                    <div className="text-sm text-slate-600 mt-1">Today&apos;s Bookings</div>
                  </div>
                  <div className="bg-white p-5 rounded-lg border border-slate-200">
                    <div className="text-3xl font-bold text-slate-900">8</div>
                    <div className="text-sm text-slate-600 mt-1">In Queue</div>
                  </div>
                </div>
                {/* Queue list */}
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-white p-4 rounded-lg border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <span className="text-slate-700 font-semibold text-sm">#{item}</span>
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 text-sm">Customer {item}</div>
                          <div className="text-xs text-slate-500">Haircut & Style</div>
                        </div>
                      </div>
                      <div className="text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">Active</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}