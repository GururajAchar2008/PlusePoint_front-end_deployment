import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

const SymptomChecker = ({ onBookNow, symptoms = [] }) => {
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [result, setResult] = useState(null);

  const handleCheck = () => {
    const found = symptoms.find((item) => String(item.id) === selectedSymptom);
    setResult(found || null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800">Symptom Checker</h2>
        <p className="text-slate-500 mt-2">Not sure which doctor to see? Select your symptom below.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="p-8">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            I am experiencing...
          </label>
          <div className="flex gap-4">
            <select
              className="flex-2 block w-full rounded-lg border-slate-300 bg-slate-50 p-4 text-slate-800 focus:border-medical-500 focus:ring-medical-500 shadow-sm border"
              value={selectedSymptom}
              onChange={(e) => {
                setSelectedSymptom(e.target.value);
                setResult(null); // Reset result on change
              }}
            >
              <option value="">Select a symptom</option>
              {symptoms.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.symptom}
                </option>
              ))}
            </select>
            <button
              onClick={handleCheck}
              disabled={!selectedSymptom}
              className="bg-medical-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-medical-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-slate-50 p-8 border-t border-slate-100 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className={`
                p-4 rounded-xl flex-shrink-0
                ${result.urgency === 'Emergency' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}
              `}>
                {result.urgency === 'Emergency' ? (
                  <AlertTriangle className="w-8 h-8" />
                ) : (
                  <CheckCircle className="w-8 h-8" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-slate-800">
                    Recommended Department:
                  </h3>
                  <span className="bg-white px-3 py-1 rounded-full border border-slate-200 text-medical-600 font-bold">
                    {result.department}
                  </span>
                </div>
                
                <p className="text-slate-600 mb-6">
                  Based on <strong>"{result.symptom}"</strong>, we suggest consulting a specialist in {result.department}. 
                  <br />
                  <span className={`font-semibold ${result.urgency === 'Emergency' ? 'text-red-600' : 'text-slate-500'}`}>
                    Urgency Level: {result.urgency.toUpperCase()}
                  </span>
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => onBookNow(result.departmentId)}
                    className="flex items-center justify-center bg-medical-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-medical-700 transition-colors shadow-lg shadow-medical-200"
                  >
                    Get Token Now <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                  {result.urgency === 'Emergency' && (
                    <a
                      href="#emergency"
                      className="flex items-center justify-center border border-red-200 text-red-600 bg-red-50 px-6 py-3 rounded-lg font-medium hover:bg-red-100 transition-colors"
                    >
                      Emergency Help
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomChecker;
