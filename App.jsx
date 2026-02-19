import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import SymptomChecker from "./pages/SymptomChecker";
import Registration from "./pages/Registration";
import QueueMonitor from "./pages/QueueMonitor";
import Emergency from "./pages/Emergency";
import HealthRecord from "./pages/HealthRecord";
import DoctorDashboard from "./pages/DoctorDashboard";
import PrecisionMedicine from "./pages/PrecisionMedicine";
import { hospitalApi } from "./services/api";
import DocterLogin from "./pages/DocterLogin";

const INITIAL_REFERENCE_DATA = {
  departments: [],
  symptoms: [],
  doctors: [],
  testimonials: [],
};

const App = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [preSelectedDept, setPreSelectedDept] = useState(undefined);
  const [referenceData, setReferenceData] = useState(INITIAL_REFERENCE_DATA);
  const [loadError, setLoadError] = useState("");
  const [authenticatedDoctor, setAuthenticatedDoctor] = useState(null);

  const loadReferenceData = async () => {
    try {
      const data = await hospitalApi.getReferenceData();
      setReferenceData({
        departments: data.departments || [],
        symptoms: data.symptoms || [],
        doctors: data.doctors || [],
        testimonials: data.testimonials || [],
      });
      setLoadError("");
    } catch (error) {
      setLoadError(error.message || "Failed to load hospital data from backend.");
    }
  };

  useEffect(() => {
    loadReferenceData();
  }, []);

  const handleNavigate = (view) => {
    setCurrentView(view);
    // Reset pre-selection when leaving reg page
    if (view !== "registration") {
      setPreSelectedDept(undefined);
    }
  };

  const handleBookNow = (dept) => {
    setPreSelectedDept(dept);
    setCurrentView('registration');
  };

  const handleDoctorLoginSuccess = (doctor) => {
    setAuthenticatedDoctor(doctor);
  };

  const handleDoctorLogout = () => {
    setAuthenticatedDoctor(null);
  };

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <Dashboard
            onNavigate={handleNavigate}
            departments={referenceData.departments}
            doctors={referenceData.doctors}
            testimonials={referenceData.testimonials}
          />
        );
      case "symptoms":
        return <SymptomChecker onBookNow={handleBookNow} symptoms={referenceData.symptoms} />;
      case "registration":
        return (
          <Registration
            preSelectedDept={preSelectedDept}
            departments={referenceData.departments}
          />
        );
      case "queue":
        return <QueueMonitor departments={referenceData.departments} />;
      case "emergency":
        return <Emergency />;
      case "health-record":
        return <HealthRecord />;
      case "precision-medicine":
        return <PrecisionMedicine />;
      case "admin":
        return authenticatedDoctor ? (
          <DoctorDashboard
            departments={referenceData.departments}
            doctor={authenticatedDoctor}
            onLogout={handleDoctorLogout}
          />
        ) : (
          <DocterLogin onLoginSuccess={handleDoctorLoginSuccess} />
        );
      default:
        return (
          <Dashboard
            onNavigate={handleNavigate}
            departments={referenceData.departments}
            doctors={referenceData.doctors}
            testimonials={referenceData.testimonials}
          />
        );
    }
  };



  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        currentView={currentView}
        onChangeView={handleNavigate}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col h-full w-full relative">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white p-4 flex items-center justify-between shadow-sm z-10 sticky top-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-slate-600 hover:text-medical-600"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-slate-800">PulsePoint</span>
          <div className="w-6" /> {/* Spacer for centering */}
        </div>

        {/* Main Content Area */}
        {/* Removed default p-4 padding for Dashboard to allow full width hero */}
        <main
          className={`flex-1 overflow-y-auto custom-scrollbar ${
            currentView === "dashboard" ? "p-0" : "p-4 md:p-8"
          }`}
        >
          <div
            className={`${
              currentView === "dashboard" ? "max-w-7xl px-4 md:px-8 py-6" : "max-w-6xl"
            } mx-auto`}
          >
            {loadError ? (
              <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700">
                <div className="font-semibold">Could not load backend data</div>
                <p className="mt-1 text-sm">{loadError}</p>
                <button
                  onClick={loadReferenceData}
                  className="mt-3 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            ) : null}
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
