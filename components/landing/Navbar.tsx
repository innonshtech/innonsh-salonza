'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white shadow-sm' 
        : 'bg-white'
    }`}>
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold text-slate-900">TrimSetGo</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              Pricing
            </Link>
            <Link href="#testimonials" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              Testimonials
            </Link>
            <Link href="#faq" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              FAQ
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              Login
            </Link>
            <Link 
              href="/register" 
              className="px-5 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-3">
              <Link href="#features" className="text-slate-600 hover:text-slate-900 font-medium py-2">
                Features
              </Link>
              <Link href="#pricing" className="text-slate-600 hover:text-slate-900 font-medium py-2">
                Pricing
              </Link>
              <Link href="#testimonials" className="text-slate-600 hover:text-slate-900 font-medium py-2">
                Testimonials
              </Link>
              <Link href="#faq" className="text-slate-600 hover:text-slate-900 font-medium py-2">
                FAQ
              </Link>
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <Link 
                  href="/login" 
                  className="block text-center px-5 py-2 text-slate-600 hover:text-slate-900 font-medium"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="block text-center px-5 py-2 bg-purple-600 text-white rounded-lg font-medium"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}