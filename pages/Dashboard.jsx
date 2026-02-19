import React from 'react';
import { 
  Users, 
  Clock, 
  Calendar, 
  Activity,
  ArrowRight,
  Stethoscope,
  Star,
  Phone,
  ShieldCheck,
  MapPin,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';

const Dashboard = ({
  onNavigate,
  departments = [],
  doctors = [],
  testimonials = [],
}) => {
  return (
    <div className="animate-fade-in space-y-16 pb-10">
      
      {/* 1. Hero Section */}
      <section className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[550px] flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000" 
            alt="Hospital Hallway" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-medical-900/90 to-medical-600/70"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-8 md:px-12 text-white max-w-4xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-sm font-semibold mb-6 border border-white/30">
            🏥 PulsePoint Healthcare System
          </span>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Smart Digital Hospital for <br/>
            <span className="text-medical-200">Faster Patient Care</span>
          </h1>
          <p className="text-lg md:text-xl text-medical-50 mb-10 leading-relaxed max-w-2xl opacity-90">
            Skip the waiting room. Check symptoms instantly, get your digital token from home, and track your queue status in real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => onNavigate('registration')}
              className="px-8 py-4 bg-white text-medical-700 font-bold rounded-xl hover:bg-medical-50 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Book Token
            </button>
            <button 
              onClick={() => onNavigate('symptoms')}
              className="px-8 py-4 bg-medical-500 text-white font-bold rounded-xl hover:bg-medical-400 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 border border-medical-400"
            >
              <Stethoscope className="w-5 h-5" />
              Check Symptoms
            </button>
          </div>
        </div>
      </section>

      {/* 2. Services / Features Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800">Our Smart Services</h2>
          <p className="text-slate-500 mt-2 max-w-2xl mx-auto">We combine advanced technology with compassionate care to provide the best medical experience.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            onClick={() => onNavigate('symptoms')}
            className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Activity className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Symptom Checker</h3>
            <p className="text-slate-500 text-sm mb-4">AI-powered guidance to help you find the right specialist instantly.</p>
            <span className="text-purple-600 text-sm font-semibold flex items-center group-hover:gap-2 transition-all">
              Try Now <ArrowRight className="w-4 h-4 ml-1" />
            </span>
          </div>

          <div 
            onClick={() => onNavigate('queue')}
            className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Live Queue Status</h3>
            <p className="text-slate-500 text-sm mb-4">Monitor your token number from home and arrive just in time.</p>
            <span className="text-orange-600 text-sm font-semibold flex items-center group-hover:gap-2 transition-all">
              View Queue <ArrowRight className="w-4 h-4 ml-1" />
            </span>
          </div>

          <div 
            onClick={() => onNavigate('registration')}
            className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
          >
             <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Calendar className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Pre-Registration</h3>
            <p className="text-slate-500 text-sm mb-4">Book your appointment online and skip the paperwork at the counter.</p>
            <span className="text-blue-600 text-sm font-semibold flex items-center group-hover:gap-2 transition-all">
              Book Now <ArrowRight className="w-4 h-4 ml-1" />
            </span>
          </div>

          <div 
            onClick={() => onNavigate('health-record')}
            className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
          >
             <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Digital Records</h3>
            <p className="text-slate-500 text-sm mb-4">Securely store your medical history and allergies for emergencies.</p>
            <span className="text-green-600 text-sm font-semibold flex items-center group-hover:gap-2 transition-all">
              Access Records <ArrowRight className="w-4 h-4 ml-1" />
            </span>
          </div>
        </div>
      </section>

      {/* 3. Live Hospital Features (Mini Dashboard) */}
      <section className="bg-slate-50 py-16 rounded-3xl mx-4 md:mx-0">
        <div className="container mx-auto px-4 md:px-8">
           <div className="flex flex-col md:flex-row justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">Current Wait Times</h2>
                <p className="text-slate-500 mt-2">Live updates from our departments</p>
              </div>
              <button 
                onClick={() => onNavigate('queue')}
                className="mt-4 md:mt-0 text-medical-600 font-semibold border border-medical-200 px-6 py-2 rounded-lg hover:bg-medical-50 transition-colors"
              >
                See Full Queue Monitor
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.slice(0, 6).map((dept) => (
              <div key={dept.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-medical-50 flex items-center justify-center text-medical-600 shadow-inner">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{dept.name}</h4>
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">Open</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-orange-500 font-bold text-lg">
                    <Clock className="w-4 h-4 mr-1.5" />
                    {dept.averageWaitTime} m
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Wait Time</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Our Doctors */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800">Meet Our Specialists</h2>
          <p className="text-slate-500 mt-2">Top-rated doctors dedicated to your health</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 group">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={doctor.image} 
                  alt={doctor.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white font-medium text-sm">Book Appointment</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                     <h3 className="font-bold text-slate-800 text-lg">{doctor.name}</h3>
                     <p className="text-medical-600 text-sm font-medium">{doctor.specialty}</p>
                  </div>
                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded text-yellow-600 text-xs font-bold">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {doctor.rating}
                  </div>
                </div>
                <p className="text-slate-400 text-xs mb-4">{doctor.experience}</p>
                <button 
                  onClick={() => onNavigate('registration')}
                  className="w-full py-2.5 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-medical-600 hover:text-white hover:border-medical-600 transition-colors"
                >
                  Consult Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Emergency Banner */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-3xl p-8 md:p-12 text-white shadow-2xl shadow-red-200 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
           {/* Decorative circles */}
           <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
           <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
           
           <div className="relative z-10 flex items-center gap-6">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm animate-pulse">
                <Phone className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">In Case of Emergency?</h2>
                <p className="text-red-100 text-lg">We are here 24/7. Don't hesitate to call us.</p>
              </div>
           </div>
           
           <div className="relative z-10 flex gap-4 w-full md:w-auto">
              <a href="tel:108" className="flex-1 md:flex-none text-center bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-50 transition-colors shadow-lg">
                Call 108
              </a>
              <button 
                onClick={() => onNavigate('emergency')}
                className="flex-1 md:flex-none bg-red-800/30 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-800/50 transition-colors"
              >
                View Guide
              </button>
           </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800">Patient Stories</h2>
          <p className="text-slate-500 mt-2">See what our patients say about us</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
             <div key={t.id} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-lg relative">
               <div className="text-yellow-400 flex gap-1 mb-4">
                 {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
               </div>
               <p className="text-slate-600 mb-6 italic">"{t.comment}"</p>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-medical-100 flex items-center justify-center font-bold text-medical-700">
                   {t.name[0]}
                 </div>
                 <div>
                   <h4 className="font-bold text-slate-800 text-sm">{t.name}</h4>
                   <span className="text-slate-400 text-xs">Verified Patient</span>
                 </div>
               </div>
             </div>
          ))}
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 rounded-t-3xl mt-10 mx-2">
        <div className="container mx-auto px-8">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-medical-500 p-2 rounded-lg">
                    <Stethoscope className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-white">PulsePoint</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Transforming healthcare with smart technology. We minimize wait times and maximize care quality for everyone.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="bg-slate-800 p-2 rounded-lg hover:bg-medical-600 transition-colors"><Facebook className="w-5 h-5"/></a>
                  <a href="#" className="bg-slate-800 p-2 rounded-lg hover:bg-medical-600 transition-colors"><Twitter className="w-5 h-5"/></a>
                  <a href="#" className="bg-slate-800 p-2 rounded-lg hover:bg-medical-600 transition-colors"><Instagram className="w-5 h-5"/></a>
                  <a href="#" className="bg-slate-800 p-2 rounded-lg hover:bg-medical-600 transition-colors"><Linkedin className="w-5 h-5"/></a>
                </div>
              </div>

              <div>
                <h4 className="text-white font-bold mb-6">Quick Links</h4>
                <ul className="space-y-4 text-sm">
                  <li><button onClick={() => onNavigate('dashboard')} className="hover:text-medical-400 transition-colors">Home</button></li>
                  <li><button onClick={() => onNavigate('registration')} className="hover:text-medical-400 transition-colors">Book Appointment</button></li>
                  <li><button onClick={() => onNavigate('symptoms')} className="hover:text-medical-400 transition-colors">Symptom Checker</button></li>
                  <li><button onClick={() => onNavigate('admin')} className="hover:text-medical-400 transition-colors">Doctors Login</button></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-bold mb-6">Our Services</h4>
                <ul className="space-y-4 text-sm">
                  <li><a href="#" className="hover:text-medical-400 transition-colors">Cardiology</a></li>
                  <li><a href="#" className="hover:text-medical-400 transition-colors">Neurology</a></li>
                  <li><a href="#" className="hover:text-medical-400 transition-colors">Pediatrics</a></li>
                  <li><a href="#" className="hover:text-medical-400 transition-colors">Emergency Care</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-bold mb-6">Contact Us</h4>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-medical-500 shrink-0" />
                    <span>123 Medical Center Dr,<br/>Health City, HC 90210</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-medical-500 shrink-0" />
                    <span>+1 (555) 123-4567</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-medical-500 shrink-0" />
                    <span>support@pulsepoint.com</span>
                  </li>
                </ul>
              </div>
           </div>
           
           <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
             <p>&copy; {new Date().getFullYear()} PulsePoint Smart Healthcare. All rights reserved.</p>
           </div>
        </div>
      </footer>

    </div>
  );
};

export default Dashboard;
