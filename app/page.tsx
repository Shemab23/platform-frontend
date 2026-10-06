"use client";

import { useEffect, useState } from "react";
import {
  safeFetch,
  TenantConfigResponse,
  HealthResponse,
} from "@/src/utils/api";

export default function Home() {
  const [tenantData, setTenantData] = useState<TenantConfigResponse | null>(
    null,
  );
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      // Fetch tenant configuration safely
      const tenantRes = await safeFetch<TenantConfigResponse>(
        "/api/tenant/config",
        {
          headers: { "x-tenant": "shop-a" },
        },
      );

      // Fetch backend health checks safely
      const healthRes = await safeFetch<HealthResponse>("/health");

      if (tenantRes.error) {
        setError(`Tenant API Error: ${tenantRes.error}`);
      } else if (healthRes.error) {
        setError(`Health API Error: ${healthRes.error}`);
      } else {
        setTenantData(tenantRes.data);
        setHealthData(healthRes.data);
      }

      setLoading(false);
    }

    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-8 flex flex-col gap-6">
      <div className="border-b border-slate-700 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-blue-400">
          Platform Control Center
        </h1>
        <p className="text-slate-400 mt-1">
          Multi-tenant full-stack deployment state monitor.
        </p>
      </div>

      {loading && (
        <div className="text-blue-400 font-medium animate-pulse">
          📡 Querying proxy routes...
        </div>
      )}

      {error && (
        <div className="bg-red-950/50 border border-red-500 text-red-200 p-4 rounded-lg font-mono text-sm max-w-2xl break-all">
          <strong className="text-red-400 block mb-1">
            ⚠️ Connection Crash Caught Safely:
          </strong>
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {/* Tenant Card */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
            <h2 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
              🏪 Tenant Information
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-slate-400">Active Identifier Slug:</span>{" "}
                <span className="font-mono bg-slate-950 px-2 py-0.5 rounded text-yellow-400 font-bold">
                  {tenantData?.slug}
                </span>
              </p>
              <p>
                <span className="text-slate-400">Order Logs History:</span>{" "}
                <span
                  className={
                    tenantData?.hasOrderHistory
                      ? "text-green-400 font-medium"
                      : "text-red-400 font-medium"
                  }
                >
                  {tenantData?.hasOrderHistory ? "Enabled" : "Disabled"}
                </span>
              </p>
              <p>
                <span className="text-slate-400">
                  Delivery Processing Modules:
                </span>{" "}
                <span
                  className={
                    tenantData?.hasDeliveryProcessing
                      ? "text-green-400 font-medium"
                      : "text-red-400 font-medium"
                  }
                >
                  {tenantData?.hasDeliveryProcessing ? "Active" : "Inactive"}
                </span>
              </p>
            </div>
          </div>

          {/* Infrastructure Health Card */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
            <h2 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
              🖥️ Environment Cluster Status
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-slate-400">Environment Node:</span>{" "}
                <span className="font-mono bg-slate-950 px-2 py-0.5 rounded text-blue-400 font-bold">
                  {healthData?.env}
                </span>
              </p>
              <p>
                <span className="text-slate-400">System Gateway state:</span>{" "}
                <span className="text-green-400 font-medium font-mono">
                  {healthData?.status}
                </span>
              </p>
              <p>
                <span className="text-slate-400">Neon SQL Database Core:</span>{" "}
                <span className="text-green-400 font-medium font-mono">
                  {healthData?.database}
                </span>
              </p>
              <p className="text-xs text-slate-500 pt-2 border-t border-slate-700 mt-2">
                SQL Engine Timestamp: {healthData?.timestamp}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
