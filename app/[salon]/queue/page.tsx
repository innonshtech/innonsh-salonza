import dbConnect from "@/lib/dbConnect";
import Salon from "@/models/Salon";
import Queue from "@/models/Queue";
import Service from "@/models/Service";
import {
  Users,
  Clock,
  Scissors,
  TrendingUp,
  CheckCircle,
  ArrowLeft,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default async function QueuePage({ params }: any) {
  await dbConnect();

  const { salon: slug } = await params;

  const salon = (await Salon.findOne({ slug }).lean()) as any;

  if (!salon) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Salon Not Found</h1>
          <p className="text-slate-600">The salon you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  const queueRaw = await Queue.find({ salonId: salon._id }).sort({ position: 1, createdAt: 1 }).lean();
  const queue = queueRaw.map((item: any) => ({
    ...item,
    status: item.status || "waiting"
  }));
  const servingItems = queue.filter((i: any) => i.status === "serving");
  const waitingItems = queue.filter((i: any) => i.status === "waiting");
  const services = await Service.find({ salonId: salon._id }).lean();

  const serviceMap: any = {};
  services.forEach((s: any) => (serviceMap[s._id.toString()] = s));

  // Calculate wait times
  const avgServiceTime = 30; // minutes
  const currentTime = new Date();

  function getEstimatedWaitTime(position: number) {
    if (position === 0) return "Ready Soon";
    const waitMinutes = position * avgServiceTime;
    if (waitMinutes < 60) return `~${waitMinutes} mins`;
    const hours = Math.floor(waitMinutes / 60);
    const mins = waitMinutes % 60;
    return `~${hours}h ${mins}m`;
  }

  function getEstimatedTime(position: number) {
    const waitMinutes = position * avgServiceTime;
    const estimatedTime = new Date(currentTime.getTime() + waitMinutes * 60000);
    return estimatedTime.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6">
          <Link
            href={`/`}
            className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {salon.name}</span>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Live Queue</h1>
              <p className="mt-1 text-slate-600">Real-time waiting queue at {salon.name}</p>
            </div>
            <div className="bg-purple-100 px-6 py-3 rounded-xl text-center">
              <div className="text-3xl font-bold text-purple-700">{queue.length}</div>
              <div className="text-sm text-purple-600">In Queue</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              {waitingItems.length > 0 ? getEstimatedWaitTime(waitingItems.length) : '0 min'}
            </h3>
            <p className="text-sm text-slate-600 mt-1">Total Wait Time</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{waitingItems.length}</h3>
            <p className="text-sm text-slate-600 mt-1">People Waiting</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              {waitingItems.length > 0 ? getEstimatedTime(waitingItems.length) : 'Now'}
            </h3>
            <p className="text-sm text-slate-600 mt-1">Next Available Slot</p>
          </div>
        </div>

        {/* Queue Status */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Current Queue</h2>
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Updates</span>
            </div>
          </div>

          {queue.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                No Wait Time! 🎉
              </h3>
              <p className="text-slate-600 mb-6">
                The queue is empty. You can walk in right now!
              </p>
              <Link
                href={`/book`}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                <span>Book Now</span>
                <TrendingUp className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Serving Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-green-600 uppercase tracking-wider flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Currently Serving ({servingItems.length})
                </h3>
                {servingItems.length === 0 ? (
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-500 text-sm italic">
                    All stylists are currently free
                  </div>
                ) : (
                  servingItems.map((item: any) => (
                    <div key={item._id.toString()} className="relative flex items-center p-5 rounded-xl border-2 border-green-200 bg-green-50/30">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <span className="font-bold text-green-700">{item.customerName?.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900">{item.customerName}</h4>
                        <div className="flex items-center text-xs text-slate-600 mt-1">
                          <Scissors className="w-3 h-3 mr-1" />
                          {serviceMap[item.serviceId?.toString()]?.name}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-lg">IN SERVICE</span>
                    </div>
                  ))
                )}
              </div>

              {/* Waiting Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-purple-600 uppercase tracking-wider flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Waiting List ({waitingItems.length})
                </h3>
                {waitingItems.length === 0 ? (
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-500 text-sm italic">
                    No one is waiting
                  </div>
                ) : (
                  waitingItems.map((item: any) => (
                    <div key={item._id.toString()} className="relative flex items-center p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
                      <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-white border-2 border-purple-200 flex items-center justify-center text-xs font-bold text-purple-600 shadow-sm">
                        #{item.position}
                      </div>
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mr-4">
                        <span className="font-bold text-slate-600">{item.customerName?.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900">{item.customerName}</h4>
                        <p className="text-xs text-slate-500">{serviceMap[item.serviceId?.toString()]?.name}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-900">{getEstimatedWaitTime(item.position)}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Wait</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* How It Works */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              How the Queue Works
            </h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li className="flex items-start">
                <span className="mr-2">1.</span>
                <span>Join the queue by booking an appointment</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">2.</span>
                <span>Track your position in real-time on this page</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">3.</span>
                <span>Arrive at the salon when your turn is near</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">4.</span>
                <span>Get served without the wait!</span>
              </li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <h3 className="font-semibold text-purple-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                href={`/${slug}/book`}
                className="block w-full px-4 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors text-center"
              >
                Book an Appointment
              </Link>
              <Link
                href={`/${slug}`}
                className="block w-full px-4 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors text-center border border-purple-200"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>

        {/* Auto Refresh Notice */}
        <div className="mt-8 bg-slate-100 border border-slate-200 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-600">
            <span className="font-semibold">💡 Tip:</span> This page updates in real-time.
            Refresh to see the latest queue status.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6">
          <p className="text-center text-sm text-slate-600">
            Powered by{" "}
            <Link href="/" className="font-semibold text-purple-600 hover:text-purple-700">
              TrimSetGo
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}