import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import {
  CalendarCheck,
  MapPin,
  Clock,
  CheckCircle2,
  FileText,
  Phone,
  CreditCard,
  Building,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { VoucherModal } from './VoucherModal';

export const MyBookingsView: React.FC = () => {
  const { bookings, setActiveTab } = useApp();
  const [selectedVoucher, setSelectedVoucher] = useState<Booking | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <h1 className="text-2xl font-extrabold text-white font-serif">My Reservations & Digital Vouchers</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Access your digital check-in passes, due balance summaries, and real-time stay statuses.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('marketplace')}
            className="px-4 py-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-bold hover:bg-teal-500/30 transition-all flex items-center gap-1.5"
          >
            <span>Explore More Hotels</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-slate-800 p-8">
            <CalendarCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No active bookings found</h3>
            <p className="text-xs text-slate-400 mt-1">You haven't reserved any hotel rooms in Cox's Bazar yet.</p>
            <button
              onClick={() => setActiveTab('marketplace')}
              className="mt-4 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-sky-600 text-slate-950 font-bold text-xs rounded-xl"
            >
              Browse Hotels & 30% Advance
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => {
              const isCheckedIn = booking.status === 'checked_in';
              const isCompleted = booking.status === 'completed';

              return (
                <div
                  key={booking.id}
                  className="bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-700 p-5 transition-all shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left: Hotel & Voucher Info */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-md bg-slate-800 text-teal-300 border border-teal-500/30">
                          {booking.voucherCode}
                        </span>

                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          isCheckedIn
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : isCompleted
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        }`}>
                          {booking.status === 'confirmed' ? 'Confirmed • Pending Check-in' : booking.status.replace('_', ' ')}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white font-serif">{booking.hotelName}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1 text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-teal-400" /> {booking.hotelZone}
                        </span>
                        <span>•</span>
                        <span>{booking.roomTitle}</span>
                        <span>•</span>
                        <span>{booking.nights} Night(s) ({booking.checkInDate} to {booking.checkOutDate})</span>
                      </div>

                      <div className="text-xs text-slate-400">
                        Guest: <strong className="text-white">{booking.customerName}</strong> ({booking.customerPhone})
                      </div>
                    </div>

                    {/* Right: Payment Status & View Voucher */}
                    <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800 flex sm:flex-col items-center sm:items-end justify-between gap-3">
                      <div>
                        <div className="text-xs text-slate-400">Total: ৳{booking.totalAmount.toLocaleString()}</div>
                        {booking.dueAmount > 0 ? (
                          <div className="text-xs font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 mt-1">
                            Due at Check-in: ৳{booking.dueAmount.toLocaleString()}
                          </div>
                        ) : (
                          <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 mt-1">
                            100% Settled (Zero Due)
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedVoucher(booking)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-400 hover:to-sky-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-teal-500/20"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Voucher & QR</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedVoucher && (
        <VoucherModal
          booking={selectedVoucher}
          onClose={() => setSelectedVoucher(null)}
        />
      )}
    </div>
  );
};
