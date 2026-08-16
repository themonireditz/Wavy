import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, MessageSquare, Mail, Smartphone, CheckCircle, Clock, Trash2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const { smsLogs } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 text-slate-100 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Live SMS & Email Dispatches</h3>
                <p className="text-[11px] text-slate-400">Greenweb SMS Gateway & Resend API Simulation</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Info banner */}
          <div className="p-3 bg-teal-950/50 border-b border-teal-900/40 text-xs text-teal-200 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
            <span>
              Real-time Bangladeshi SMS notifications triggered for instant confirmations, 48h/24h balance reminders, and Front Desk arrivals.
            </span>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {smsLogs.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No dispatches yet</p>
                <p className="text-xs text-slate-600 mt-1">Book a room or perform a front desk check-in to trigger live alerts.</p>
              </div>
            ) : (
              smsLogs.map(log => (
                <div
                  key={log.id}
                  className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/80 hover:border-slate-600 transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        log.recipientRole === 'Customer'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : log.recipientRole === 'Hotel Owner'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {log.recipientRole}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{log.recipientPhone}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{log.timestamp.split(' ')[1] || log.timestamp}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/50">
                    {log.message}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-mono text-teal-400/90">{log.provider}</span>
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Delivered
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
