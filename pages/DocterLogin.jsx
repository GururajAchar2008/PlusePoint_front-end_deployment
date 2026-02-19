import React, { useState } from "react";
import {
  Activity,
  Clock3,
  Lock,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { hospitalApi } from "../services/api";

const DocterLogin = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const sanitizedUsername = username.trim().toLowerCase();
    if (!sanitizedUsername || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const doctor = await hospitalApi.doctorLogin({
        username: sanitizedUsername,
        password,
      });
      if (onLoginSuccess) {
        onLoginSuccess(doctor);
      }
    } catch (apiError) {
      setError(apiError.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-170px)] animate-fade-in py-2 md:py-6">
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        <div className="grid lg:grid-cols-2">
          <div className="relative overflow-hidden bg-gradient-to-br from-medical-900 via-medical-700 to-medical-500 p-8 text-white md:p-10">
            <div className="absolute -right-24 top-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-20 left-8 h-44 w-44 rounded-full bg-medical-200/20 blur-2xl" />

            <div className="relative z-10">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
                <ShieldCheck className="h-4 w-4" />
                Doctor Portal
              </div>

              <h1 className="text-3xl font-bold leading-tight md:text-4xl">
                Secure access for clinical staff
              </h1>
              <p className="mt-3 text-sm text-medical-100 md:text-base">
                Sign in to manage appointments, review queue updates, and track
                patient status in one place.
              </p>

              <div className="mt-8 space-y-3">
                <div className="flex items-start gap-3 rounded-xl bg-white/10 p-3 backdrop-blur">
                  <Activity className="mt-0.5 h-5 w-5 text-medical-200" />
                  <div>
                    <h2 className="text-sm font-semibold">Live queue insights</h2>
                    <p className="text-xs text-medical-100">
                      See incoming patients and priority cases in real time.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-white/10 p-3 backdrop-blur">
                  <Clock3 className="mt-0.5 h-5 w-5 text-medical-200" />
                  <div>
                    <h2 className="text-sm font-semibold">Faster consult flow</h2>
                    <p className="text-xs text-medical-100">
                      Update appointment progress and reduce wait times.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 md:p-10">
            <div className="mb-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-medical-50 px-3 py-1 text-xs font-semibold text-medical-700">
                <Stethoscope className="h-4 w-4" />
                PulsePoint Hospital
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                Login to Doctor Dashboard
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter your credentials to continue.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="doctor-username"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Username
                </label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="doctor-username"
                    type="text"
                    autoComplete="username"
                    placeholder="eg. dr.smith"
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-medical-500 focus:ring-4 focus:ring-medical-100"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="doctor-password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="doctor-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-medical-500 focus:ring-4 focus:ring-medical-100"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-medical-600 focus:ring-medical-300"
                  />
                  Keep me signed in
                </label>
                <button
                  type="button"
                  className="text-xs font-semibold text-medical-700 hover:text-medical-800"
                >
                  Forgot password?
                </button>
              </div>

              {error ? (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-medical-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-medical-700 focus:outline-none focus:ring-4 focus:ring-medical-200 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-400">
              Authorized clinical staff only.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocterLogin;
