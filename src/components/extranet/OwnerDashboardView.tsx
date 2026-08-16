import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Hotel, Room, HotelStaff, HotelPayout } from '../../types';
import {
  Building2,
  DollarSign,
  TrendingUp,
  CreditCard,
  Key,
  Edit,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
  Percent,
  Calendar,
  Users,
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';

export const OwnerDashboardView: React.FC = () => {
  const {
    hotels,
    rooms,
    bookings,
    payouts,
    staffList,
    updateRoomPrice,
    updateStaffPin,
    activeHotelForExtranet,
    setActiveHotelForExtranet
  } = useApp();

  const selectedHotel = activeHotelForExtranet;
  const hotelRooms = rooms.filter(r => r.hotelId === selectedHotel.id);
  const hotelBookings = bookings.filter(b => b.hotelId === selectedHotel.id);
  const hotelPayouts = payouts.filter(p => p.hotelId === selectedHotel.id);
  const hotelStaff = staffList.filter(s => s.hotelId === selectedHotel.id);

  // Financial calculations
  const totalGross = hotelBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const commissionDeducted = Math.round(totalGross * (selectedHotel.commissionRate / 100));
  const gatewayCharges = Math.round(totalGross * 0.025); // 2.5%
  const netEarnings = totalGross - commissionDeducted - gatewayCharges;

  // State for editing room prices
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [newBasePrice, setNewBasePrice] = useState<number>(0);
  const [newDiscountPrice, setNewDiscountPrice] = useState<number>(0);

  // State for editing staff PIN
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [newPin, setNewPin] = useState<string>('');

  const handleStartEditRoom = (room: Room) => {
    setEditingRoomId(room.id);
    setNewBasePrice(room.basePrice);
    setNewDiscountPrice(room.discountedPrice || 0);
  };

  const handleSaveRoomPrice = (roomId: string) => {
    updateRoomPrice(roomId, newBasePrice, newDiscountPrice > 0 ? newDiscountPrice : undefined);
    setEditingRoomId(null);
  };

  const handleSaveStaffPin = (staffId: string) => {
    if (newPin.length >= 4) {
      updateStaffPin(staffId, newPin);
      setEditingStaffId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header & Property Switcher */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white font-serif">{selectedHotel.name}</h1>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Owner Hub
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Zone: <strong className="text-slate-200">{selectedHotel.zone}</strong> • Commission Rate: <strong className="text-teal-300">{selectedHotel.commissionRate}%</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Switch Hotel:</span>
            <select
              value={selectedHotel.id}
              onChange={e => {
                const h = hotels.find(item => item.id === e.target.value);
                if (h) setActiveHotelForExtranet(h);
              }}
              className="bg-slate-800 text-xs font-semibold text-teal-300 border border-slate-700 rounded-xl px-3 py-2 focus:outline-none"
            >
              {hotels.map(h => (
                <option key={h.id} value={h.id} className="bg-slate-800 text-white">
                  {h.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Room Bookings</div>
            <div className="text-2xl font-black text-white font-mono mt-1">৳{totalGross.toLocaleString()}</div>
            <div className="text-[11px] text-slate-400 mt-1">{hotelBookings.length} Total Bookings Received</div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Wavy Commission ({selectedHotel.commissionRate}%)</div>
            <div className="text-2xl font-black text-rose-400 font-mono mt-1">-৳{commissionDeducted.toLocaleString()}</div>
            <div className="text-[11px] text-slate-400 mt-1">Direct marketing & OTA listing fee</div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gateway Processing (2.5%)</div>
            <div className="text-2xl font-black text-amber-400 font-mono mt-1">-৳{gatewayCharges.toLocaleString()}</div>
            <div className="text-[11px] text-slate-400 mt-1">bKash / Nagad / SSLCommerz</div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-teal-950/60 p-5 rounded-2xl border border-teal-500/40 shadow-lg">
            <div className="text-xs font-extrabold text-teal-300 uppercase tracking-wider">Net Payout to Hotel</div>
            <div className="text-2xl font-black text-white font-mono mt-1">৳{netEarnings.toLocaleString()}</div>
            <div className="text-[11px] text-teal-200 mt-1">Disbursed Every Tuesday</div>
          </div>
        </div>

        {/* Weekly Settlement Ledger & Formula Display */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>Weekly Settlement Ledger & Invoices</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Payouts are calculated every Monday and disbursed every Tuesday for stays completed in the previous Monday–Sunday cycle.
              </p>
            </div>

            <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-300 font-mono">
              Net = Gross - ({selectedHotel.commissionRate}% Commission) - (2.5% Gateway)
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="pb-3 font-semibold">Settlement Cycle</th>
                  <th className="pb-3 font-semibold">Completed Stays</th>
                  <th className="pb-3 font-semibold">Gross Earned</th>
                  <th className="pb-3 font-semibold">Commission ({selectedHotel.commissionRate}%)</th>
                  <th className="pb-3 font-semibold">Gateway (2.5%)</th>
                  <th className="pb-3 font-semibold">Net Payout</th>
                  <th className="pb-3 font-semibold">Status & Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {hotelPayouts.map(p => (
                  <tr key={p.id} className="hover:bg-slate-850/50">
                    <td className="py-3.5 font-medium text-slate-200">
                      {p.cycleStart} to {p.cycleEnd}
                    </td>
                    <td className="py-3.5 text-slate-300">{p.completedBookingsCount} Stays</td>
                    <td className="py-3.5 font-mono text-slate-200">৳{p.grossEarnings.toLocaleString()}</td>
                    <td className="py-3.5 font-mono text-rose-400">-৳{p.commissionDeducted.toLocaleString()}</td>
                    <td className="py-3.5 font-mono text-amber-400">-৳{p.gatewayChargesDeducted.toLocaleString()}</td>
                    <td className="py-3.5 font-mono font-bold text-emerald-400 text-sm">৳{p.netPayout.toLocaleString()}</td>
                    <td className="py-3.5">
                      {p.payoutStatus === 'settled' ? (
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Disbursed
                          </span>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate max-w-[140px]">
                            {p.paymentReference}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Pending Tuesday Cycle
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Room Price Controls & Staff PIN Assignment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Room Pricing Modifier */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-white font-serif flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-teal-400" />
              <span>Room Category Pricing Controls</span>
            </h3>
            <p className="text-xs text-slate-400">
              Update base rates and special seasonal discounted offers for the marketplace.
            </p>

            <div className="space-y-3">
              {hotelRooms.map(room => {
                const isEditing = editingRoomId === room.id;

                return (
                  <div key={room.id} className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-white">{room.roomTitle}</h4>
                      {!isEditing ? (
                        <button
                          onClick={() => handleStartEditRoom(room)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" /> Edit Price
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSaveRoomPrice(room.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1"
                        >
                          <Save className="w-3 h-3" /> Save
                        </button>
                      )}
                    </div>

                    {!isEditing ? (
                      <div className="flex items-center gap-4 text-xs">
                        <div>
                          <span className="text-slate-400">Base Price:</span>
                          <span className="font-mono font-bold text-white ml-1">৳{room.basePrice.toLocaleString()}</span>
                        </div>
                        {room.discountedPrice && (
                          <div>
                            <span className="text-slate-400">Offer Price:</span>
                            <span className="font-mono font-bold text-teal-300 ml-1">৳{room.discountedPrice.toLocaleString()}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-slate-400">Total Units:</span>
                          <span className="font-mono text-slate-300 ml-1">{room.totalRoomsCount}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Base Price (৳)</label>
                          <input
                            type="number"
                            value={newBasePrice}
                            onChange={e => setNewBasePrice(Number(e.target.value))}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Discount Offer (৳, Optional)</label>
                          <input
                            type="number"
                            value={newDiscountPrice}
                            onChange={e => setNewDiscountPrice(Number(e.target.value))}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Staff PIN Management */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-white font-serif flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-400" />
              <span>Front Desk Staff PIN Authorization</span>
            </h3>
            <p className="text-xs text-slate-400">
              Assign 4-digit security PINs to reception staff for shift-based kiosk check-in access.
            </p>

            <div className="space-y-3">
              {hotelStaff.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500 bg-slate-850 rounded-xl p-4">
                  No staff members created yet. Default PIN: <strong className="text-emerald-400">1234</strong>
                </div>
              ) : (
                hotelStaff.map(staff => {
                  const isEditing = editingStaffId === staff.id;

                  return (
                    <div key={staff.id} className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-sm text-white">{staff.fullName}</div>
                          <div className="text-xs text-slate-400">{staff.designation} • {staff.phone}</div>
                        </div>

                        {!isEditing ? (
                          <button
                            onClick={() => {
                              setEditingStaffId(staff.id);
                              setNewPin(staff.staffPin);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold flex items-center gap-1"
                          >
                            <Key className="w-3 h-3" /> Change PIN
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSaveStaffPin(staff.id)}
                            className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
                          >
                            Save PIN
                          </button>
                        )}
                      </div>

                      {!isEditing ? (
                        <div className="text-xs text-slate-300 flex items-center gap-2">
                          <span>Active Authorization PIN:</span>
                          <span className="font-mono font-bold text-emerald-400 tracking-widest bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                            {staff.staffPin}
                          </span>
                        </div>
                      ) : (
                        <div className="pt-2">
                          <label className="block text-[11px] text-slate-400 mb-1">Enter New 4-Digit PIN</label>
                          <input
                            type="password"
                            maxLength={6}
                            value={newPin}
                            onChange={e => setNewPin(e.target.value)}
                            className="w-36 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono text-center tracking-widest"
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
