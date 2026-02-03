'use client';

import { useEffect, useRef, useState } from 'react';
import { faqs } from '@/data/faq';

export default function FAQSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
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

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section 
      id="faq" 
      ref={sectionRef} 
      className="section-padding bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid opacity-20"></div>

      <div className="container-custom mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-block mb-4">
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              QUESTIONS?
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-xl text-slate-600">
            Everything you need to know about TrimSetGo. Can&apos;t find what you&apos;re looking for? 
            <a href="/contact" className="text-purple-600 hover:underline ml-1">Contact us</a>
          </p>
        </div>

        {/* FAQ accordion */}
        <div className={`max-w-4xl mx-auto space-y-4 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="text-lg font-semibold text-slate-900 pr-8">
                  {faq.question}
                </span>
                <div className={`flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}>
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="p-6 pt-0 text-slate-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <div className={`text-center mt-12 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-block bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Still have questions?
            </h3>
            <p className="text-slate-600 mb-6">
              Our friendly team is here to help you get started
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}