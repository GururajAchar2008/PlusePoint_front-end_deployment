import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ClipboardCopy,
  Download,
  Dna,
  FileJson,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { hospitalApi } from "../services/api";

const MAX_VCF_BYTES = 5 * 1024 * 1024;
const FALLBACK_DRUGS = [
  "CODEINE",
  "WARFARIN",
  "CLOPIDOGREL",
  "SIMVASTATIN",
  "AZATHIOPRINE",
  "FLUOROURACIL",
];

const RISK_STYLES = {
  Safe: {
    card: "border-green-200 bg-green-50/40",
    badge: "bg-green-100 text-green-700",
  },
  "Adjust Dosage": {
    card: "border-amber-200 bg-amber-50/40",
    badge: "bg-amber-100 text-amber-700",
  },
  Toxic: {
    card: "border-red-200 bg-red-50/40",
    badge: "bg-red-100 text-red-700",
  },
  Ineffective: {
    card: "border-rose-200 bg-rose-50/40",
    badge: "bg-rose-100 text-rose-700",
  },
  Unknown: {
    card: "border-slate-200 bg-slate-50/40",
    badge: "bg-slate-100 text-slate-700",
  },
};

const validateVcfFile = (file) => {
  if (!file) {
    return "Please upload a VCF file.";
  }
  if (!file.name.toLowerCase().endsWith(".vcf")) {
    return "Invalid file format. Only .vcf files are supported.";
  }
  if (file.size > MAX_VCF_BYTES) {
    return "VCF file must be 5 MB or smaller.";
  }
  return "";
};

const formatMetricValue = (value) => {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  if (typeof value === "number") {
    return Number.isInteger(value) ? String(value) : value.toFixed(2);
  }
  return String(value);
};

