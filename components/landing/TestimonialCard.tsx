interface TestimonialCardProps {
  name: string;
  role: string;
  location: string;
  image: string;
  rating: number;
  text: string;
}

export default function TestimonialCard({ 
  name, 
  role, 
  location, 
  image, 
  rating, 
  text 
}: TestimonialCardProps) {
  return (
    <div className="group bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
      {/* Stars */}
      <div className="flex space-x-1 mb-6">
        {[...Array(rating)].map((_, i) => (
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
        &apos;{text}&apos;
      </blockquote>

      {/* Author */}
      <div className="flex items-center space-x-4">
        <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
          {name.charAt(0)}
        </div>
        <div>
          <div className="font-bold text-slate-900">{name}</div>
          <div className="text-sm text-slate-600">{role}</div>
          <div className="text-sm text-purple-600">📍 {location}</div>
        </div>
      </div>

      {/* Decorative quote mark */}
      <div className="absolute top-6 right-6 text-6xl text-purple-100 opacity-50 group-hover:text-purple-200 transition-colors">
        &apos;
      </div>
    </div>
  );
}