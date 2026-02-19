import React, { useEffect, useState } from "react";
import { Search, Filter, CheckCircle, Clock, XCircle } from "lucide-react";
import { hospitalApi } from "../services/api";

const DoctorDashboard = ({ departments = [], doctor = null, onLogout = null }) => {
  const [appointments, setAppointments] = useState([]);
  const [filterDept, setFilterDept] = useState("all");
  const [search, setSearch] = useState("");

  const loadAppointments = async () => {
    try {
      const data = await hospitalApi.getAppointments();
      const sorted = data.sort(
        (left, right) =>
          new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime(),
      );
      setAppointments(sorted);
    } catch (error) {
      // Keep current list visible when poll fails.
    }
  };

  useEffect(() => {
    loadAppointments();
    const interval = setInterval(loadAppointments, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await hospitalApi.updateAppointmentStatus(id, newStatus);
      setAppointments((prev) => prev.map((appointment) => (appointment.id === id ? updated : appointment)));
    } catch (error) {
      // Leave row unchanged when update fails.
    }
  };

  const handleResetDemo = async () => {
    try {
      await hospitalApi.resetDemoData();
      setAppointments([]);
    } catch (error) {
      // Do not break dashboard on reset failure.
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const tokenNumber = (appointment.tokenNumber || "").toLowerCase();
    const patientName = (appointment.patientName || "").toLowerCase();
    const query = search.toLowerCase();
    const matchesDept = filterDept === "all" || appointment.department === filterDept;
    const matchesSearch = patientName.includes(query) || tokenNumber.includes(query);
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Doctor&apos;s Console</h2>
          <p className="text-slate-500 text-sm">
            Manage patient tokens and appointments
            {doctor ? ` • Signed in as ${doctor.name}` : ""}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          {onLogout ? (
            <button
              onClick={onLogout}
              className="text-xs text-slate-500 hover:text-slate-700 underline"
            >
              Logout
            </button>
          ) : null}
          <button
            onClick={handleResetDemo}
            className="text-xs text-red-500 hover:text-red-700 underline"
          >
            Reset Demo Data
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient or token..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-500"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            className="bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none"
            value={filterDept}
            onChange={(event) => setFilterDept(event.target.value)}
          >
            <option value="all">All Departments</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>{department.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Token</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Problem</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    No appointments found.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                        {appointment.tokenNumber}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{appointment.patientName}</div>
                      <div className="text-xs text-slate-400">{appointment.age} yrs • {appointment.urgency}</div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-slate-600">
                        {departments.find((department) => department.id === appointment.department)?.name || appointment.departmentName || appointment.department}
                      </span>
                    </td>
                    <td className="p-4 max-w-xs truncate text-sm text-slate-500">
                      {appointment.symptom}
                    </td>
                    <td className="p-4">
                      <span className={`
                        inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${appointment.status === "Pending" ? "bg-yellow-100 text-yellow-800" : ""}
                        ${appointment.status === "In Progress" ? "bg-blue-100 text-blue-800" : ""}
                        ${appointment.status === "Completed" ? "bg-green-100 text-green-800" : ""}
                        ${appointment.status === "Cancelled" ? "bg-gray-100 text-gray-800" : ""}
                      `}>
                        {appointment.status === "Pending" && <Clock className="w-3 h-3" />}
                        {appointment.status === "Completed" && <CheckCircle className="w-3 h-3" />}
                        {appointment.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {appointment.status !== "Completed" && (
                          <button
                            onClick={() => handleStatusChange(appointment.id, "Completed")}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Mark Complete"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {appointment.status !== "Cancelled" && (
                          <button
                            onClick={() => handleStatusChange(appointment.id, "Cancelled")}
                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cancel"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
