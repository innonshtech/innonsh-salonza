'use client';

import { useEffect, useRef, useState } from 'react';
import { testimonials } from '@/data/testimonials';

export default function TestimonialsSection() {
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
      id="testimonials" 
      ref={sectionRef} 
      className="section-padding bg-white relative overflow-hidden"
    >
      <div className="container-custom mx-auto px-6">
        {/* Section header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-block mb-4">
            <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold">
              TESTIMONIALS
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Loved by Salon Owners <span className="gradient-text">Across India</span>
          </h2>
          <p className="text-xl text-slate-600">
            Join hundreds of successful salon owners who transformed their business with TrimSetGo.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`group bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Stars */}
              <div className="flex space-x-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-slate-700 leading-relaxed mb-6 text-lg">
                &apos;{testimonial.text}&apos;
              </blockquote>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-slate-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-slate-600">
                    {testimonial.role}
                  </div>
                  <div className="text-sm text-purple-600">
                    📍 {testimonial.location}
                  </div>
                </div>
              </div>

              {/* Decorative quote mark */}
              <div className="absolute top-6 right-6 text-6xl text-purple-100 opacity-50 group-hover:text-purple-200 transition-colors">
                &apos;
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className={`mt-16 text-center transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex flex-wrap items-center justify-center gap-8 bg-gradient-to-r from-purple-50 to-pink-50 px-8 py-6 rounded-2xl border border-purple-200">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">⭐</span>
              <div className="text-left">
                <div className="font-bold text-slate-900">4.9/5 Rating</div>
                <div className="text-sm text-slate-600">From 200+ reviews</div>
              </div>
            </div>
            <div className="h-12 w-px bg-purple-300"></div>
            <div className="flex items-center space-x-2">
              <span className="text-3xl">🏆</span>
              <div className="text-left">
                <div className="font-bold text-slate-900">Top Rated</div>
                <div className="text-sm text-slate-600">Salon management tool</div>
              </div>
            </div>
            <div className="h-12 w-px bg-purple-300"></div>
            <div className="flex items-center space-x-2">
              <span className="text-3xl">💜</span>
              <div className="text-left">
                <div className="font-bold text-slate-900">500+ Salons</div>
                <div className="text-sm text-slate-600">Trust TrimSetGo</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}