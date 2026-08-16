import React, { useState } from 'react';
import { Booking } from '../../types';
import {
  X,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Zap,
  Phone,
  AlertCircle,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface Props {
  booking: Booking;
  onClose: () => void;
}

export const VoucherModal: React.FC<Props> = ({ booking, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(booking.voucherCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full max-h-[95vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden print:border-0 print:shadow-none print:bg-white print:text-black">
        {/* Modal Controls (Hidden in print) */}
        <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between print:hidden flex-shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-300">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Official Wavy Digital Reservation Voucher</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5 text-teal-400" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Voucher Body */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6 print:p-4 print:space-y-4">
          {/* Voucher Header & QR Section */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950/60 p-5 rounded-2xl border border-teal-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 print:bg-slate-50 print:border-slate-300">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-2xl text-white print:text-black tracking-tight">Wavy</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 print:text-slate-700">
                  Cox's Bazar
                </span>
              </div>
              <p className="text-xs text-slate-400 print:text-slate-600 mt-1">Confirmed Hospitality Reservation Voucher</p>

              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-slate-400">Voucher ID:</span>
                <span className="font-mono font-extrabold text-lg text-teal-300 print:text-slate-900 tracking-wider bg-slate-900/80 px-2.5 py-0.5 rounded border border-teal-500/40">
                  {booking.voucherCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 print:hidden transition-colors"
                  title="Copy Voucher Code"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* QR Code Block */}
            <div className="bg-white p-3 rounded-xl shadow-md flex flex-col items-center justify-center text-center">
              {/* SVG QR Code Simulation */}
              <svg className="w-24 h-24 text-slate-950" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm12 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm-2-2h2v2h-2v-2zm-6-2h2v2h-2v-2zm0 4h2v2h-2v-2zm2-2h2v2h-2v-2zM6 6h2v2H6V6zm10 0h2v2h-2V6zM6 18h2v2H6v-2z" />
              </svg>
              <span className="text-[9px] font-bold text-slate-700 uppercase tracking-tighter mt-1">
                Scan at Front Desk
              </span>
            </div>
          </div>

          {/* High-Contrast Due Amount Callout Banner */}
          {booking.dueAmount > 0 ? (
            <div className="bg-amber-500/15 border-2 border-amber-500/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-200 print:bg-amber-50 print:border-amber-400 print:text-amber-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 font-black text-lg">
                  ৳
                </div>
                <div>
                  <div className="text-xs uppercase font-extrabold tracking-wider text-amber-300 print:text-amber-900">
                    Remaining 70% Balance Due at Front Desk
                  </div>
                  <div className="text-xs text-slate-300 print:text-slate-700">
                    Payable via Cash, bKash, or POS upon arrival at hotel reception.
                  </div>
                </div>
              </div>
              <div className="sm:text-right">
                <div className="text-2xl font-black font-mono text-amber-300 print:text-amber-900">
                  ৳{booking.dueAmount.toLocaleString()}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-2xl p-4 flex items-center justify-between text-emerald-200 print:bg-emerald-50 print:border-emerald-300 print:text-emerald-900">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
                <div>
                  <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-300 print:text-emerald-900">
                    100% Fully Settled • Zero Due at Check-in
                  </div>
                  <div className="text-xs text-slate-300 print:text-slate-700">
                    Present your voucher code or QR for direct key handover.
                  </div>
                </div>
              </div>
              <div className="text-xl font-bold font-mono text-emerald-300 print:text-emerald-900">
                PAID IN FULL
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Property Information */}
            <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-2 print:bg-white print:border-slate-300">
              <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">Property & Location</div>
              <div className="font-bold text-sm text-white print:text-black">{booking.hotelName}</div>
              <div className="text-slate-400 print:text-slate-600 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-400 flex-shrink-0 mt-0.5" />
                <span>Zone: <strong className="text-white print:text-black">{booking.hotelZone}</strong></span>
              </div>
              <div className="text-slate-400 print:text-slate-600">
                Standard Check-in: <strong className="text-white print:text-black">12:00 PM</strong> • Check-out: <strong className="text-white print:text-black">11:00 AM</strong>
              </div>
            </div>

            {/* Guest & Room Information */}
            <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-2 print:bg-white print:border-slate-300">
              <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">Guest & Room Details</div>
              <div className="font-bold text-sm text-white print:text-black">{booking.customerName}</div>
              <div className="text-slate-400 print:text-slate-600 flex items-center gap-1 font-mono">
                <Phone className="w-3 h-3 text-teal-400" /> {booking.customerPhone}
              </div>
              <div className="text-slate-300 print:text-slate-700">
                Reserved: <strong className="text-white print:text-black">{booking.roomTitle}</strong> ({booking.roomsCount} Room, {booking.guestCount} Guests)
              </div>
            </div>
          </div>

          {/* Stay Timeline & Financial Summary */}
          <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 print:bg-white print:border-slate-300 space-y-3 text-xs">
            <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">Financial Breakdown (BDT ৳)</div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300 print:text-slate-700">
                <span>Check-in Date:</span>
                <span className="font-bold text-white print:text-black">{booking.checkInDate} (From 12:00 PM)</span>
              </div>
              <div className="flex justify-between text-slate-300 print:text-slate-700">
                <span>Check-out Date:</span>
                <span className="font-bold text-white print:text-black">{booking.checkOutDate} (Until 11:00 AM)</span>
              </div>
              <div className="flex justify-between text-slate-300 print:text-slate-700">
                <span>Total Stay Duration:</span>
                <span className="font-bold text-white print:text-black">{booking.nights} Night(s)</span>
              </div>
              <div className="h-px bg-slate-750 my-1"></div>
              <div className="flex justify-between text-slate-300 print:text-slate-700">
                <span>Total Room Cost:</span>
                <span className="font-mono font-bold text-white print:text-black">৳{booking.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-400 print:text-emerald-700">
                <span>Advance Paid Online ({booking.paymentGateway}):</span>
                <span className="font-mono font-bold">৳{booking.advancePaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-amber-300 font-bold print:text-amber-800 text-sm pt-1 border-t border-slate-700">
                <span>Balance Due at Front Desk:</span>
                <span className="font-mono">৳{booking.dueAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Essential Policies & Local Hotline */}
          <div className="text-[11px] text-slate-400 print:text-slate-600 space-y-1.5 border-t border-slate-800 pt-3">
            <div className="font-bold text-slate-300 print:text-slate-800">Check-in Guidelines & Cancellation Policy:</div>
            <p>
              • Please present a National ID (NID) or Passport along with this voucher at reception upon arrival.
            </p>
            <p>
              • Standard check-in is 12:00 PM. For late night bus/flight arrivals, contact hotel desk in advance.
            </p>
            <p>
              • Cancellations ≥7 days before check-in receive 100% refund (minus 2.5% gateway charge). Cancellations &lt;72 hours are non-refundable.
            </p>
            <p className="font-bold text-teal-300 print:text-teal-800">
              Wavy Cox's Bazar 24/7 Concierge Hotline: +880 1700-000000
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
