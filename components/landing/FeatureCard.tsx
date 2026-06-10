interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}

export default function FeatureCard({ icon, title, description, gradient }: FeatureCardProps) {
  return (
    <div className="feature-card group bg-white rounded-3xl p-8 shadow-lg">
      <div className={`w-20 h-20 mb-6 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-4xl shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-purple-600 transition-colors">
        {title}
      </h3>
      <p className="text-lg text-slate-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}