import Hero from '@/components/landing/Hero';
import PainPointsSection from '@/components/landing/PainPointsSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import ScreenshotsSection from '@/components/landing/ScreenshotsSection';
import ValuePropositionSection from '@/components/landing/ValuePropositionSection';
import PricingSection from '@/components/landing/PricingSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import FAQSection from '@/components/landing/FAQSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';
import Navbar from '@/components/landing/Navbar';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <PainPointsSection />
      <FeaturesSection />
      <ScreenshotsSection />
      <ValuePropositionSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}