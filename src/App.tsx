import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { MarketplaceView } from './components/customer/MarketplaceView';
import { MyBookingsView } from './components/customer/MyBookingsView';
import { TransportBookingView } from './components/customer/TransportBookingView';
import { FrontDeskView } from './components/extranet/FrontDeskView';
import { OwnerDashboardView } from './components/extranet/OwnerDashboardView';
import { SuperAdminConsole } from './components/admin/SuperAdminConsole';
import { AdapterArchitectureView } from './components/architecture/AdapterArchitectureView';
import { SqlMigrationView } from './components/architecture/SqlMigrationView';
import { Waves, Heart, ShieldCheck, Phone, Zap } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-slate-950">
      <Header />

      <main className="flex-1">
        {activeTab === 'marketplace' && <MarketplaceView />}
        {activeTab === 'my_bookings' && <MyBookingsView />}
        {activeTab === 'transport' && <TransportBookingView />}
        {activeTab === 'extranet_frontdesk' && <FrontDeskView />}
        {activeTab === 'extranet_owner' && <OwnerDashboardView />}
        {activeTab === 'admin_console' && <SuperAdminConsole />}
        {activeTab === 'adapter_architecture' && <AdapterArchitectureView />}
        {activeTab === 'sql_schema' && <SqlMigrationView />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold font-serif text-xs">
              W
            </div>
            <span className="font-bold text-white">Wavy</span>
            <span>— Cox's Bazar Hospitality Marketplace & Extranet</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-teal-300">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" /> 24/7 Generator Audited
            </span>
            <span>•</span>
            <span>30% Advance Instant Booking</span>
            <span>•</span>
            <button
              onClick={() => setActiveTab('sql_schema')}
              className="text-slate-300 hover:text-white underline cursor-pointer"
            >
              Supabase SQL Schema
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('adapter_architecture')}
              className="text-slate-300 hover:text-white underline cursor-pointer"
            >
              Adapter API
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
