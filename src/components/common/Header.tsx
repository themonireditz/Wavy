import React, { useState } from 'react';
import { useApp, ActiveTab } from '../../context/AppContext';
import {
  Waves,
  Building2,
  CalendarCheck,
  UserCheck,
  ShieldCheck,
  Cpu,
  Database,
  Bell,
  Bus,
  Sparkles,
  Zap,
  Phone
} from 'lucide-react';
import { NotificationDrawer } from './NotificationDrawer';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, smsLogs } = useApp();
  const [showDrawer, setShowDrawer] = useState(false);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'marketplace', label: 'Marketplace', icon: <Waves className="w-4 h-4" /> },
    { id: 'my_bookings', label: 'My Vouchers', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'transport', label: 'Bus & Flight', icon: <Bus className="w-4 h-4" />, badge: 'API' },
    { id: 'extranet_frontdesk', label: 'Front Desk Kiosk', icon: <UserCheck className="w-4 h-4 text-emerald-400" />, badge: 'PIN' },
    { id: 'extranet_owner', label: 'Hotel Owner Hub', icon: <Building2 className="w-4 h-4 text-amber-400" /> },
    { id: 'admin_console', label: 'Super Admin Ops', icon: <ShieldCheck className="w-4 h-4 text-sky-400" /> },
    { id: 'adapter_architecture', label: 'Adapter Engine', icon: <Cpu className="w-4 h-4 text-purple-400" /> },
    { id: 'sql_schema', label: 'Supabase SQL', icon: <Database className="w-4 h-4 text-emerald-300" /> }
  ];

  return (
    <>
      <header id="wavy-main-header" className="sticky top-0 z-40 bg-slate-900 text-slate-100 border-b border-slate-800 shadow-md">
        {/* Top Announcement Bar for Cox's Bazar traveler peace of mind */}
        <div className="bg-gradient-to-r from-teal-900/90 via-sky-950 to-slate-900 px-4 py-1.5 text-xs text-teal-200 border-b border-teal-800/40 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-flex items-center gap-1 bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/30">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400 animate-pulse" />
              100% Load-Shedding Assured
            </span>
            <span className="hidden sm:inline">All Wavy verified properties maintain 24/7 heavy generator backup for uninterrupted AC & Wi-Fi.</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Cox's Bazar 30% Advance Policy Active
            </span>
            <a href="tel:+8801700000000" className="hidden md:flex items-center gap-1 text-teal-300 hover:underline">
              <Phone className="w-3 h-3" /> Local Helpline: +880 1700-000000
            </a>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <div
              id="wavy-brand-logo"
              onClick={() => setActiveTab('marketplace')}
              className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-sky-600 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <Waves className="w-6 h-6 text-slate-950 font-bold" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-white font-serif">Wavy</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-400/30">
                    Cox's Bazar
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans hidden sm:block">Hospitality Marketplace & Extranet</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
              {navItems.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-tab-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        item.badge === 'PIN' ? 'bg-emerald-500/30 text-emerald-300' : 'bg-purple-500/30 text-purple-200'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2.5">
              {/* SMS Notification Bell */}
              <button
                id="wavy-sms-tray-toggle"
                onClick={() => setShowDrawer(true)}
                className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                title="View SMS & Resend Alerts"
              >
                <Bell className="w-5 h-5 text-amber-300" />
                {smsLogs.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-slate-900 animate-pulse">
                    {smsLogs.length}
                  </span>
                )}
              </button>

              {/* Currency Badge */}
              <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700 text-xs font-medium text-slate-300">
                <span className="font-bold text-teal-400">BDT</span>
                <span>(৳)</span>
              </div>
            </div>
          </div>

          {/* Mobile Tab Scroll Bar */}
          <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 scrollbar-none border-t border-slate-800">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Real-time SMS & Email Notification Drawer */}
      <NotificationDrawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} />
    </>
  );
};
