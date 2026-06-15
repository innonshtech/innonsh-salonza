'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`} id="nav">
        <div className="wrap nav-inner">
          <a href="#top" className="logo">
            <img src="/salon_logo.png" alt="Innonsh Salonza Logo" className="h-8 w-auto" />
            Innonsh Salonza
          </a>
          <ul className="nav-links">
            <li><a href="#modules">Modules</a></li>
            <li><a href="#experience">Product</a></li>
            <li><a href="#roles">Roles</a></li>
            <li><a href="#impact">Results</a></li>
            <li><a href="#how">How it works</a></li>
          </ul>
          <div className="nav-cta">
            <a href="/login" className="signin">Sign in</a>
            <a href="/contact" className="btn btn-primary" data-magnetic>Contact Sales</a>
            <button className={`menu-btn ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(!isOpen)} aria-label="Open menu"><span></span><span></span><span></span></button>
          </div>
        </div>
      </nav>
      <div className={`overlay ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)}></div>
      <aside className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <a href="#modules">Modules</a>
        <a href="#experience">Product</a>
        <a href="#roles">Roles</a>
        <a href="#impact">Results</a>
        <a href="#how">How it works</a>
        <a href="/contact" className="btn btn-primary">Contact Sales</a>
      </aside>
    </>
  );
}