import React, { useEffect, useState } from "react";
import { Save, User, FileText } from "lucide-react";
import { hospitalApi } from "../services/api";

function normalizePatient(data = {}) {
  return {
    id: data.id || "",
    name: data.name || "",
    age: Number(data.age) || 0,
    gender: data.gender || "Male",
    contact: data.contact || "",
    bloodGroup: data.bloodGroup || "",
    allergies: data.allergies || "",
    chronicConditions: data.chronicConditions || "",
  };
}

const HealthRecord = () => {
  const [patient, setPatient] = useState(normalizePatient());
  const [isEditing, setIsEditing] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadPatient = async () => {
      try {
        const record = await hospitalApi.getLatestPatient();
        if (!mounted) {
          return;
        }

        if (record) {
          setPatient(normalizePatient(record));
        } else {
          setIsEditing(true);
        }
      } catch (error) {
        if (mounted) {
          setErrorMsg("Could not load record from backend.");
          setIsEditing(true);
        }
      }
    };

    loadPatient();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSavedMsg("");
    setErrorMsg("");

    try {
      const savedPatient = await hospitalApi.savePatient(patient);
      setPatient(normalizePatient(savedPatient));
      setIsEditing(false);
      setSavedMsg("Record saved successfully.");
      setTimeout(() => setSavedMsg(""), 3000);
    } catch (error) {
      setErrorMsg(error.message || "Could not save record.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">My Health Card</h2>
          <p className="text-slate-500 mt-1">Keep your critical medical info handy.</p>
        </div>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          disabled={isSaving}
          className="bg-medical-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-medical-700 transition-colors flex items-center gap-2 shadow-lg shadow-medical-200 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isEditing ? <><Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save Record"}</> : "Edit Record"}
        </button>
      </div>

      {savedMsg ? (
        <div className="bg-green-100 text-green-700 p-4 rounded-xl mb-6 text-center font-medium animate-fade-in">
          {savedMsg}
        </div>
      ) : null}

      {errorMsg ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 text-center font-medium animate-fade-in">
          {errorMsg}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden text-center h-full">
            <div className="bg-gradient-to-b from-medical-500 to-medical-600 h-32 relative">
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-24 h-24 bg-white p-1 rounded-full">
                <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                  <User className="w-12 h-12" />
                </div>
              </div>
            </div>
            <div className="pt-12 pb-8 px-6">
              <h3 className="text-xl font-bold text-slate-800">{patient.name || "Your Name"}</h3>
              <p className="text-slate-500 text-sm">{patient.age ? `${patient.age} years old` : "Age --"} • {patient.gender}</p>

              <div className="mt-6 flex justify-center gap-4">
                <div className="text-center px-4 py-2 bg-slate-50 rounded-lg">
                  <span className="block text-xs text-slate-400 uppercase font-bold">Blood</span>
                  <span className="block text-xl font-black text-red-500">{patient.bloodGroup || "--"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Form/View */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 h-full">
            <div className="space-y-6">
              {/* Personal Info */}
              <div>
                <h4 className="flex items-center gap-2 font-bold text-slate-700 mb-4 border-b pb-2">
                  <User className="w-4 h-4" /> Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Full Name</label>
                    {isEditing ? (
                      <input
                        className="w-full p-2 border rounded-md"
                        value={patient.name}
                        onChange={(event) => setPatient({ ...patient, name: event.target.value })}
                      />
                    ) : (
                      <p className="font-medium text-slate-800">{patient.name || "Not set"}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Contact</label>
                    {isEditing ? (
                      <input
                        className="w-full p-2 border rounded-md"
                        value={patient.contact}
                        onChange={(event) => setPatient({ ...patient, contact: event.target.value })}
                      />
                    ) : (
                      <p className="font-medium text-slate-800">{patient.contact || "Not set"}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Age</label>
                      {isEditing ? (
                        <input
                          type="number"
                          className="w-full p-2 border rounded-md"
                          value={patient.age}
                          onChange={(event) => setPatient({ ...patient, age: parseInt(event.target.value, 10) || 0 })}
                        />
                      ) : (
                        <p className="font-medium text-slate-800">{patient.age || "--"}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Gender</label>
                      {isEditing ? (
                        <select
                          className="w-full p-2 border rounded-md"
                          value={patient.gender}
                          onChange={(event) => setPatient({ ...patient, gender: event.target.value })}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <p className="font-medium text-slate-800">{patient.gender}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Blood Group</label>
                    {isEditing ? (
                      <select
                        className="w-full p-2 border rounded-md"
                        value={patient.bloodGroup}
                        onChange={(event) => setPatient({ ...patient, bloodGroup: event.target.value })}
                      >
                        <option value="">Select</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    ) : (
                      <p className="font-medium text-slate-800">{patient.bloodGroup || "Not set"}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Medical Info */}
              <div>
                <h4 className="flex items-center gap-2 font-bold text-slate-700 mb-4 border-b pb-2 mt-2">
                  <FileText className="w-4 h-4" /> Medical History
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Allergies</label>
                    {isEditing ? (
                      <textarea
                        className="w-full p-2 border rounded-md"
                        rows={2}
                        value={patient.allergies}
                        placeholder="e.g. Peanuts, Penicillin"
                        onChange={(event) => setPatient({ ...patient, allergies: event.target.value })}
                      />
                    ) : (
                      <p className="font-medium text-slate-800 bg-red-50 p-3 rounded-lg text-sm border border-red-100">
                        {patient.allergies || "None listed"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Chronic Conditions</label>
                    {isEditing ? (
                      <textarea
                        className="w-full p-2 border rounded-md"
                        rows={2}
                        value={patient.chronicConditions}
                        placeholder="e.g. Diabetes, Hypertension"
                        onChange={(event) => setPatient({ ...patient, chronicConditions: event.target.value })}
                      />
                    ) : (
                      <p className="font-medium text-slate-800 bg-blue-50 p-3 rounded-lg text-sm border border-blue-100">
                        {patient.chronicConditions || "None listed"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthRecord;
