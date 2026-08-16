import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking, Room } from '../../types';
import {
  UserCheck,
  Search,
  CheckCircle2,
  DollarSign,
  Lock,
  Unlock,
  AlertTriangle,
  Plus,
  Minus,
  Sparkles,
  Phone,
  Clock,
  LogOut,
  Building,
  CreditCard,
  QrCode,
  ShieldCheck
} from 'lucide-react';

export const FrontDeskView: React.FC = () => {
  const {
    hotels,
    rooms,
    bookings,
    currentStaff,
    staffPinAuth,
    logoutStaff,
    activeHotelForExtranet,
    setActiveHotelForExtranet,
    frontDeskCheckIn,
    updateRoomAvailability,
    emergencyFreezeRoom,
    unfreezeRoom
  } = useApp();

  // PIN login state
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Active operations tab
  const [activeSubTab, setActiveSubTab] = useState<'arrivals' | 'inhouse' | 'inventory'>('arrivals');

  // Voucher Scanner & Check-in Form
  const [searchVoucherCode, setSearchVoucherCode] = useState('');
  const [matchedBooking, setMatchedBooking] = useState<Booking | null>(null);
  const [collectionMethod, setCollectionMethod] = useState<'FrontDeskCash' | 'bKash' | 'Card'>('FrontDeskCash');
  const [checkInMessage, setCheckInMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const selectedHotel = activeHotelForExtranet;
  const hotelRooms = rooms.filter(r => r.hotelId === selectedHotel.id);
  const hotelBookings = bookings.filter(b => b.hotelId === selectedHotel.id);

  const arrivingToday = hotelBookings.filter(b => b.status === 'confirmed');
  const inHouseGuests = hotelBookings.filter(b => b.status === 'checked_in');

  // Handle PIN Login
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    const res = staffPinAuth(pinInput, selectedHotel.id);
    if (!res.success) {
      setPinError(res.message || 'Invalid PIN');
    }
  };

  const handleLookupVoucher = (code: string) => {
    setCheckInMessage(null);
    const found = hotelBookings.find(
      b => b.voucherCode.toUpperCase().trim() === code.toUpperCase().trim()
    );
    if (found) {
      setMatchedBooking(found);
      setSearchVoucherCode(found.voucherCode);
    } else {
      setMatchedBooking(null);
      setCheckInMessage({ type: 'error', text: `Voucher "${code}" not found for this property.` });
    }
  };

  const handlePerformCheckIn = (booking: Booking) => {
    const res = frontDeskCheckIn(booking.voucherCode, booking.dueAmount, collectionMethod);
    if (res.success) {
      setCheckInMessage({ type: 'success', text: res.message });
      setMatchedBooking(res.booking || null);
    } else {
      setCheckInMessage({ type: 'error', text: res.message });
    }
  };

  // If not authenticated with PIN, show Kiosk PIN Gate
  if (!currentStaff) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <UserCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white font-serif">Front Desk Staff Kiosk</h2>
            <p className="text-xs text-slate-400">
              Enter your assigned 4-digit staff authorization PIN for rapid check-ins & live inventory sync.
            </p>
          </div>

          {/* Hotel Switcher for Demo / Testing */}
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-1">
            <label className="block text-[11px] font-bold text-slate-400 uppercase">Select Hotel Property</label>
            <select
              value={selectedHotel.id}
              onChange={e => {
                const h = hotels.find(item => item.id === e.target.value);
                if (h) setActiveHotelForExtranet(h);
              }}
              className="w-full bg-transparent text-xs font-semibold text-teal-300 focus:outline-none cursor-pointer"
            >
              {hotels.map(h => (
                <option key={h.id} value={h.id} className="bg-slate-800 text-white">
                  {h.name} ({h.zone})
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 text-center">
                Enter Staff PIN
              </label>
              <input
                type="password"
                maxLength={6}
                autoFocus
                value={pinInput}
                onChange={e => setPinInput(e.target.value)}
                placeholder="••••"
                className="w-full bg-slate-950 border-2 border-slate-700 focus:border-emerald-400 rounded-2xl py-3 text-center font-mono text-2xl tracking-[0.5em] text-white focus:outline-none shadow-inner"
              />
              {pinError && (
                <p className="text-xs text-rose-400 font-medium text-center mt-2 flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> {pinError}
                </p>
              )}
            </div>

            <button
              type="submit"
              id="btn-pin-auth"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Lock className="w-4 h-4" />
              <span>Unlock Reception Console</span>
            </button>
          </form>

          <div className="bg-slate-850 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="font-bold text-slate-300">Quick Test PINs:</div>
            <div>• Bay Empress Resort: <span className="font-mono text-emerald-400 font-bold">1234</span></div>
            <div>• Coral Breeze Hotel: <span className="font-mono text-emerald-400 font-bold">5678</span></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Extranet Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white font-serif">{selectedHotel.name}</h1>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Front Desk Live
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Staff: <strong className="text-slate-200">{currentStaff.fullName}</strong> ({currentStaff.designation})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={logoutStaff}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Lock Kiosk</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('arrivals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'arrivals'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>Today's Arrivals</span>
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold flex items-center justify-center">
              {arrivingToday.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('inhouse')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'inhouse'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>In-House Guests</span>
            <span className="w-5 h-5 rounded-full bg-sky-500 text-slate-950 text-[10px] font-extrabold flex items-center justify-center">
              {inHouseGuests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'inventory'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>Frictionless Room Inventory (+ / -)</span>
          </button>
        </div>

        {/* TAB 1: ARRIVALS & VOUCHER SCANNER */}
        {activeSubTab === 'arrivals' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Voucher Code Lookup & Balance Collector */}
            <div className="lg:col-span-2 space-y-6">
              {/* Voucher Scanner Box */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-bold text-sm text-white">Voucher Check-in & Balance Collector</h3>
                  </div>
                  <span className="text-[11px] text-slate-400">Scan QR or enter 12-char code</span>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={searchVoucherCode}
                      onChange={e => setSearchVoucherCode(e.target.value)}
                      placeholder="e.g. WVY-7821-CXB"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs font-mono uppercase text-white tracking-wider focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <button
                    onClick={() => handleLookupVoucher(searchVoucherCode)}
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md cursor-pointer"
                  >
                    Lookup
                  </button>
                </div>

                {checkInMessage && (
                  <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    checkInMessage.type === 'success'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}>
                    {checkInMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
                    <span>{checkInMessage.text}</span>
                  </div>
                )}

                {/* Matched Voucher Details Card */}
                {matchedBooking && (
                  <div className="bg-slate-850 rounded-2xl border border-teal-500/40 p-5 space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Guest Name</div>
                        <div className="font-bold text-base text-white">{matchedBooking.customerName}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-teal-400" /> {matchedBooking.customerPhone}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Voucher Code</div>
                        <div className="font-mono font-black text-sm text-teal-300 bg-slate-800 px-2 py-0.5 rounded border border-teal-500/40">
                          {matchedBooking.voucherCode}
                        </div>
                        <div className={`text-[10px] font-bold mt-1 ${matchedBooking.status === 'checked_in' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          Status: {matchedBooking.status.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400">Reserved Room:</span>
                        <div className="font-bold text-white mt-0.5">{matchedBooking.roomTitle}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Duration:</span>
                        <div className="font-bold text-white mt-0.5">{matchedBooking.nights} Night(s)</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Total Price:</span>
                        <div className="font-bold font-mono text-white mt-0.5">৳{matchedBooking.totalAmount.toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Balance collection block */}
                    {matchedBooking.dueAmount > 0 ? (
                      <div className="bg-amber-500/15 border border-amber-500/40 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-amber-300">Remaining 70% Balance Due:</div>
                            <div className="text-xs text-slate-400">Must collect before handing over room keys</div>
                          </div>
                          <div className="text-2xl font-black font-mono text-amber-300">
                            ৳{matchedBooking.dueAmount.toLocaleString()}
                          </div>
                        </div>

                        {/* Payment Collection Channel */}
                        <div className="pt-2 border-t border-amber-500/30">
                          <label className="block text-[11px] text-slate-300 mb-1.5 font-bold">Select Collection Method:</label>
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              type="button"
                              onClick={() => setCollectionMethod('FrontDeskCash')}
                              className={`py-2 rounded-lg text-xs font-bold transition-all ${
                                collectionMethod === 'FrontDeskCash'
                                  ? 'bg-amber-400 text-slate-950'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              💵 Cash
                            </button>
                            <button
                              type="button"
                              onClick={() => setCollectionMethod('bKash')}
                              className={`py-2 rounded-lg text-xs font-bold transition-all ${
                                collectionMethod === 'bKash'
                                  ? 'bg-pink-500 text-white'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              📱 bKash Merchant
                            </button>
                            <button
                              type="button"
                              onClick={() => setCollectionMethod('Card')}
                              className={`py-2 rounded-lg text-xs font-bold transition-all ${
                                collectionMethod === 'Card'
                                  ? 'bg-sky-500 text-slate-950'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              💳 POS Card
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => handlePerformCheckIn(matchedBooking)}
                          className="w-full py-3 bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Collect ৳{matchedBooking.dueAmount.toLocaleString()} & Check In Guest</span>
                        </button>
                      </div>
                    ) : (
                      <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-emerald-300 font-bold">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <span>100% Fully Settled Online. Zero balance due.</span>
                        </div>
                        {matchedBooking.status !== 'checked_in' && (
                          <button
                            onClick={() => handlePerformCheckIn(matchedBooking)}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg"
                          >
                            Mark Checked In
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Today's Arrival Queue */}
            <div className="space-y-4">
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm text-white">Expected Today ({arrivingToday.length})</h3>
                  <span className="text-[10px] text-teal-400">Tap to load</span>
                </div>

                <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                  {arrivingToday.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500">
                      All arrivals for today are checked in!
                    </div>
                  ) : (
                    arrivingToday.map(bk => (
                      <div
                        key={bk.id}
                        onClick={() => handleLookupVoucher(bk.voucherCode)}
                        className="bg-slate-800/80 hover:bg-slate-750 p-3 rounded-xl border border-slate-700 cursor-pointer transition-all space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white">{bk.customerName}</span>
                          <span className="font-mono text-[11px] font-bold text-teal-300 bg-slate-900 px-1.5 py-0.5 rounded">
                            {bk.voucherCode}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">{bk.roomTitle} • {bk.nights}N</div>
                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <span className="text-amber-300 font-bold">Due: ৳{bk.dueAmount.toLocaleString()}</span>
                          <span className="text-teal-400 text-[10px] underline">Select ➔</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: IN-HOUSE GUESTS */}
        {activeSubTab === 'inhouse' && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-4">
            <h3 className="font-bold text-sm text-white">Currently Checked-In Guests ({inHouseGuests.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="pb-3 font-semibold">Voucher</th>
                    <th className="pb-3 font-semibold">Guest</th>
                    <th className="pb-3 font-semibold">Room Category</th>
                    <th className="pb-3 font-semibold">Check-in</th>
                    <th className="pb-3 font-semibold">Check-out</th>
                    <th className="pb-3 font-semibold">Balance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {inHouseGuests.map(b => (
                    <tr key={b.id} className="hover:bg-slate-850/50">
                      <td className="py-3 font-mono font-bold text-teal-300">{b.voucherCode}</td>
                      <td className="py-3">
                        <div className="font-bold text-white">{b.customerName}</div>
                        <div className="text-[11px] text-slate-400">{b.customerPhone}</div>
                      </td>
                      <td className="py-3 text-slate-200">{b.roomTitle}</td>
                      <td className="py-3 text-slate-300">{b.checkInDate}</td>
                      <td className="py-3 text-slate-300">{b.checkOutDate}</td>
                      <td className="py-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Settled 100%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: FRICTIONLESS ROOM INVENTORY (+ / -) */}
        {activeSubTab === 'inventory' && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-6">
            <div>
              <h3 className="font-bold text-base text-white font-serif">Frictionless Real-Time Inventory Control</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Adjust room count with large touch buttons. Changes reflect instantly on the customer marketplace.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hotelRooms.map(room => {
                const isLocked = room.isBlackedOut || room.availableUnits === 0;

                return (
                  <div
                    key={room.id}
                    className={`rounded-2xl border p-5 transition-all ${
                      isLocked
                        ? 'bg-rose-950/20 border-rose-900/40'
                        : 'bg-slate-850 border-slate-750'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-sm text-white">{room.roomTitle}</h4>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Base Rate: <strong className="text-slate-200">৳{room.basePrice.toLocaleString()}</strong> • Total Units: {room.totalRoomsCount}
                        </div>
                      </div>

                      {isLocked ? (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Walk-in Locked
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Active on Wavy
                        </span>
                      )}
                    </div>

                    {/* Touch Control Buttons */}
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                      <div className="text-xs text-slate-300">
                        Available Online:
                        <div className="text-2xl font-black font-mono text-white mt-0.5">
                          {room.availableUnits} <span className="text-xs font-normal text-slate-400">units</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Decrement Button */}
                        <button
                          onClick={() => updateRoomAvailability(room.id, -1)}
                          disabled={room.availableUnits <= 0}
                          className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-lg flex items-center justify-center border border-slate-700 disabled:opacity-40 cursor-pointer"
                          title="Decrease available count"
                        >
                          <Minus className="w-5 h-5" />
                        </button>

                        {/* Increment Button */}
                        <button
                          onClick={() => updateRoomAvailability(room.id, 1)}
                          className="w-11 h-11 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-lg flex items-center justify-center shadow-md shadow-teal-500/20 cursor-pointer"
                          title="Increase available count"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* One-Tap Emergency Walk-in Lock */}
                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Full with offline walk-in guests?</span>

                      {isLocked ? (
                        <button
                          onClick={() => unfreezeRoom(room.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/40 flex items-center gap-1 cursor-pointer"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Reopen Room</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => emergencyFreezeRoom(room.id)}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/40 flex items-center gap-1 cursor-pointer"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>1-Tap Walk-in Lock</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
