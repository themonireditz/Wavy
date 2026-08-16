import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Hotel, Room, Booking, HotelPayout } from '../../types';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Building,
  RefreshCw,
  Send,
  Eye,
  Sliders,
  MapPin,
  Sparkles,
  Zap,
  ArrowRight,
  ArrowUpRight,
  Clock
} from 'lucide-react';

export const SuperAdminConsole: React.FC = () => {
  const {
    hotels,
    rooms,
    bookings,
    payouts,
    toggleHotelVerification,
    updateHotelCommission,
    reassignOverbookedGuest,
    settlePayout,
    generateWeeklyPayouts
  } = useApp();

  const [activeTab, setActiveTab] = useState<'verification' | 'overbooking' | 'settlement'>('verification');

  // Settlement Form State
  const [selectedPayout, setSelectedPayout] = useState<HotelPayout | null>(null);
  const [paymentRef, setPaymentRef] = useState('bKash-COMM-99210');
  const [payoutChannel, setPayoutChannel] = useState<'bKash_Merchant' | 'City_Bank_BEFTN' | 'Islami_Bank_NPSB'>('bKash_Merchant');

  // Overbooking conflict simulation
  const [selectedConflictBooking, setSelectedConflictBooking] = useState<Booking | null>(null);
  const [reassignSuccessMsg, setReassignSuccessMsg] = useState('');

  const pendingPayouts = payouts.filter(p => p.payoutStatus === 'pending');
  const settledPayouts = payouts.filter(p => p.payoutStatus === 'settled');

  // Overbooking candidates (Bookings that can be tested for 500m nearby reassignment)
  const activeBookings = bookings.filter(b => b.status === 'confirmed');

  const handleSettle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayout) return;

    settlePayout(selectedPayout.id, paymentRef, payoutChannel);
    setSelectedPayout(null);
  };

  const handleReassign = (booking: Booking, targetHotel: Hotel, targetRoom: Room) => {
    const success = reassignOverbookedGuest(booking.id, targetHotel.id, targetRoom.id);
    if (success) {
      setReassignSuccessMsg(`Successfully reassigned ${booking.customerName} to ${targetHotel.name} (${targetRoom.roomTitle}). Free upgrade SMS delivered.`);
      setSelectedConflictBooking(null);
      setTimeout(() => setReassignSuccessMsg(''), 6000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Console Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white font-serif">Super Admin Operations Desk</h1>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Cox's Bazar HQ
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Property audits, Overbooking 500m Reassignment Engine, and Monday Weekly Settlements.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={generateWeeklyPayouts}
              className="px-3.5 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-xs font-bold border border-teal-500/40 flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Run Monday Calculation</span>
            </button>
          </div>
        </div>

        {/* Console Sub Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('verification')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'verification'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Property Verification & Commission Pipeline</span>
          </button>

          <button
            onClick={() => setActiveTab('overbooking')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'overbooking'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Overbooking & 500m Collision Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('settlement')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'settlement'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Weekly Payout Settlement Desk ({pendingPayouts.length} Pending)</span>
          </button>
        </div>

        {/* TAB 1: PROPERTY VERIFICATION & COMMISSION */}
        {activeTab === 'verification' && (
          <div className="space-y-4">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4">
              <div>
                <h2 className="text-base font-bold text-white font-serif">Partner Properties Audit & Commission Tuning</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verify properties after physical room audits, generator wattage tests, and set contracted commission (10% to 20%).
                </p>
              </div>

              <div className="space-y-4">
                {hotels.map(hotel => (
                  <div
                    key={hotel.id}
                    className="bg-slate-850 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={hotel.coverImage}
                        alt={hotel.name}
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-white">{hotel.name}</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-teal-300">
                            {hotel.zone}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{hotel.landmarkDistance}</div>
                        <div className="text-xs text-slate-300 mt-1">
                          Owner: <strong>{hotel.ownerName}</strong> ({hotel.ownerPhone})
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                            ⚡ 24/7 Generator Audited
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                            Sync: {hotel.inventorySource}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                      {/* Commission rate slider */}
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                        <div className="flex justify-between text-slate-400 text-[11px]">
                          <span>Commission Rate:</span>
                          <strong className="text-teal-300 font-mono">{hotel.commissionRate}%</strong>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="20"
                          step="0.5"
                          value={hotel.commissionRate}
                          onChange={e => updateHotelCommission(hotel.id, Number(e.target.value))}
                          className="w-32 accent-teal-400 cursor-pointer"
                        />
                      </div>

                      {/* Verification Toggle */}
                      <button
                        onClick={() => toggleHotelVerification(hotel.id)}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                          hotel.isVerified
                            ? 'bg-teal-500 text-slate-950 hover:bg-teal-400 shadow-md shadow-teal-500/20'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>{hotel.isVerified ? 'Verified Partner ✓' : 'Approve & Verify'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: OVERBOOKING & 500M COLLISION ENGINE */}
        {activeTab === 'overbooking' && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <h2 className="text-base font-bold text-white font-serif">
                  Overbooking Conflict Detector & 1-Click 500m Reassign Tool
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                If a hotel reports unexpected plumbing/AC failure or overbooking, instantly reassign the guest to a nearby partner hotel within 500m in the same price tier with zero disruption.
              </p>
            </div>

            {reassignSuccessMsg && (
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>{reassignSuccessMsg}</span>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-300">Active Bookings in Queue:</h3>
              {activeBookings.map(b => (
                <div
                  key={b.id}
                  className="bg-slate-850 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-teal-300 bg-slate-900 px-2 py-0.5 rounded border border-teal-500/30">
                        {b.voucherCode}
                      </span>
                      <h4 className="font-bold text-sm text-white">{b.customerName} ({b.customerPhone})</h4>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Current Hotel: <strong className="text-slate-200">{b.hotelName}</strong> ({b.hotelZone}) • {b.roomTitle}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Dates: {b.checkInDate} to {b.checkOutDate} ({b.nights}N) • Total: ৳{b.totalAmount.toLocaleString()}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedConflictBooking(b)}
                    className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/40 flex items-center gap-1.5 cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Trigger 500m Auto-Reassign</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Reassignment Modal */}
            {selectedConflictBooking && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 text-slate-100 shadow-2xl space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-teal-400" />
                      <h3 className="font-bold text-base text-white font-serif">
                        Nearby Partner Hotels within 500m (Same Price Tier)
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedConflictBooking(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="bg-slate-850 p-3 rounded-xl border border-slate-800 text-xs">
                    Reassigning: <strong className="text-white">{selectedConflictBooking.customerName}</strong> from <strong className="text-rose-300">{selectedConflictBooking.hotelName}</strong>
                  </div>

                  <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                    {hotels
                      .filter(h => h.id !== selectedConflictBooking.hotelId && (h.zone === selectedConflictBooking.hotelZone || true))
                      .map(candidateHotel => {
                        const candidateRooms = rooms.filter(r => r.hotelId === candidateHotel.id && r.availableUnits > 0);
                        if (candidateRooms.length === 0) return null;

                        const bestRoom = candidateRooms[0];

                        return (
                          <div
                            key={candidateHotel.id}
                            className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300">
                                  ~280m from {selectedConflictBooking.hotelName}
                                </span>
                                <h4 className="font-bold text-sm text-white">{candidateHotel.name}</h4>
                              </div>
                              <div className="text-xs text-slate-300 mt-1">
                                Available Room: <strong className="text-teal-300">{bestRoom.roomTitle}</strong> ({bestRoom.availableUnits} units available)
                              </div>
                              <div className="text-[11px] text-slate-400">{candidateHotel.landmarkDistance}</div>
                            </div>

                            <button
                              onClick={() => handleReassign(selectedConflictBooking, candidateHotel, bestRoom)}
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-400 hover:to-sky-500 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 cursor-pointer"
                            >
                              1-Click Reassign & SMS Guest
                            </button>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: WEEKLY SETTLEMENT DESK */}
        {activeTab === 'settlement' && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white font-serif flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <span>Automated Monday Settlement Calculation Desk</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Calculates gross earnings, deducts agreed commission (10–15%) and gateway fees, then records Tuesday bank/bKash disbursements.
                </p>
              </div>

              <button
                onClick={generateWeeklyPayouts}
                className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 shadow-md shadow-teal-500/20"
              >
                + Generate This Week's Payouts
              </button>
            </div>

            {/* Payouts Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="pb-3 font-semibold">Hotel Property</th>
                    <th className="pb-3 font-semibold">Cycle Range</th>
                    <th className="pb-3 font-semibold">Gross Earned</th>
                    <th className="pb-3 font-semibold">Commission</th>
                    <th className="pb-3 font-semibold">Net Payout</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {payouts.map(p => (
                    <tr key={p.id} className="hover:bg-slate-850/50">
                      <td className="py-3.5 font-bold text-white">{p.hotelName}</td>
                      <td className="py-3.5 text-slate-300">{p.cycleStart} to {p.cycleEnd}</td>
                      <td className="py-3.5 font-mono text-slate-200">৳{p.grossEarnings.toLocaleString()}</td>
                      <td className="py-3.5 font-mono text-rose-400">
                        -৳{p.commissionDeducted.toLocaleString()} ({p.commissionRate}%)
                      </td>
                      <td className="py-3.5 font-mono font-bold text-emerald-400 text-sm">
                        ৳{p.netPayout.toLocaleString()}
                      </td>
                      <td className="py-3.5">
                        {p.payoutStatus === 'settled' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Settled ✓
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Pending Disburse
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 text-right">
                        {p.payoutStatus === 'pending' ? (
                          <button
                            onClick={() => setSelectedPayout(p)}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg shadow-sm"
                          >
                            Disburse Now
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px] inline-block">
                            {p.paymentReference}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Payout Modal */}
            {selectedPayout && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-base text-white">Record Weekly Payout Transfer</h3>
                    <button onClick={() => setSelectedPayout(null)} className="text-slate-400 hover:text-white">✕</button>
                  </div>

                  <div className="bg-slate-850 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="text-slate-400">Hotel: <strong className="text-white">{selectedPayout.hotelName}</strong></div>
                    <div className="text-slate-400">Gross: ৳{selectedPayout.grossEarnings.toLocaleString()}</div>
                    <div className="text-emerald-400 font-bold text-sm">Net to Disburse: ৳{selectedPayout.netPayout.toLocaleString()}</div>
                  </div>

                  <form onSubmit={handleSettle} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Disbursement Channel</label>
                      <select
                        value={payoutChannel}
                        onChange={e => setPayoutChannel(e.target.value as any)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                      >
                        <option value="bKash_Merchant">bKash Merchant B2B Payout</option>
                        <option value="City_Bank_BEFTN">City Bank (BEFTN / RTGS)</option>
                        <option value="Islami_Bank_NPSB">Islami Bank Bangladesh (NPSB Instant)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Bank / Transaction Reference</label>
                      <input
                        type="text"
                        required
                        value={paymentRef}
                        onChange={e => setPaymentRef(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg"
                    >
                      Confirm Disbursement & Send SMS Alert
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
