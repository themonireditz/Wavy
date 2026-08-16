import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Hotel, Room, PaymentMode, Booking } from '../../types';
import confetti from 'canvas-confetti';
import {
  X,
  ShieldCheck,
  CreditCard,
  Smartphone,
  CheckCircle2,
  Calendar,
  Users,
  Building,
  Zap,
  Info,
  Lock,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  User
} from 'lucide-react';

interface Props {
  hotel: Hotel;
  room: Room;
  onClose: () => void;
  onSuccess: (voucher: Booking) => void;
}

export const BookingCheckoutModal: React.FC<Props> = ({ hotel, room, onClose, onSuccess }) => {
  const { searchQuery, createBooking } = useApp();

  // Guest details form
  const [customerName, setCustomerName] = useState('Tanvir Ahmed');
  const [customerPhone, setCustomerPhone] = useState('+8801712998877');
  const [customerEmail, setCustomerEmail] = useState('tanvir.traveler@gmail.com');
  const [guestCount, setGuestCount] = useState(room.maxGuests > 2 ? 2 : room.maxGuests);
  const [roomsCount, setRoomsCount] = useState(1);

  // Dates & nights calculation
  const [checkInDate, setCheckInDate] = useState(searchQuery.checkIn);
  const [checkOutDate, setCheckOutDate] = useState(searchQuery.checkOut);

  // Calculate nights
  const calculateNights = () => {
    try {
      const d1 = new Date(checkInDate);
      const d2 = new Date(checkOutDate);
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  };

  const nights = calculateNights();
  const pricePerNight = room.discountedPrice || room.basePrice;
  const totalAmount = pricePerNight * nights * roomsCount;

  // Payment mode selection (Default: 30% advance)
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('advance_partial');
  const [selectedGateway, setSelectedGateway] = useState<'bKash' | 'Nagad' | 'SSLCommerz' | 'Card'>('bKash');

  // Simulation loading state
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'details' | 'gateway_modal'>('details');
  const [bkashPin, setBkashPin] = useState('12345');
  const [bkashOtp, setBkashOtp] = useState('789123');

  // Amounts
  const advanceAmount = paymentMode === 'advance_partial' ? Math.round(totalAmount * 0.30) : totalAmount;
  const dueAmount = totalAmount - advanceAmount;

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerEmail) {
      alert('Please fill out all contact details.');
      return;
    }
    setPaymentStep('gateway_modal');
  };

  const handleConfirmTransaction = () => {
    setIsProcessing(true);

    setTimeout(() => {
      // Create real booking in state
      const newVoucher = createBooking({
        hotelId: hotel.id,
        roomId: room.id,
        customerName,
        customerPhone,
        customerEmail,
        checkInDate,
        checkOutDate,
        nights,
        guestCount,
        roomsCount,
        paymentMode,
        gateway: selectedGateway
      });

      setIsProcessing(false);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Safe fallback
      }

      onSuccess(newVoucher);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-850 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30">
              <Lock className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-serif">Secure Booking & Digital Voucher</h2>
              <p className="text-xs text-slate-400">Cox's Bazar 30% Advance Instant Confirmation System</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Reservation Summary Card */}
          <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {hotel.zone}
                </span>
                <h3 className="font-bold text-sm text-white">{hotel.name}</h3>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-1">{room.roomTitle} • {nights} Night(s)</p>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                <span>In: <strong className="text-white">{checkInDate} (12:00 PM)</strong></span>
                <span>•</span>
                <span>Out: <strong className="text-white">{checkOutDate} (11:00 AM)</strong></span>
              </div>
            </div>

            <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-700">
              <div className="text-[11px] text-slate-400">Total Stay Price:</div>
              <div className="text-xl font-black text-white font-mono">৳{totalAmount.toLocaleString()}</div>
              <div className="text-[10px] text-teal-400 font-medium">Incl. all taxes & service fees</div>
            </div>
          </div>

          {paymentStep === 'details' ? (
            <form onSubmit={handleStartPayment} className="space-y-6">
              {/* Payment Mode Selection (Core Business Rule) */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>1. Choose Payment Option</span>
                  <span className="text-[11px] text-teal-300 lowercase font-normal">Wavy flexible policy</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Option A: 30% Advance (Recommended) */}
                  <div
                    onClick={() => setPaymentMode('advance_partial')}
                    className={`cursor-pointer rounded-2xl p-4 border-2 transition-all relative ${
                      paymentMode === 'advance_partial'
                        ? 'bg-teal-950/40 border-teal-400 shadow-lg shadow-teal-500/10'
                        : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="absolute top-3 right-3">
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-500 text-slate-950 shadow-sm">
                        Most Popular
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-1.5">
                      <input
                        type="radio"
                        checked={paymentMode === 'advance_partial'}
                        onChange={() => setPaymentMode('advance_partial')}
                        className="accent-teal-400 cursor-pointer"
                      />
                      <span className="font-bold text-sm text-white">Pay 30% Advance Online</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      Pay <strong className="text-teal-300 font-mono">৳{Math.round(totalAmount * 0.30).toLocaleString()}</strong> now to guarantee your room.
                    </p>

                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-teal-900/40 text-[11px] space-y-1">
                      <div className="flex justify-between text-teal-200">
                        <span>Pay Online Now:</span>
                        <span className="font-bold font-mono">৳{Math.round(totalAmount * 0.30).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Pay at Hotel Front Desk:</span>
                        <span className="font-bold font-mono text-amber-300">৳{Math.round(totalAmount * 0.70).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Option B: 100% Full Payment */}
                  <div
                    onClick={() => setPaymentMode('full')}
                    className={`cursor-pointer rounded-2xl p-4 border-2 transition-all relative ${
                      paymentMode === 'full'
                        ? 'bg-teal-950/40 border-teal-400 shadow-lg shadow-teal-500/10'
                        : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <input
                        type="radio"
                        checked={paymentMode === 'full'}
                        onChange={() => setPaymentMode('full')}
                        className="accent-teal-400 cursor-pointer"
                      />
                      <span className="font-bold text-sm text-white">Pay 100% Full Payment</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      Settle everything now for an effortless, zero-due instant check-in.
                    </p>

                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-teal-900/40 text-[11px] space-y-1">
                      <div className="flex justify-between text-teal-200">
                        <span>Total Paid Online:</span>
                        <span className="font-bold font-mono">৳{totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-emerald-400">
                        <span>Due at Front Desk:</span>
                        <span className="font-bold font-mono">৳0 (VIP Check-in)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Details */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  2. Primary Guest Information
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                      <User className="w-3 h-3 text-teal-400" /> Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none"
                      placeholder="e.g. Tanvir Ahmed"
                    />
                  </div>

                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-teal-400" /> BD Mobile (SMS Alert)
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none"
                      placeholder="+88017XXXXXXXX"
                    />
                  </div>

                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-teal-400" /> Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Gateway Channel Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  3. Select Payment Gateway
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedGateway('bKash')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      selectedGateway === 'bKash'
                        ? 'bg-pink-950/40 border-pink-500 text-pink-200 ring-2 ring-pink-500/20'
                        : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <div className="font-extrabold text-sm text-pink-400">bKash</div>
                    <span className="text-[10px] text-slate-400">Instant MFS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedGateway('Nagad')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      selectedGateway === 'Nagad'
                        ? 'bg-orange-950/40 border-orange-500 text-orange-200 ring-2 ring-orange-500/20'
                        : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <div className="font-extrabold text-sm text-orange-400">Nagad</div>
                    <span className="text-[10px] text-slate-400">Postal MFS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedGateway('SSLCommerz')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      selectedGateway === 'SSLCommerz'
                        ? 'bg-teal-950/40 border-teal-400 text-teal-200 ring-2 ring-teal-500/20'
                        : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <div className="font-extrabold text-sm text-teal-300">SSLCommerz</div>
                    <span className="text-[10px] text-slate-400">All BD Banks</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedGateway('Card')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      selectedGateway === 'Card'
                        ? 'bg-sky-950/40 border-sky-400 text-sky-200 ring-2 ring-sky-500/20'
                        : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <div className="font-extrabold text-sm text-sky-300">Visa / MC</div>
                    <span className="text-[10px] text-slate-400">Credit / Debit</span>
                  </button>
                </div>
              </div>

              {/* Submit Action */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="btn-proceed-to-payment"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-400 hover:to-sky-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-teal-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>Pay ৳{advanceAmount.toLocaleString()} via {selectedGateway} & Generate Voucher</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-center text-slate-400 mt-2">
                  🔒 256-Bit SSL Encrypted. Instant SMS receipt delivered via Greenweb SMS Gateway.
                </p>
              </div>
            </form>
          ) : (
            /* Gateway Modal Simulation Screen */
            <div className="bg-slate-800/90 rounded-2xl p-6 border border-teal-500/40 space-y-5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
                    ৳
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{selectedGateway} Payment Gateway Simulator</h3>
                    <p className="text-[11px] text-slate-400">Merchant: Wavy Hospitality Bangladesh Ltd.</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Payable Amount:</div>
                  <div className="text-lg font-black text-teal-300 font-mono">৳{advanceAmount.toLocaleString()}</div>
                </div>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700 space-y-3">
                <div className="text-xs text-slate-300">
                  A 6-digit OTP has been dispatched to <strong className="text-teal-300 font-mono">{customerPhone}</strong>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Enter OTP Code</label>
                    <input
                      type="text"
                      value={bkashOtp}
                      onChange={e => setBkashOtp(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white tracking-widest text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Enter Security PIN</label>
                    <input
                      type="password"
                      value={bkashPin}
                      onChange={e => setBkashPin(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white tracking-widest text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentStep('details')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Back to Details
                </button>

                <button
                  type="button"
                  id="btn-confirm-gateway-payment"
                  disabled={isProcessing}
                  onClick={handleConfirmTransaction}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                      <span>Authorizing with Bangladesh Bank Gateway...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Authorize ৳{advanceAmount.toLocaleString()}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
