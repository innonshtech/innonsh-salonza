import dbConnect from "@/lib/dbConnect";
import Salon from "@/models/Salon";
import Service from "@/models/Service";
import Offer from "@/models/Offer";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar,
  Scissors,
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Award,
  Users,
  Heart,
  Shield,
  Zap,
  TrendingUp,
  Gift,
  Instagram,
  Facebook,
  Twitter,
  MapPinned,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function SalonPublicPage({ params }: any) {
  const { salon } = await params;

  await dbConnect();

  const salonDoc = (await Salon.findOne({ slug: salon }).lean()) as any;

  if (!salonDoc) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-500/20">
            <Scissors className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Salon Not Found
          </h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            The salon you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-2xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105"
          >
            <span>Go to Homepage</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  const services = await Service.find({ salonId: salonDoc._id }).lean();
  const offers = await Offer.find({ salonId: salonDoc._id, isActive: true }).lean();

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Scissors className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {salonDoc.name}
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-slate-700 hover:text-purple-600 font-medium transition-colors">
                Services
              </a>
              <a href="#about" className="text-slate-700 hover:text-purple-600 font-medium transition-colors">
                About
              </a>
              <a href="#gallery" className="text-slate-700 hover:text-purple-600 font-medium transition-colors">
                Gallery
              </a>
              <a href="#contact" className="text-slate-700 hover:text-purple-600 font-medium transition-colors">
                Contact
              </a>
              <Link
                href={`/book`}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden min-h-[80vh] flex items-center">
        {/* Background Image / Gradient */}
        <div className="absolute inset-0 z-0">
          {salonDoc.mainImage ? (
            <>
              <img
                src={salonDoc.mainImage}
                alt={salonDoc.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-purple-800/80 to-blue-900/90"></div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900"></div>
          )}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNHYyaDJ2LTJoLTJ6bS0yIDJ2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem00LTJ2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0tMi02djJoMnYtMmgtMnptMCAwdjJoMnYtMmgtMnptMiAydjJoMnYtMmgtMnptMC00djJoMnYtMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 mb-8">
              <Star className="w-4 h-4 text-yellow-300" />
              <span className="text-white text-sm font-medium">Premium Salon Experience</span>
              <Star className="w-4 h-4 text-yellow-300" />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                Welcome to {salonDoc.name}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-purple-100 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
              {salonDoc.about?.substring(0, 150)}... Experience luxury styling with our expert team.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href={`/book`}
                className="inline-flex items-center space-x-3 px-10 py-5 bg-white text-purple-900 font-bold text-lg rounded-2xl hover:bg-purple-50 transition-all duration-300 shadow-2xl shadow-black/20 transform hover:scale-105"
              >
                <Calendar className="w-6 h-6" />
                <span>Book Appointment</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#services"
                className="inline-flex items-center space-x-3 px-10 py-5 bg-white/10 backdrop-blur-xl text-white font-bold text-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <span>View Services</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center">
                <div className="text-4xl font-bold text-white mb-2">{salonDoc.yearsExperience || 5}+</div>
                <div className="text-purple-200 text-sm font-medium">Years Experience</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center">
                <div className="text-4xl font-bold text-white mb-2">{(salonDoc.clientsCount / 1000).toFixed(1)}K+</div>
                <div className="text-purple-200 text-sm font-medium">Happy Clients</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center">
                <div className="text-4xl font-bold text-white mb-2">{salonDoc.staffCount || 10}+</div>
                <div className="text-purple-200 text-sm font-medium">Expert Stylists</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center">
                <div className="text-4xl font-bold text-white mb-2">{salonDoc.rating || 4.9}</div>
                <div className="text-purple-200 text-sm font-medium">Average Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="white" className="opacity-100" />
          </svg>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg shadow-purple-500/30">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Why Choose {salonDoc.name}?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Experience the difference with our premium services and expert care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-white to-purple-50 rounded-3xl p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-300 border border-slate-100 hover:border-purple-200">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/30">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Instant Booking</h3>
              <p className="text-slate-600 leading-relaxed">
                Book your appointment online 24/7. No phone calls, no waiting. Get confirmed in seconds with our seamless booking system.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-300 border border-slate-100 hover:border-purple-200">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/30">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Real-Time Updates</h3>
              <p className="text-slate-600 leading-relaxed">
                Stay informed with instant notifications about your appointment status, queue position, and estimated wait time.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-white to-pink-50 rounded-3xl p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-300 border border-slate-100 hover:border-purple-200">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/30">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Premium Quality</h3>
              <p className="text-slate-600 leading-relaxed">
                Expert stylists with years of experience, using only the finest products to deliver exceptional results every time.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-white to-orange-50 rounded-3xl p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-300 border border-slate-100 hover:border-purple-200">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/30">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Hygiene First</h3>
              <p className="text-slate-600 leading-relaxed">
                Your safety is our priority. We maintain the highest standards of cleanliness and sanitization protocols.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-white to-yellow-50 rounded-3xl p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-300 border border-slate-100 hover:border-purple-200">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-yellow-500/30">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Expert Team</h3>
              <p className="text-slate-600 leading-relaxed">
                Our certified professionals stay updated with the latest trends and techniques to give you the best experience.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-white to-teal-50 rounded-3xl p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-300 border border-slate-100 hover:border-purple-200">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-teal-500/30">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Customer Care</h3>
              <p className="text-slate-600 leading-relaxed">
                Personalized attention and care for every client. Your satisfaction is our success and we go the extra mile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg shadow-purple-500/30">
              <Scissors className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Our Premium Services
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Discover our curated collection of professional beauty treatments
            </p>
          </div>

          {services.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-16 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Scissors className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Services Coming Soon
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed max-w-md mx-auto">
                We&apos;re crafting an exceptional service menu for you. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service: any, index: number) => (
                <div
                  key={service._id.toString()}
                  className="group bg-white rounded-3xl shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-purple-200/50 border border-slate-100 hover:border-purple-200 p-8 transition-all duration-300 transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mb-6 group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-300 group-hover:scale-110 shadow-lg group-hover:shadow-purple-500/30">
                    <Scissors className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors" />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-purple-600 transition-colors">
                    {service.name}
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-slate-600">
                        <Clock className="w-5 h-5 mr-2 text-purple-500" />
                        <span className="font-medium">{service.duration} mins</span>
                      </div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        ₹{service.price}
                      </div>
                    </div>
                  </div>

                  {service.description && (
                    <p className="text-slate-600 leading-relaxed border-t border-slate-100 pt-6">
                      {service.description}
                    </p>
                  )}

                  <Link
                    href={`/book`}
                    className="mt-6 w-full inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
                <Heart className="w-4 h-4 text-purple-600" />
                <span className="text-purple-600 text-sm font-semibold">About Us</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Your Beauty, Our Passion
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                {salonDoc.about}
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{salonDoc.yearsExperience || 5}+</div>
                  <div className="text-slate-700 font-medium">Years Experience</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{(salonDoc.clientsCount / 1000).toFixed(1)}K+</div>
                  <div className="text-slate-700 font-medium">Happy Clients</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/20">
                {salonDoc.mainImage ? (
                  <img
                    src={salonDoc.mainImage}
                    alt={salonDoc.name}
                    className="w-full aspect-[4/5] object-cover"
                  />
                ) : (
                  <div className="aspect-[4/5] bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <div className="text-center text-white p-12">
                      <Scissors className="w-24 h-24 mx-auto mb-6 opacity-50" />
                      <p className="text-2xl font-bold">Your Salon Image</p>
                      <p className="text-purple-100 mt-2">Showcase your beautiful space</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl -z-10 blur-3xl opacity-30"></div>
              <div className="absolute -top-6 -left-6 w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl -z-10 blur-3xl opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg shadow-purple-500/30">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Our Work Speaks
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Discover the transformations we create every day
            </p>
          </div>

          {!salonDoc.gallery || salonDoc.gallery.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-16 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Scissors className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Gallery Coming Soon
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed max-w-md mx-auto">
                We&apos;re putting together a collection of our best work. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {salonDoc.gallery.map((url: string, index: number) => (
                <div
                  key={index}
                  className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <img
                    src={url}
                    alt={`${salonDoc.name} work ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-semibold">View Work</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg shadow-purple-500/30">
              <Star className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Real experiences from our valued customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                role: "Regular Client",
                rating: 5,
                review: "Absolutely amazing experience! The staff is professional and the results are always perfect. I wouldn't go anywhere else!"
              },
              {
                name: "Rahul Mehta",
                role: "Business Professional",
                rating: 5,
                review: "Best salon in town! The online booking system is so convenient and the service quality is consistently excellent."
              },
              {
                name: "Anita Desai",
                role: "Fashion Designer",
                rating: 5,
                review: "The attention to detail and personalized care is unmatched. They truly understand what their clients want."
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 leading-relaxed mb-6 italic">
                  &ldquo;{testimonial.review}&rdquo;
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mb-6 shadow-lg shadow-orange-500/30">
              <Gift className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Special Offers
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Exclusive deals and packages for our valued clients
            </p>
          </div>

          {offers.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-16 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Gift className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Offers Coming Soon
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed max-w-md mx-auto">
                We&apos;re preparing some special deals for you. Stay tuned!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {offers.map((offer: any, index: number) => (
                <div
                  key={offer._id.toString()}
                  className={`relative overflow-hidden bg-gradient-to-br ${index % 2 === 0 ? 'from-purple-600 to-pink-600' : 'from-blue-600 to-indigo-600'
                    } rounded-3xl p-10 text-white shadow-2xl shadow-purple-500/30`}
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                  <div className="relative z-10">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full mb-6">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm font-semibold">{offer.subtitle || "Special Offer"}</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-4">{offer.title}</h3>
                    <p className="text-purple-100 text-lg mb-6">
                      {offer.description}
                    </p>
                    <div className="mb-6">
                      <div className="text-xl line-through opacity-60">₹{offer.originalPrice}</div>
                      <div className="text-5xl font-bold">₹{offer.discountedPrice}</div>
                    </div>
                    <Link
                      href={`/book`}
                      className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-all font-bold"
                      style={{ color: index % 2 === 0 ? '#9333ea' : '#2563eb' }}
                    >
                      <span>Claim Offer</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 rounded-[2.5rem] p-12 md:p-16 text-center text-white shadow-2xl shadow-purple-500/20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNHYyaDJ2LTJoLTJ6bS0yIDJ2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem00LTJ2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0tMi02djJoMnYtMmgtMnptMCAwdjJoMnYtMmgtMnptMiAydjJoMnYtMmgtMnptMC00djJoMnYtMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl mb-6 border border-white/20">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Ready for Your Transformation?
              </h2>
              <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                Book your appointment now and let our experts bring out your best look. Available slots filling fast!
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={`/book`}
                  className="inline-flex items-center space-x-3 px-10 py-5 bg-white text-purple-900 font-bold text-lg rounded-2xl hover:bg-purple-50 transition-all duration-300 shadow-2xl shadow-black/20 transform hover:scale-105"
                >
                  <Calendar className="w-6 h-6" />
                  <span>Book Appointment Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                {salonDoc.phone && (
                  <a
                    href={`tel:${salonDoc.phone}`}
                    className="inline-flex items-center space-x-3 px-10 py-5 bg-white/10 backdrop-blur-xl text-white font-bold text-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    <Phone className="w-6 h-6" />
                    <span>Call Us</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Info Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg shadow-purple-500/30">
              <MapPinned className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Visit Us
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Find us and get in touch
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-10">
              <div className="flex items-center mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-purple-500/30">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Get in Touch</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="font-semibold text-slate-900">Address</span>
                  </div>
                  <p className="text-slate-600 ml-13 pl-1 leading-relaxed">{salonDoc.address}</p>
                </div>

                {salonDoc.phone && (
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Phone className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-semibold text-slate-900">Phone</span>
                    </div>
                    <a
                      href={`tel:${salonDoc.phone}`}
                      className="text-purple-600 hover:text-purple-700 font-medium ml-13 pl-1 transition-colors"
                    >
                      {salonDoc.phone}
                    </a>
                  </div>
                )}

                {salonDoc.email && (
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                        <Mail className="w-5 h-5 text-pink-600" />
                      </div>
                      <span className="font-semibold text-slate-900">Email</span>
                    </div>
                    <a
                      href={`mailto:${salonDoc.email}`}
                      className="text-purple-600 hover:text-purple-700 font-medium ml-13 pl-1 transition-colors"
                    >
                      {salonDoc.email}
                    </a>
                  </div>
                )}

                <div className="pt-6 border-t border-slate-100">
                  <p className="text-slate-600 mb-4 font-medium">Follow Us</p>
                  <div className="flex space-x-4">
                    {salonDoc.socials?.instagram && (
                      <a
                        href={salonDoc.socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-purple-500/30 transition-all transform hover:scale-110"
                      >
                        <Instagram className="w-6 h-6 text-white" />
                      </a>
                    )}
                    {salonDoc.socials?.facebook && (
                      <a
                        href={salonDoc.socials.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:scale-110"
                      >
                        <Facebook className="w-6 h-6 text-white" />
                      </a>
                    )}
                    {salonDoc.socials?.twitter && (
                      <a
                        href={salonDoc.socials.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-cyan-500/30 transition-all transform hover:scale-110"
                      >
                        <Twitter className="w-6 h-6 text-white" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-10">
              <div className="flex items-center mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-blue-500/30">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Opening Hours</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-4 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Monday - Friday</span>
                  <span className="font-bold text-slate-900">9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Saturday</span>
                  <span className="font-bold text-slate-900">9:00 AM - 9:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Sunday</span>
                  <span className="font-bold text-slate-900">10:00 AM - 6:00 PM</span>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mt-6 border border-purple-100">
                  <p className="text-slate-700 font-medium mb-2">Walk-ins Welcome!</p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    We accept walk-in customers, but we recommend booking online to avoid wait times.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Scissors className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">{salonDoc.name}</span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-6">
                Premium salon experience with expert stylists, modern techniques, and personalized care. Your beauty is our passion.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#services" className="text-slate-400 hover:text-white transition-colors">
                    Our Services
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-slate-400 hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#gallery" className="text-slate-400 hover:text-white transition-colors">
                    Gallery
                  </a>
                </li>
                <li>
                  <Link href={`/book`} className="text-slate-400 hover:text-white transition-colors">
                    Book Appointment
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-lg mb-4">Contact</h4>
              <ul className="space-y-3 text-slate-400">
                <li className="flex items-start space-x-2">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>{salonDoc.address}</span>
                </li>
                {salonDoc.phone && (
                  <li className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 flex-shrink-0" />
                    <a href={`tel:${salonDoc.phone}`} className="hover:text-white transition-colors">
                      {salonDoc.phone}
                    </a>
                  </li>
                )}
                {salonDoc.email && (
                  <li className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 flex-shrink-0" />
                    <a href={`mailto:${salonDoc.email}`} className="hover:text-white transition-colors">
                      {salonDoc.email}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-slate-400 text-sm">
                © 2024 {salonDoc.name}. All rights reserved.
              </p>
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <span>Powered by</span>
                <Link
                  href="/"
                  className="font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text hover:from-purple-300 hover:to-pink-300 transition-all"
                >
                  TrimSetGo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Book Button (Mobile) */}
      <div className="fixed bottom-6 right-6 md:hidden z-50">
        <Link
          href={`/book`}
          className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all transform hover:scale-110"
        >
          <Calendar className="w-7 h-7" />
        </Link>
      </div>
    </div>
  );
}