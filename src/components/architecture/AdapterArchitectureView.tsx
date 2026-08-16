import React, { useState } from 'react';
import { Cpu, CheckCircle2, Play, ArrowRight, Layers, Sparkles, Server, Database, Globe } from 'lucide-react';

export const AdapterArchitectureView: React.FC = () => {
  const [activeAdapter, setActiveAdapter] = useState<'direct' | 'siteminder' | 'staah' | 'external'>('direct');
  const [testQuery, setTestQuery] = useState({
    zone: 'Kolatoli',
    checkIn: '2026-08-16',
    checkOut: '2026-08-18',
    guests: 2
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any | null>(null);

  const handleRunSearch = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationResult({
        success: true,
        executionTimeMs: 42,
        providersQueried: [
          { name: 'DirectDbAdapter (PostgreSQL / Supabase)', latency: '12ms', itemsFound: 4, status: 'OK' },
          { name: 'SiteMinderChannelAdapter (OTA API XML/JSON)', latency: '38ms', itemsFound: 1, status: 'OK' },
          { name: 'StaahChannelAdapter (SOAP/REST)', latency: '41ms', itemsFound: 0, status: 'NO_AVAIL' }
        ],
        aggregatedHotelsCount: 5,
        sampleOutput: [
          {
            id: 'htl-001',
            name: 'Bay Empress Resort & Suites',
            source: 'direct',
            zone: 'Kolatoli',
            startingPrice: 2600,
            isVerified: true
          },
          {
            id: 'htl-003',
            name: 'Marine Crest Eco Beach Haven',
            source: 'siteminder',
            zone: 'Marine Drive',
            startingPrice: 6750,
            isVerified: true
          }
        ]
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Unified Aggregator Pattern • Adapter Architecture
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
            Hybrid Inventory & Channel Manager Adapter Layer
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
            Wavy seamlessly aggregates direct budget/mid-range local hotel inventory (stored in Supabase/PostgreSQL) with external Channel Managers (SiteMinder, STAAH, Agoda API, Shohoz Transit) under a unified TypeScript interface.
          </p>
        </div>

        {/* Interactive Architecture Flow Diagram */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-6">
          <h2 className="text-base font-bold text-white font-serif flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <span>Architecture Flow: Client ➔ Unified Aggregator ➔ Hybrid Providers</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1: Customer Client */}
            <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 inline-block">
                Client / Mobile View
              </div>
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-400" />
                <span>Next.js App Router UI</span>
              </div>
              <p className="text-xs text-slate-400">
                Dispatches single search payload: <code className="text-teal-300 font-mono text-[11px]">POST /api/v1/search</code>
              </p>
            </div>

            {/* Step 2: Aggregator Controller */}
            <div className="bg-slate-850 p-4 rounded-2xl border border-purple-500/40 space-y-2 shadow-lg">
              <div className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 inline-block">
                Aggregator Engine
              </div>
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-purple-400" />
                <span>Promise.allSettled Aggregator</span>
              </div>
              <p className="text-xs text-slate-400">
                Calls parallel adapters with graceful fallback if third-party OTA rate limits or times out.
              </p>
            </div>

            {/* Step 3: Adapter Implementations */}
            <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 inline-block">
                Pluggable Adapters
              </div>
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-sky-400" />
                <span>IInventoryProvider</span>
              </div>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• <strong className="text-slate-200">DirectDbAdapter</strong> (Local Extranet DB)</li>
                <li>• <strong className="text-slate-200">SiteMinderAdapter</strong> (Enterprise OTA)</li>
                <li>• <strong className="text-slate-200">StaahAdapter</strong> (Hotel Extranet Sync)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Live Aggregator Query Simulator */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-white font-serif">Run Live Aggregator Pipeline Test</h3>
              <p className="text-xs text-slate-400">Execute a query across all active providers in parallel.</p>
            </div>

            <button
              onClick={handleRunSearch}
              disabled={isSimulating}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Querying Hybrid Providers...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Execute Aggregator Test</span>
                </>
              )}
            </button>
          </div>

          {simulationResult && (
            <div className="bg-slate-850 rounded-2xl p-5 border border-purple-500/40 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Aggregated 5 Verified Properties in {simulationResult.executionTimeMs}ms</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">Status 200 OK</span>
              </div>

              {/* Providers latency grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {simulationResult.providersQueried.map((p: any, idx: number) => (
                  <div key={idx} className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="font-bold text-white text-[11px] truncate">{p.name}</div>
                    <div className="flex justify-between text-slate-400 text-[10px]">
                      <span>Latency: <strong className="text-teal-300 font-mono">{p.latency}</strong></span>
                      <span>Found: <strong className="text-white">{p.itemsFound}</strong></span>
                    </div>
                  </div>
                ))}
              </div>

              {/* JSON preview */}
              <div className="bg-slate-950 p-4 rounded-xl font-mono text-[11px] text-teal-300 overflow-x-auto border border-slate-800">
                <pre>{JSON.stringify(simulationResult.sampleOutput, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
