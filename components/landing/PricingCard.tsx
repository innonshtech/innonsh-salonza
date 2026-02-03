import Link from 'next/link';

interface PricingCardProps {
  name: string;
  description: string;
  price: number;
  popular?: boolean;
  features: string[];
}

export default function PricingCard({ 
  name, 
  description, 
  price, 
  popular = false, 
  features 
}: PricingCardProps) {
  return (
    <div className={`relative h-full bg-white rounded-3xl p-8 shadow-xl border-2 ${
      popular ? 'pricing-card-popular' : 'border-slate-200'
    } hover:shadow-2xl hover:-translate-y-2 transition-all duration-300`}>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{name}</h3>
        <p className="text-slate-600 mb-6">{description}</p>
        
        <div className="mb-6">
          <div className="flex items-start justify-center">
            <span className="text-2xl font-bold text-slate-900 mt-2">₹</span>
            <span className="text-6xl font-bold gradient-text">{price}</span>
            <span className="text-slate-600 mt-8 ml-2">/month</span>
          </div>
        </div>

        <Link
          href="/register"
          className={`block w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 ${
            popular
              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
          }`}
        >
          Start Free Trial
        </Link>
      </div>

      <div className="space-y-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-slate-700">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}