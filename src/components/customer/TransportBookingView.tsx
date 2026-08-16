import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TransportBooking } from '../../types';
import {
  Bus,
  Plane,
  Train,
  Clock,
  MapPin,
  CheckCircle2,
  Ticket,
  Users,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const TransportBookingView: React.FC = () => {
  const { transports, bookTransport } = useApp();
  const [selectedTransport, setSelectedTransport] = useState<TransportBooking | null>(null);
  const [guestName, setGuestName] = useState('Tanvir Ahmed');
  const [guestPhone, setGuestPhone] = useState('+8801712998877');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTransport) return;

    bookTransport(selectedTransport.id, guestName, guestPhone, selectedTransport.seatNumbers);
    setBookingSuccess(selectedTransport.ticketPnr);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="pb-4 border-b border-slate-800">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Direct Transit Aggregator API Layer (Shohoz / FlyHub / Rail GDS)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
            Dhaka to Cox's Bazar Transport Tickets
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Seamless travel bundling: Book Scania AC Sleeper Buses, Biman flights, or Cox's Bazar Express train seats.
          </p>
        </div>

        {/* Transport Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {transports.map(t => {
            const isBus = t.transportType === 'bus';
            const isAir = t.transportType === 'air';
            const isTrain = t.transportType === 'train';

            return (
              <div
                key={t.id}
                className="bg-slate-900 rounded-2xl border border-slate-800 hover:border-purple-500/50 p-5 transition-all shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isBus ? 'bg-emerald-500/20 text-emerald-300' : isAir ? 'bg-sky-500/20 text-sky-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {isBus ? <Bus className="w-5 h-5" /> : isAir ? <Plane className="w-5 h-5" /> : <Train className="w-5 h-5" />}
                    </div>

                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {t.classType}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-white line-clamp-1">{t.providerName}</h3>
                    <div className="text-xs text-slate-400 mt-1 space-y-0.5">
                      <div>From: <strong className="text-slate-200">{t.origin}</strong></div>
                      <div>To: <strong className="text-slate-200">{t.destination}</strong></div>
                    </div>
                  </div>

                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-teal-400" /> Departure:</span>
                      <span className="font-bold text-white">{t.departureTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Arrival:</span>
                      <span>{t.arrivalTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-700">
                      <span>Pre-allocated Seats:</span>
                      <span className="font-mono font-bold text-purple-300">{t.seatNumbers.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400">Per Passenger</div>
                    <div className="text-lg font-black text-white font-mono">৳{t.pricePerSeat.toLocaleString()}</div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedTransport(t);
                      setBookingSuccess(null);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/20 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Select Seats</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal for Booking Transport */}
        {selectedTransport && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-purple-400" />
                  <h3 className="font-bold text-base text-white">Confirm Transit Ticket</h3>
                </div>
                <button
                  onClick={() => setSelectedTransport(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {!bookingSuccess ? (
                <form onSubmit={handleBook} className="space-y-4">
                  <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1.5">
                    <div className="font-bold text-white">{selectedTransport.providerName}</div>
                    <div className="text-slate-400">{selectedTransport.origin} ➔ {selectedTransport.destination}</div>
                    <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-700">
                      <span>Seats: <strong className="text-purple-300">{selectedTransport.seatNumbers.join(', ')}</strong></span>
                      <span>Total: <strong className="text-white font-mono">৳{(selectedTransport.pricePerSeat * selectedTransport.seatNumbers.length).toLocaleString()}</strong></span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Passenger Name</label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={e => setGuestName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Passenger Mobile (For SMS PNR)</label>
                    <input
                      type="tel"
                      required
                      value={guestPhone}
                      onChange={e => setGuestPhone(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30"
                  >
                    Confirm & Send Ticket SMS via API
                  </button>
                </form>
              ) : (
                <div className="text-center py-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-white text-base">Ticket Issued Successfully!</h4>
                  <div className="bg-slate-800 p-3 rounded-xl font-mono text-sm text-purple-300 font-bold">
                    PNR: {bookingSuccess}
                  </div>
                  <p className="text-xs text-slate-400">
                    A confirmation SMS has been dispatched to {guestPhone}. Present this PNR at the boarding counter.
                  </p>
                  <button
                    onClick={() => setSelectedTransport(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg text-slate-200"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
