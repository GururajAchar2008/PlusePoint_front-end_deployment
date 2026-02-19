import React, { useEffect, useState } from "react";
import { Ticket, Clock, CheckCircle, User } from "lucide-react";
import { hospitalApi } from "../services/api";

const Registration = ({ preSelectedDept, departments = [] }) => {
  const [step, setStep] = useState("form");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    contact: "",
    symptom: "",
    department: preSelectedDept || "",
    date: new Date().toISOString().split("T")[0],
  });
  const [generatedToken, setGeneratedToken] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadPatient = async () => {
      try {
        const savedPatient = await hospitalApi.getLatestPatient();
        if (!mounted || !savedPatient) {
          return;
        }

        setFormData((prev) => ({
          ...prev,
          name: savedPatient.name || "",
          age: savedPatient.age ? String(savedPatient.age) : "",
          contact: savedPatient.contact || "",
        }));
      } catch (error) {
        // Keep form usable even if prefilling fails.
      }
    };

    loadPatient();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (preSelectedDept) {
      setFormData((prev) => ({ ...prev, department: preSelectedDept }));
    }
  }, [preSelectedDept]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const appointment = await hospitalApi.createAppointment({
        patientName: formData.name,
        age: parseInt(formData.age, 10) || 0,
        contact: formData.contact,
        symptom: formData.symptom,
        department: formData.department,
        date: formData.date,
        urgency: "Normal",
      });

      setGeneratedToken(appointment);
      setStep("success");
    } catch (error) {
      setErrorMsg(error.message || "Could not generate token. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep("form");
    setGeneratedToken(null);
    setErrorMsg("");
    setFormData((prev) => ({ ...prev, symptom: "", department: "", date: new Date().toISOString().split("T")[0] }));
  };

  if (step === "success" && generatedToken) {
    return (
      <div className="max-w-md mx-auto animate-scale-in">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          <div className="bg-medical-600 p-8 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
            <p className="text-medical-100 text-sm mt-1">Please arrive 15 mins before time</p>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold mb-2">Your Token Number</p>
              <div className="text-5xl font-black text-slate-800 tracking-tight">{generatedToken.tokenNumber}</div>
            </div>

            <div className="space-y-4 border-t border-slate-100 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-2"><User className="w-4 h-4" /> Patient</span>
                <span className="font-semibold text-slate-800">{generatedToken.patientName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-2"><Ticket className="w-4 h-4" /> Department</span>
                <span className="font-semibold text-medical-600">
                  {departments.find((dept) => dept.id === generatedToken.department)?.name || generatedToken.departmentName || generatedToken.department}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-2"><Clock className="w-4 h-4" /> Est. Wait</span>
                <span className="font-semibold text-orange-500">{generatedToken.estimatedTime}</span>
              </div>
            </div>

            <button
              onClick={resetForm}
              className="w-full mt-8 bg-slate-800 text-white py-4 rounded-xl font-bold hover:bg-slate-900 transition-colors shadow-lg"
            >
              Book Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Pre-Registration</h2>
          <p className="text-slate-500">Book your appointment online to save time.</p>
        </div>

        {errorMsg ? (
          <div className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Patient Name</label>
              <input
                required
                type="text"
                className="w-full rounded-lg border-slate-300 bg-slate-50 p-3 text-slate-900 focus:border-medical-500 focus:ring-medical-500 border"
                placeholder="John Doe"
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
              <input
                required
                type="number"
                className="w-full rounded-lg border-slate-300 bg-slate-50 p-3 text-slate-900 focus:border-medical-500 focus:ring-medical-500 border"
                placeholder="30"
                value={formData.age}
                onChange={(event) => setFormData({ ...formData, age: event.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Department</label>
            <select
              required
              className="w-full rounded-lg border-slate-300 bg-slate-50 p-3 text-slate-900 focus:border-medical-500 focus:ring-medical-500 border"
              value={formData.department}
              onChange={(event) => setFormData({ ...formData, department: event.target.value })}
            >
              <option value="">Choose a department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Main Symptom / Problem</label>
            <textarea
              required
              rows={3}
              className="w-full rounded-lg border-slate-300 bg-slate-50 p-3 text-slate-900 focus:border-medical-500 focus:ring-medical-500 border"
              placeholder="Describe your problem shortly..."
              value={formData.symptom}
              onChange={(event) => setFormData({ ...formData, symptom: event.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Date</label>
              <input
                required
                type="date"
                className="w-full rounded-lg border-slate-300 bg-slate-50 p-3 text-slate-900 focus:border-medical-500 focus:ring-medical-500 border"
                value={formData.date}
                onChange={(event) => setFormData({ ...formData, date: event.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Contact Number</label>
              <input
                required
                type="tel"
                className="w-full rounded-lg border-slate-300 bg-slate-50 p-3 text-slate-900 focus:border-medical-500 focus:ring-medical-500 border"
                placeholder="+1 234 567 890"
                value={formData.contact}
                onChange={(event) => setFormData({ ...formData, contact: event.target.value })}
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-medical-600 text-white py-4 rounded-xl font-bold hover:bg-medical-700 transition-colors shadow-lg shadow-medical-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Generating..." : "Generate Token"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
