'use client';

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
