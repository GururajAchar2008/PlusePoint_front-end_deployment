const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const hasBody = Object.prototype.hasOwnProperty.call(options, "body");
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  const headers = { ...(options.headers || {}) };

  if (hasBody && !isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error || `Request failed with status ${response.status}`);
  }

  return payload;
}

export const hospitalApi = {
  getReferenceData: () => request("/api/reference-data"),
  getPharmacogenomicsMeta: () => request("/api/pharmacogenomics/meta"),
  analyzePharmacogenomics: async ({ vcfFile, drugs, patientId }) => {
    const formData = new FormData();
    if (vcfFile) {
      formData.append("vcf_file", vcfFile);
    }
    formData.append("drugs", Array.isArray(drugs) ? drugs.join(",") : String(drugs || ""));
    if (patientId) {
      formData.append("patient_id", patientId);
    }

    const payload = await request("/api/pharmacogenomics/analyze", {
      method: "POST",
      body: formData,
    });
    return payload;
  },
  doctorLogin: async ({ username, password }) => {
    const payload = await request("/api/docter/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    return payload.doctor || null;
  },
  getQueueData: async () => {
    const payload = await request("/api/queue");
    return payload.queue || [];
  },
  getLatestPatient: async () => {
    const payload = await request("/api/patients/latest");
    return payload.patient || null;
  },
  savePatient: async (patient) => {
    const payload = await request("/api/patients", {
      method: "POST",
      body: JSON.stringify(patient),
    });
    return payload.patient || null;
  },
  getAppointments: async () => {
    const payload = await request("/api/appointments");
    return payload.appointments || [];
  },
  createAppointment: async (appointment) => {
    const payload = await request("/api/appointments", {
      method: "POST",
      body: JSON.stringify(appointment),
    });
    return payload.appointment;
  },
  updateAppointmentStatus: async (id, status) => {
    const payload = await request(`/api/appointments/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return payload.appointment;
  },
  resetDemoData: () =>
    request("/api/demo/reset", {
      method: "POST",
    }),
};
