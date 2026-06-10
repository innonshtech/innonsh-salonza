import re
import os

with open('salonos v2.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace branding
html = html.replace('SalonOS', 'Innonsh Salonza')

# Common JSX replacements
html = re.sub(r'\bclass=', 'className=', html)
html = re.sub(r'\bstroke-width=', 'strokeWidth=', html)
html = re.sub(r'\bstroke-linecap=', 'strokeLinecap=', html)
html = re.sub(r'\bstroke-linejoin=', 'strokeLinejoin=', html)
html = re.sub(r'<br>', '<br />', html)
html = re.sub(r'<img([^>]*[^/])>', r'<img\1 />', html)

# Convert inline styles: style="background:linear-gradient(...)" to style={{background: "..."}}
def style_replacer(match):
    styles = match.group(1)
    # Simple conversion assuming key:value; format
    # This is a bit fragile but works for simple cases
    style_obj = "{"
    rules = [r.strip() for r in styles.split(';') if r.strip()]
    for rule in rules:
        parts = rule.split(':', 1)
        if len(parts) == 2:
            key = parts[0].strip()
            # camelCase key
            key = re.sub(r'-([a-z])', lambda m: m.group(1).upper(), key)
            val = parts[1].strip().replace('"', "'")
            style_obj += f"{key}: '{val}', "
    style_obj += "}"
    return f'style={{{style_obj}}}'

html = re.sub(r'style="([^"]*)"', style_replacer, html)

# Sections to extract
sections = {
    'Navbar': r'<nav className="nav".*?</nav>',
    'MobileMenu': r'<aside className="mobile-menu".*?</aside>',
    'Hero': r'<header className="hero".*?</header>',
    'Logos': r'<section className="logos".*?</section>',
    'Problem': r'<section className="problem pad".*?</section>',
    'Solution': r'<section className="solution pad".*?</section>',
    'Modules': r'<section className="pad" id="modules".*?</section>',
    'Experience': r'<section className="experience pad" id="experience".*?</section>',
    'Roles': r'<section className="pad" id="roles".*?</section>',
    'Impact': r'<section className="impact pad" id="impact".*?</section>',
    'HowItWorks': r'<section className="how pad" id="how".*?</section>',
    'Testimonials': r'<section className="testimonials pad-sm".*?</section>',
    'CTA': r'<section className="cta-final".*?</section>',
    'Footer': r'<footer.*?>.*?</footer>'
}

os.makedirs('components/landing', exist_ok=True)

# Generate GSAPWrapper placeholder
gsap_wrapper = """'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function GSAPWrapper({ children }: { children: React.ReactNode }) {
  const container = useRef(null);

  useGSAP(() => {
    // Basic animation defaults
    const isScale = (el) => el.getAttribute('data-anim') === 'scale';
    
    gsap.utils.toArray('[data-anim]').forEach((el) => {
      gsap.fromTo(el,
        isScale(el) ? {opacity:0, scale:0.92} : {opacity:0, y:34},
        {
          opacity:1, y:0, scale:1, duration:1, ease:'power3.out',
          scrollTrigger:{ trigger:el, start:'top 86%', toggleActions:'play none none none' }
        }
      );
    });

    ['.problem-grid','.modules-grid','.roles-grid','.stats-grid'].forEach((sel) => {
      const parent = document.querySelector(sel);
      if(!parent) return;
      gsap.set(parent.children, {opacity:0, y:34});
      ScrollTrigger.create({
        trigger:parent, start:'top 82%',
        onEnter:() => {
          gsap.to(parent.children, {opacity:1, y:0, duration:0.8, ease:'power3.out', stagger:0.07});
        }, once:true
      });
    });

    // Counters
    document.querySelectorAll('[data-count]').forEach((el) => {
      const target = parseFloat(el.getAttribute('data-count'));
      const dec = parseInt(el.getAttribute('data-decimals')||'0',10);
      const obj = {v:0};
      ScrollTrigger.create({
        trigger:el, start:'top 92%', once:true,
        onEnter:() => {
          gsap.to(obj,{v:target, duration:1.8, ease:'power2.out',
            onUpdate:() => { el.textContent = obj.v.toFixed(dec); }
          });
        }
      });
    });

    // Parallax
    const heroVisual = document.getElementById('heroVisual');
    const pItems = document.querySelectorAll('[data-parallax]');
    pItems.forEach((el) => {
      const depth = parseFloat(el.getAttribute('data-parallax'));
      gsap.to(el, {
        y: depth, ease:'none',
        scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:1 }
      });
    });

    // Chart Line
    const line = document.getElementById('linePath');
    if(line){
      const len = line.getTotalLength();
      gsap.set(line, {strokeDasharray:len, strokeDashoffset:len});
      ScrollTrigger.create({
        trigger:'.sol-visual', start:'top 75%', once:true,
        onEnter:() => { gsap.to(line, {strokeDashoffset:0, duration:1.8, ease:'power2.inOut'}); }
      });
    }

    // Marquee
    const marquee = document.getElementById('marquee');
    if(marquee){
      const totalW = marquee.scrollWidth / 2;
      const loop = gsap.to(marquee, { x: -totalW, duration:36, ease:'none', repeat:-1 });
      marquee.parentElement.addEventListener('mouseenter', () => gsap.to(loop,{timeScale:0, duration:0.5}));
      marquee.parentElement.addEventListener('mouseleave', () => gsap.to(loop,{timeScale:1, duration:0.5}));
    }

    // Floating Chips
    gsap.utils.toArray('.float-chip').forEach((chip, i) => {
      gsap.to(chip, { y:'+=14', duration:2.6+i*0.4, ease:'sine.inOut', yoyo:true, repeat:-1 });
    });

    ScrollTrigger.refresh();
  }, { scope: container });

  return (
    <div ref={container} className="ready">
      {children}
    </div>
  );
}
"""

with open('components/landing/GSAPWrapper.tsx', 'w', encoding='utf-8') as f:
    f.write(gsap_wrapper)

for name, regex in sections.items():
    match = re.search(regex, html, re.DOTALL)
    if match:
        content = match.group(0)
        
        # Specific component logic
        if name == 'Navbar':
            # Add state for mobile menu
            content = content.replace('className="menu-btn" id="menuBtn"', 'className={`menu-btn ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(!isOpen)}')
            content = content.replace('href="#" className="signin"', 'href="/login" className="signin"')
            content = content.replace('href="#cta" className="btn btn-primary"', 'href="/contact" className="btn btn-primary"')
            content = content.replace('Book demo', 'Contact Sales')
            
            component = f"""'use client';
import Link from 'next/link';
import {{ useState }} from 'react';

export default function {name}() {{
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {content}
      <div className={{`overlay ${{isOpen ? 'open' : ''}}`}} onClick={{() => setIsOpen(false)}}></div>
      <aside className={{`mobile-menu ${{isOpen ? 'open' : ''}}`}}>
        <a href="#modules">Modules</a>
        <a href="#experience">Product</a>
        <a href="#roles">Roles</a>
        <a href="#impact">Results</a>
        <a href="#how">How it works</a>
        <a href="/contact" className="btn btn-primary">Contact Sales</a>
      </aside>
    </>
  );
}}"""
        else:
            if 'Book demo' in content:
                content = content.replace('Book demo', 'Contact Sales')
                content = content.replace('href="#cta"', 'href="/contact"')
            component = f"""export default function {name}() {{
  return (
    {content}
  );
}}"""
        
        with open(f'components/landing/{name}.tsx', 'w', encoding='utf-8') as f:
            f.write(component)
        print(f"Extracted {name}")
    else:
        print(f"Failed to find {name}")

