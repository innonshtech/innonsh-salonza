import './landing.css';
import Navbar from '@/components/landing/Navbar';
import MobileMenu from '@/components/landing/MobileMenu';
import Hero from '@/components/landing/Hero';
import Logos from '@/components/landing/Logos';
import Problem from '@/components/landing/Problem';
import Solution from '@/components/landing/Solution';
import Modules from '@/components/landing/Modules';
import Experience from '@/components/landing/Experience';
import Roles from '@/components/landing/Roles';
import Impact from '@/components/landing/Impact';
import HowItWorks from '@/components/landing/HowItWorks';
import Testimonials from '@/components/landing/Testimonials';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';
import GSAPWrapper from '@/components/landing/GSAPWrapper';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <MobileMenu />
      <GSAPWrapper>
        <Hero />
        <Logos />
        <Problem />
        <Solution />
        <Modules />
        <Experience />
        <Roles />
        <Impact />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </GSAPWrapper>
      <Footer />
    </main>
  );
}