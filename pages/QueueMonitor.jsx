import React, { useEffect, useState } from "react";
import { Clock, Users } from "lucide-react";
import { hospitalApi } from "../services/api";

function getInitialQueue(departments) {
  return departments.map((department) => ({
    ...department,
    currentToken: 1,
    totalWaiting: 0,
  }));
}

const QueueMonitor = ({ departments = [] }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [queueData, setQueueData] = useState(getInitialQueue(departments));

  useEffect(() => {
    setQueueData(getInitialQueue(departments));
  }, [departments]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadQueue = async () => {
      try {
        const queue = await hospitalApi.getQueueData();
        if (mounted) {
          setQueueData(queue);
        }
      } catch (error) {
        // Keep last queue snapshot visible when refresh fails.
      }
    };

    loadQueue();
    const interval = setInterval(loadQueue, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Live Queue Status</h2>
          <p className="text-slate-500 mt-1">Real-time updates across all departments</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3">
          <Clock className="w-5 h-5 text-medical-600" />
          <span className="text-xl font-mono font-bold text-slate-700">
            {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {queueData.map((department) => (
          <div key={department.id} className="bg-white rounded-2xl p-0 overflow-hidden shadow-lg border border-slate-100 flex flex-col">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">{department.name}</h3>
              <div className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                LIVE
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Now Serving</p>
              <div className="text-5xl font-black text-medical-600 mb-1">
                {department.id.substring(0, 2).toUpperCase()}-{String(department.currentToken).padStart(3, "0")}
              </div>
              <p className="text-sm text-slate-400">Token Number</p>
            </div>

            <div className="bg-slate-50 p-4 grid grid-cols-2 gap-4 border-t border-slate-100">
              <div className="text-center border-r border-slate-200">
                <div className="flex items-center justify-center gap-1 text-slate-500 text-xs mb-1">
                  <Users className="w-3 h-3" /> Waiting
                </div>
                <span className="font-bold text-slate-800 text-lg">{department.totalWaiting}</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-slate-500 text-xs mb-1">
                  <Clock className="w-3 h-3" /> Avg Wait
                </div>
                <span className="font-bold text-orange-500 text-lg">{department.averageWaitTime} min</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QueueMonitor;
