'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function GSAPWrapper({ children }: { children: React.ReactNode }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    document.body.classList.add('ready');

    // Basic animation defaults
    const isScale = (el: any) => el.getAttribute('data-anim') === 'scale';
    
    gsap.utils.toArray('[data-anim]').forEach((el: any) => {
      gsap.fromTo(el,
        isScale(el) ? {opacity:0, scale:0.92} : {opacity:0, y:34},
        {
          opacity:1, y:0, scale:1, duration:1, ease:'power3.out',
          scrollTrigger:{ trigger:el, start:'top 86%', toggleActions:'play none none none' }
        }
      );
    });

    ['.problem-grid','.modules-grid','.roles-grid','.stats-grid'].forEach((sel: string) => {
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
    document.querySelectorAll('[data-count]').forEach((el: any) => {
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

    // Parallax (scroll trigger)
    const heroVisual = document.getElementById('heroVisual');
    const pItems = document.querySelectorAll('[data-parallax]');
    pItems.forEach((el: any) => {
      const depth = parseFloat(el.getAttribute('data-parallax'));
      gsap.to(el, {
        y: depth, ease:'none',
        scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:1 }
      });
    });

    // Parallax mouse interaction
    let handleMouseMove: any;
    let handleMouseLeave: any;
    if(heroVisual && window.matchMedia('(hover:hover)').matches){
      handleMouseMove = (e: MouseEvent) => {
        const r = heroVisual.getBoundingClientRect();
        const cx = (e.clientX - r.left)/r.width - .5;
        const cy = (e.clientY - r.top)/r.height - .5;
        pItems.forEach((el: any) => {
          const depth = parseFloat(el.getAttribute('data-parallax'))/4;
          gsap.to(el, {x: cx*depth, rotateY: cx*4, rotateX: -cy*4, duration:0.9, ease:'power2.out', overwrite:'auto'});
        });
      };
      
      handleMouseLeave = () => {
        pItems.forEach((el: any) => {
          gsap.to(el,{x:0, rotateX:0, rotateY:0, duration:1, ease:'power2.out'});
        });
      };

      heroVisual.addEventListener('mousemove', handleMouseMove);
      heroVisual.addEventListener('mouseleave', handleMouseLeave);
    }

    // Horizontal scroll (product experience)
    const track = document.getElementById('hTrack');
    const wrap = document.getElementById('hScrollWrap');
    if(track && window.innerWidth > 680){
      const getScrollDist = () => track.scrollWidth - window.innerWidth + 80;
      gsap.to(track, {
        x: () => -getScrollDist(),
        ease:'none',
        scrollTrigger:{
          trigger: wrap,
          start:'top 80px',
          end: () => '+=' + getScrollDist(),
          scrub:1, pin:true, anticipatePin:1, invalidateOnRefresh:true
        }
      });
    }

    // Timeline step highlight
    gsap.utils.toArray('.tl-step').forEach((step: any) => {
      ScrollTrigger.create({
        trigger:step, start:'top 70%', end:'bottom 60%',
        onEnter:() => { step.classList.add('active'); },
        onLeaveBack:() => { step.classList.remove('active'); }
      });
    });

    // Chart Line
    const line = document.getElementById('linePath') as any;
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
    let marqueeEnter: any;
    let marqueeLeave: any;
    let loop: any;
    let marqueeParent: HTMLElement | null = null;
    if(marquee){
      if (!marquee.getAttribute('data-cloned')) {
        const clone = marquee.innerHTML;
        marquee.innerHTML += clone;
        marquee.setAttribute('data-cloned', 'true');
      }
      const totalW = marquee.scrollWidth / 2;
      loop = gsap.to(marquee, { x: -totalW, duration:36, ease:'none', repeat:-1 });
      
      marqueeEnter = () => gsap.to(loop,{timeScale:0, duration:0.5});
      marqueeLeave = () => gsap.to(loop,{timeScale:1, duration:0.5});
      
      marqueeParent = marquee.parentElement;
      marqueeParent?.addEventListener('mouseenter', marqueeEnter);
      marqueeParent?.addEventListener('mouseleave', marqueeLeave);
    }

    // Floating Chips
    gsap.utils.toArray('.float-chip').forEach((chip: any, i: number) => {
      gsap.to(chip, { y:'+=14', duration:2.6+i*0.4, ease:'sine.inOut', yoyo:true, repeat:-1 });
    });

    // Magnetic buttons
    const magneticBtns = document.querySelectorAll('[data-magnetic]');
    const magneticHandlers = new Map<any, { move: any, leave: any }>();
    if(window.matchMedia('(hover:hover)').matches){
      magneticBtns.forEach((btn: any) => {
        const handleBtnMouseMove = (e: MouseEvent) => {
          const r = btn.getBoundingClientRect();
          const x = e.clientX - r.left - r.width/2;
          const y = e.clientY - r.top - r.height/2;
          gsap.to(btn, {x:x*.3, y:y*.4, duration:.4, ease:'power2.out'});
        };
        const handleBtnMouseLeave = () => {
          gsap.to(btn, {x:0, y:0, duration:.6, ease:'elastic.out(1,.4)'});
        };

        btn.addEventListener('mousemove', handleBtnMouseMove);
        btn.addEventListener('mouseleave', handleBtnMouseLeave);
        magneticHandlers.set(btn, { move: handleBtnMouseMove, leave: handleBtnMouseLeave });
      });
    }

    // Smooth anchor scrolling
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    const anchorHandlers = new Map<any, any>();
    anchorLinks.forEach((a: any) => {
      const handleAnchorClick = (e: Event) => {
        const id = a.getAttribute('href');
        if(id.length < 2) return;
        const t = document.querySelector(id);
        if(!t) return;
        e.preventDefault();
        const top = t.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({top:top, behavior:'smooth'});
      };
      a.addEventListener('click', handleAnchorClick);
      anchorHandlers.set(a, handleAnchorClick);
    });

    ScrollTrigger.refresh();

    // Clean up event listeners on unmount
    return () => {
      document.body.classList.remove('ready');
      if(heroVisual && handleMouseMove && handleMouseLeave) {
        heroVisual.removeEventListener('mousemove', handleMouseMove);
        heroVisual.removeEventListener('mouseleave', handleMouseLeave);
      }
      if(marqueeParent && marqueeEnter && marqueeLeave) {
        marqueeParent.removeEventListener('mouseenter', marqueeEnter);
        marqueeParent.removeEventListener('mouseleave', marqueeLeave);
      }
      magneticBtns.forEach((btn: any) => {
        const handlers = magneticHandlers.get(btn);
        if (handlers) {
          btn.removeEventListener('mousemove', handlers.move);
          btn.removeEventListener('mouseleave', handlers.leave);
        }
      });
      anchorLinks.forEach((a: any) => {
        const handler = anchorHandlers.get(a);
        if (handler) {
          a.removeEventListener('click', handler);
        }
      });
    };
  });

  return (
    <div ref={container}>
      {children}
    </div>
  );
}
