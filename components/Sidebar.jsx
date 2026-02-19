import React from 'react';
import { 
  LayoutDashboard, 
  Stethoscope, 
  ClipboardList, 
  Users, 
  FileHeart, 
  AlertCircle,
  ShieldCheck,
  Dna,
  X
} from 'lucide-react';

const Sidebar = ({ currentView, onChangeView, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'symptoms', label: 'Symptom Checker', icon: Stethoscope },
    { id: 'registration', label: 'Get Token', icon: ClipboardList },
    { id: 'queue', label: 'Live Queue', icon: Users },
    { id: 'health-record', label: 'Health Record', icon: FileHeart },
    { id: 'precision-medicine', label: 'Precision Medicine', icon: Dna },
    { id: 'emergency', label: 'Emergency Help', icon: AlertCircle, variant: 'danger' },
    { id: 'admin', label: 'Doctor Admin', icon: ShieldCheck, variant: 'admin' },
  ];

  const handleNavClick = (id) => {
    onChangeView(id);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:block lg:z-auto
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo Area */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-medical-600 p-2 rounded-lg shadow-md shadow-medical-200">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 leading-none">PulsePoint</h1>
                <span className="text-xs text-slate-500 font-medium">Smart Healthcare</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-slate-400 hover:text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
            {menuItems.map((item) => {
              const isActive = currentView === item.id;
              const isDanger = item.variant === 'danger';
              const isAdmin = item.variant === 'admin';
              
              let baseClasses = "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer mb-1";
              let activeClasses = "";
              let inactiveClasses = "";

              if (isDanger) {
                activeClasses = "bg-red-50 text-red-600 shadow-sm";
                inactiveClasses = "text-red-600 hover:bg-red-50";
              } else if (isAdmin) {
                activeClasses = "bg-slate-800 text-white shadow-md";
                inactiveClasses = "text-slate-600 hover:bg-slate-100 mt-8 border-t border-slate-100 pt-4";
              } else {
                activeClasses = "bg-medical-50 text-medical-700 shadow-sm ring-1 ring-medical-200";
                inactiveClasses = "text-slate-600 hover:bg-slate-50 hover:text-medical-600";
              }

              return (
                <div
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                  {item.label}
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100">
            <div className="bg-gradient-to-r from-medical-600 to-medical-500 rounded-xl p-4 text-white shadow-lg">
              <p className="text-xs font-medium opacity-80 mb-1">Need help?</p>
              <p className="font-bold text-sm mb-3">24/7 Support Line</p>
              <a href="tel:108" className="inline-flex items-center justify-center w-full bg-white text-medical-600 py-2 rounded-lg text-xs font-bold hover:bg-medical-50 transition-colors shadow-sm">
                Call Emergency
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