const PrecisionMedicine = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [drugsInput, setDrugsInput] = useState(FALLBACK_DRUGS.join(", "));
  const [patientId, setPatientId] = useState("");
  const [reports, setReports] = useState([]);
  const [qualitySummary, setQualitySummary] = useState(null);
  const [supportedDrugs, setSupportedDrugs] = useState(FALLBACK_DRUGS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [copiedDrug, setCopiedDrug] = useState("");

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const payload = await hospitalApi.getPharmacogenomicsMeta();
        if (Array.isArray(payload?.supported_drugs) && payload.supported_drugs.length > 0) {
          setSupportedDrugs(payload.supported_drugs);
        }
      } catch (_error) {
        // Will keep the fallback metadata when backend meta is unavailable.
      }
    };
    loadMeta();
  }, []);

  const riskCounts = useMemo(() => {
    const counts = { Safe: 0, "Adjust Dosage": 0, Toxic: 0, Ineffective: 0, Unknown: 0 };
    for (const report of reports) {
      const label = report?.risk_assessment?.risk_label || "Unknown";
      if (!Object.prototype.hasOwnProperty.call(counts, label)) {
        counts.Unknown += 1;
      } else {
        counts[label] += 1;
      }
    }
    return counts;
  }, [reports]);

  const handleFileSelection = (file) => {
    const nextError = validateVcfFile(file);
    if (nextError) {
      setError(nextError);
      setSelectedFile(null);
      return;
    }
    setError("");
    setSelectedFile(file);
  };

  const handleAnalyze = async () => {
    const fileError = validateVcfFile(selectedFile);
    if (fileError) {
      setError(fileError);
      return;
    }
    if (!drugsInput.trim()) {
      setError("Enter at least one drug name.");
      return;
    }

    setIsAnalyzing(true);
    setError("");
    setCopiedDrug("");

    try {
      const payload = await hospitalApi.analyzePharmacogenomics({
        vcfFile: selectedFile,
        drugs: drugsInput,
        patientId: patientId.trim() || undefined,
      });

      const nextReports = payload?.reports || (payload?.report ? [payload.report] : []);
      if (!nextReports.length) {
        setError("No report generated. Please verify your VCF and drug input.");
        setReports([]);
        setQualitySummary(null);
        return;
      }

      setReports(nextReports);
      setQualitySummary(payload?.quality_summary || null);
    } catch (analysisError) {
      setError(analysisError.message || "Failed to analyze pharmacogenomic risks.");
      setReports([]);
      setQualitySummary(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleFileSelection(event.dataTransfer.files?.[0] || null);
  };

  const handleCopyJson = async (report) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
      setCopiedDrug(report.drug);
      window.setTimeout(() => setCopiedDrug(""), 1500);
    } catch (_error) {
      setError("Could not copy report JSON. Please copy manually from raw output.");
    }
  };

  const handleDownloadJson = (report) => {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${report.patient_id}_${report.drug}_report.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-medical-50 px-3 py-1 text-xs font-semibold text-medical-700">
              <Dna className="h-4 w-4" />
              Precision Medicine
            </div>
            <h1 className="mt-3 text-2xl font-bold text-slate-800 md:text-3xl">
              PharmaGuard Pharmacogenomic Risk Predictor
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-500">
              Upload a VCF file and evaluate drug-specific pharmacogenomic risk across CYP2D6, CYP2C19,
              CYP2C9, SLCO1B1, TPMT, and DPYD.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
            <div className="font-semibold text-slate-700">Supported drugs</div>
            <div className="mt-1 leading-relaxed">{supportedDrugs.join(", ")}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <label
            htmlFor="vcf-upload"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex min-h-[170px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition ${
              isDragging
                ? "border-medical-400 bg-medical-50/60"
                : "border-slate-300 bg-slate-50 hover:border-medical-300 hover:bg-medical-50/40"
            }`}
          >
            <UploadCloud className="h-8 w-8 text-medical-600" />
            <p className="mt-3 text-sm font-semibold text-slate-700">
              {selectedFile ? selectedFile.name : "Drop VCF file here or click to upload"}
            </p>
            <p className="mt-1 text-xs text-slate-500">VCF v4.2 • Max 5 MB • INFO tags: GENE, STAR, RS</p>
            <input
              id="vcf-upload"
              type="file"
              accept=".vcf"
              className="hidden"
              onChange={(event) => handleFileSelection(event.target.files?.[0] || null)}
            />
          </label>

          <div className="rounded-2xl border border-slate-200 p-4">
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="drug-input">
              Drug names
            </label>
            <textarea
              id="drug-input"
              rows={4}
              value={drugsInput}
              onChange={(event) => setDrugsInput(event.target.value)}
              placeholder="CODEINE, WARFARIN, CLOPIDOGREL"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-medical-500 focus:ring-4 focus:ring-medical-100"
            />

            <label className="mb-2 mt-4 block text-sm font-semibold text-slate-700" htmlFor="patient-id">
              Patient ID (optional)
            </label>
            <input
              id="patient-id"
              type="text"
              value={patientId}
              onChange={(event) => setPatientId(event.target.value)}
              placeholder="PATIENT_001"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-medical-500 focus:ring-4 focus:ring-medical-100"
            />
          </div>
        </div>

        {error ? (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertTriangle className="mt-0.5 h-4 w-4" />
            <span>{error}</span>
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="rounded-xl bg-medical-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-medical-700 focus:outline-none focus:ring-4 focus:ring-medical-200 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Pharmacogenomic Risk"}
          </button>
          <span className="text-xs text-slate-500">Deterministic CPIC-aligned rule engine + explainable output</span>
        </div>
      </section>

      {reports.length > 0 ? (
        <>
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {Object.entries(riskCounts).map(([label, count]) => (
              <div
                key={label}
                className={`rounded-xl border p-3 ${
                  RISK_STYLES[label]?.card || RISK_STYLES.Unknown.card
                }`}
              >
                <div className="text-xs font-semibold text-slate-600">{label}</div>
                <div className="mt-1 text-2xl font-bold text-slate-800">{count}</div>
              </div>
            ))}
          </section>

          {qualitySummary ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-4">
              <h2 className="text-sm font-semibold text-slate-700">Quality summary</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {Object.entries(qualitySummary).map(([key, value]) => (
                  <div key={key} className="rounded-lg bg-slate-50 p-3">
                    <div className="text-[11px] uppercase tracking-wide text-slate-500">
                      {key.replaceAll("_", " ")}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-slate-800">{formatMetricValue(value)}</div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section className="space-y-4">
            {reports.map((report) => {
              const riskLabel = report?.risk_assessment?.risk_label || "Unknown";
              const style = RISK_STYLES[riskLabel] || RISK_STYLES.Unknown;
              const variants = report?.pharmacogenomic_profile?.detected_variants || [];

              return (
                <article key={`${report.patient_id}-${report.drug}`} className={`rounded-2xl border p-5 ${style.card}`}>
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-bold text-slate-800">{report.drug}</h3>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${style.badge}`}>
                          {riskLabel}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{report?.llm_generated_explanation?.summary}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyJson(report)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <ClipboardCopy className="h-3.5 w-3.5" />
                        {copiedDrug === report.drug ? "Copied" : "Copy JSON"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadJson(report)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download JSON
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl bg-white/80 p-3">
                      <div className="text-[11px] uppercase text-slate-500">Confidence</div>
                      <div className="mt-1 text-lg font-bold text-slate-800">
                        {(report?.risk_assessment?.confidence_score || 0).toFixed(2)}
                      </div>
                    </div>
                    <div className="rounded-xl bg-white/80 p-3">
                      <div className="text-[11px] uppercase text-slate-500">Severity</div>
                      <div className="mt-1 text-lg font-bold capitalize text-slate-800">
                        {report?.risk_assessment?.severity || "unknown"}
                      </div>
                    </div>
                    <div className="rounded-xl bg-white/80 p-3">
                      <div className="text-[11px] uppercase text-slate-500">Primary gene</div>
                      <div className="mt-1 text-lg font-bold text-slate-800">
                        {report?.pharmacogenomic_profile?.primary_gene || "Unknown"}
                      </div>
                    </div>
                    <div className="rounded-xl bg-white/80 p-3">
                      <div className="text-[11px] uppercase text-slate-500">Phenotype</div>
                      <div className="mt-1 text-lg font-bold text-slate-800">
                        {report?.pharmacogenomic_profile?.phenotype || "Unknown"}
                      </div>
                    </div>
                  </div>

                  <details className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
                    <summary className="cursor-pointer select-none text-sm font-semibold text-slate-700">
                      Pharmacogenomic profile
                    </summary>
                    <div className="mt-3 space-y-3 text-sm text-slate-700">
                      <div className="grid gap-2 sm:grid-cols-2">
                        <p>
                          <span className="font-semibold">Diplotype:</span>{" "}
                          {report?.pharmacogenomic_profile?.diplotype || "Unknown"}
                        </p>
                        <p>
                          <span className="font-semibold">Detected variants:</span> {variants.length}
                        </p>
                      </div>
                      <div className="overflow-x-auto rounded-lg border border-slate-200">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-500">
                            <tr>
                              <th className="px-3 py-2">RSID</th>
                              <th className="px-3 py-2">Star</th>
                              <th className="px-3 py-2">Chr</th>
                              <th className="px-3 py-2">Pos</th>
                              <th className="px-3 py-2">Ref/Alt</th>
                            </tr>
                          </thead>
                          <tbody>
                            {variants.length === 0 ? (
                              <tr>
                                <td className="px-3 py-2 text-slate-400" colSpan={5}>
                                  No actionable variants found for this drug&apos;s primary gene.
                                </td>
                              </tr>
                            ) : (
                              variants.map((variant, index) => (
                                <tr key={`${variant.rsid}-${index}`} className="border-t border-slate-100">
                                  <td className="px-3 py-2">{variant.rsid}</td>
                                  <td className="px-3 py-2">{variant.star_allele}</td>
                                  <td className="px-3 py-2">{variant.chromosome}</td>
                                  <td className="px-3 py-2">{variant.position}</td>
                                  <td className="px-3 py-2">
                                    {variant.ref}/{variant.alt}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </details>

                  <details className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
                    <summary className="cursor-pointer select-none text-sm font-semibold text-slate-700">
                      Clinical recommendation and explanation
                    </summary>
                    <div className="mt-3 space-y-3 text-sm text-slate-700">
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="flex items-center gap-2 text-slate-800">
                          <ShieldCheck className="h-4 w-4 text-medical-600" />
                          <span className="font-semibold">Recommendation</span>
                        </div>
                        <p className="mt-2">{report?.clinical_recommendation?.recommendation}</p>
                        <p className="mt-2 text-xs text-slate-500">
                          {report?.clinical_recommendation?.cpic_guideline_reference}
                        </p>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="flex items-center gap-2 text-slate-800">
                          <Sparkles className="h-4 w-4 text-medical-600" />
                          <span className="font-semibold">Biological mechanism</span>
                        </div>
                        <p className="mt-2">{report?.llm_generated_explanation?.biological_mechanism}</p>
                        <p className="mt-2">{report?.llm_generated_explanation?.clinical_impact}</p>
                        <p className="mt-2 text-xs text-slate-500">
                          Citations: {(report?.llm_generated_explanation?.citations || []).join("; ")}
                        </p>
                      </div>
                    </div>
                  </details>

                  <details className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
                    <summary className="cursor-pointer select-none text-sm font-semibold text-slate-700">
                      Quality metrics and raw JSON
                    </summary>
                    <div className="mt-3 grid gap-3 lg:grid-cols-2">
                      <div className="rounded-lg border border-slate-200 p-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Quality metrics</h4>
                        <div className="mt-2 space-y-1 text-sm text-slate-700">
                          {Object.entries(report?.quality_metrics || {}).map(([key, value]) => (
                            <p key={key}>
                              <span className="font-medium">{key.replaceAll("_", " ")}:</span>{" "}
                              {formatMetricValue(value)}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-lg border border-slate-200 p-3">
                        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          <FileJson className="h-4 w-4" />
                          Raw JSON
                        </div>
                        <pre className="max-h-64 overflow-auto rounded bg-slate-900 p-3 text-[11px] leading-relaxed text-slate-100">
                          {JSON.stringify(report, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </details>
                </article>
              );
            })}
          </section>
        </>
      ) : (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          Upload a VCF file and run analysis to generate precision medicine risk reports.
        </section>
      )}
    </div>
  );
};

export default PrecisionMedicine;
