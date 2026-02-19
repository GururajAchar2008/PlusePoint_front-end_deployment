import React from 'react';
import { Phone, MapPin, Heart, AlertTriangle } from 'lucide-react';

const Emergency = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl flex items-start gap-4">
        <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
        <div>
          <h2 className="text-2xl font-bold text-red-700 mb-1">Emergency Mode Active</h2>
          <p className="text-red-600">If you have a life-threatening emergency, please call the ambulance immediately or visit the nearest ER.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="space-y-4">
          <button className="w-full bg-red-600 hover:bg-red-700 text-white p-6 rounded-2xl shadow-xl shadow-red-200 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-4 group">
            <div className="bg-white/20 p-3 rounded-full group-hover:bg-white/30 transition-colors">
              <Phone className="w-8 h-8" />
            </div>
            <div className="text-left">
              <span className="block text-sm opacity-90 font-medium">Call Ambulance</span>
              <span className="block text-3xl font-black tracking-wider">108</span>
            </div>
          </button>

          <button className="w-full bg-white border-2 border-red-100 hover:border-red-300 text-slate-800 p-6 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-4">
             <div className="bg-red-100 p-3 rounded-full text-red-600">
              <MapPin className="w-8 h-8" />
            </div>
            <div className="text-left">
              <span className="block text-sm text-slate-500 font-medium">Current Location</span>
              <span className="block text-lg font-bold">Share with EMS</span>
            </div>
          </button>
        </div>

        {/* First Aid Steps */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="bg-slate-800 p-4 flex items-center gap-3">
             <Heart className="w-5 h-5 text-red-500" />
             <h3 className="text-white font-bold">Quick First Aid Guide</h3>
          </div>
          <div className="p-6">
            <ul className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              <li className="relative pl-10">
                <span className="absolute left-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg border-4 border-white">1</span>
                <h4 className="font-bold text-slate-800 text-lg">Check Response</h4>
                <p className="text-slate-500">Tap the person and ask loudly, "Are you okay?". If no response, call 108.</p>
              </li>
              <li className="relative pl-10">
                <span className="absolute left-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg border-4 border-white">2</span>
                <h4 className="font-bold text-slate-800 text-lg">Check Breathing</h4>
                <p className="text-slate-500">Look, listen, and feel for breathing for no more than 10 seconds.</p>
              </li>
              <li className="relative pl-10">
                <span className="absolute left-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg border-4 border-white">3</span>
                <h4 className="font-bold text-slate-800 text-lg">Start CPR</h4>
                <p className="text-slate-500">Push hard and fast in the center of the chest. 100-120 compressions per minute.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emergency;
