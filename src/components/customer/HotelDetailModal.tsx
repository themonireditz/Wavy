import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Hotel, Room } from '../../types';
import {
  X,
  MapPin,
  Star,
  Zap,
  ShieldCheck,
  Wind,
  Wifi,
  Flame,
  Users,
  Bed,
  Eye,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Info,
  Building,
  AlertTriangle
} from 'lucide-react';

interface Props {
  hotel: Hotel;
  onClose: () => void;
  onSelectRoom: (room: Room) => void;
}

export const HotelDetailModal: React.FC<Props> = ({ hotel, onClose, onSelectRoom }) => {
  const { rooms, searchQuery } = useApp();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const hotelRooms = rooms.filter(r => r.hotelId === hotel.id);
  const allPhotos = hotel.galleryImages && hotel.galleryImages.length > 0 ? hotel.galleryImages : [hotel.coverImage];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-850 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white font-serif">{hotel.name}</h2>
                {hotel.isVerified && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                    <ShieldCheck className="w-3 h-3" /> Verified Wavy Partner
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                {hotel.address} • <span className="text-teal-300">{hotel.landmarkDistance}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Photo Gallery & Hero */}
          <div>
            <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-800 border border-slate-700/60 shadow-inner">
              <img
                src={allPhotos[selectedPhotoIndex] || hotel.coverImage}
                alt={hotel.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700 text-xs font-bold text-teal-300 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{hotel.rating} rating</span>
                <span className="text-slate-400 font-normal">({hotel.reviewCount} verified guest reviews)</span>
              </div>
            </div>

            {/* Thumbnail selector */}
            {allPhotos.length > 1 && (
              <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                {allPhotos.map((photo, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                      selectedPhotoIndex === idx ? 'border-teal-400 ring-2 ring-teal-400/30' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={photo} alt="thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Assurance Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">24/7 Generator Assured</div>
                <div className="text-[11px] text-slate-400">Continuous AC & lights during load shedding</div>
              </div>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-teal-300" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Standard Check-in: {hotel.checkInTime}</div>
                <div className="text-[11px] text-slate-400">Check-out: {hotel.checkOutTime}</div>
              </div>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-sky-300" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Verified Extranet Sync</div>
                <div className="text-[11px] text-slate-400">Direct inventory updated {hotel.lastInventoryUpdated}</div>
              </div>
            </div>
          </div>

          {/* Cancellation & Payment Policy Notice */}
          <div className="bg-teal-950/40 border border-teal-800/40 rounded-2xl p-4 text-xs text-teal-200">
            <div className="flex items-center gap-2 font-bold text-white mb-1.5">
              <Info className="w-4 h-4 text-teal-400" />
              <span>Wavy 30% Advance & Cancellation Rules:</span>
            </div>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              <li>
                <strong className="text-white">Pay 30% advance</strong> online to lock your booking. Remaining <strong className="text-teal-300">70% payable at front desk</strong> upon check-in.
              </li>
              <li>
                <strong>≥ 7 Days before Check-in:</strong> 100% full refund of amount paid (minus 2.5% gateway fee).
              </li>
              <li>
                <strong>3 to 6 Days before Check-in:</strong> 50% refund.
              </li>
              <li>
                <strong>&lt; 72 Hours:</strong> Non-refundable (secures room from walk-in travelers).
              </li>
            </ul>
          </div>

          {/* Available Room Types */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white font-serif">Available Room Types</h3>
                <p className="text-xs text-slate-400">Select your preferred room to proceed with 30% advance or 100% full payment.</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {hotelRooms.length} Room Categories
              </span>
            </div>

            <div className="space-y-4">
              {hotelRooms.map(room => {
                const isAvailable = room.availableUnits > 0 && !room.isBlackedOut;
                const price = room.discountedPrice || room.basePrice;
                const advance30 = Math.round(price * 0.30);

                return (
                  <div
                    key={room.id}
                    id={`room-option-${room.id}`}
                    className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                      isAvailable
                        ? 'bg-slate-850/90 border-slate-750 hover:border-teal-500/50 shadow-md'
                        : 'bg-slate-900/50 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left Room Info */}
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-base text-white">{room.roomTitle}</h4>

                          {isAvailable ? (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              room.availableUnits <= 2
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            }`}>
                              {room.availableUnits} {room.availableUnits === 1 ? 'room' : 'rooms'} left
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-400" /> Walk-in Locked / Sold Out
                            </span>
                          )}
                        </div>

                        {/* Room Specs */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1 text-slate-300">
                            <Bed className="w-3.5 h-3.5 text-teal-400" /> {room.bedType}
                          </span>
                          <span className="flex items-center gap-1 text-slate-300">
                            <Users className="w-3.5 h-3.5 text-teal-400" /> Max {room.maxGuests} Guests
                          </span>
                          {room.hasSeaView && (
                            <span className="flex items-center gap-1 text-teal-300 font-medium">
                              <Eye className="w-3.5 h-3.5" /> Sea View Balcony
                            </span>
                          )}
                        </div>

                        {/* Feature Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {room.hasAc && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              AC
                            </span>
                          )}
                          {room.hasGeneratorBackup && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                              24/7 Power Backup
                            </span>
                          )}
                          {room.hasGeyser && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              Hot Water Geyser
                            </span>
                          )}
                          {room.hasWifi && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              High-Speed Wi-Fi
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right Pricing & Action */}
                      <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800 flex sm:flex-col items-center sm:items-end justify-between gap-3">
                        <div>
                          <div className="flex items-baseline gap-1.5 sm:justify-end">
                            {room.discountedPrice && (
                              <span className="text-xs text-slate-500 line-through">৳{room.basePrice.toLocaleString()}</span>
                            )}
                            <span className="text-xl font-black text-white font-mono">৳{price.toLocaleString()}</span>
                            <span className="text-xs text-slate-400">/night</span>
                          </div>
                          <div className="text-[11px] text-teal-300 font-medium mt-0.5">
                            30% Advance: <span className="font-bold text-white">৳{advance30.toLocaleString()}</span>
                          </div>
                        </div>

                        <button
                          id={`btn-select-room-${room.id}`}
                          disabled={!isAvailable}
                          onClick={() => onSelectRoom(room)}
                          className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 transition-all ${
                            isAvailable
                              ? 'bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-400 hover:to-sky-500 text-slate-950 shadow-teal-500/20 cursor-pointer'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <span>{isAvailable ? 'Book This Room' : 'Unavailable'}</span>
                          {isAvailable && <ChevronRight className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-850 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 flex-shrink-0">
          <span>Need custom group or corporate booking?</span>
          <a href="tel:+8801700000000" className="text-teal-300 font-semibold hover:underline">
            Call Cox's Bazar Desk: +880 1700-000000
          </a>
        </div>
      </div>
    </div>
  );
};
