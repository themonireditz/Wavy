import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Hotel, Room, CoxsBazarZone } from '../../types';
import {
  Search,
  MapPin,
  Star,
  Zap,
  ShieldCheck,
  Wind,
  Wifi,
  Flame,
  Filter,
  Calendar,
  Users,
  ChevronRight,
  Sparkles,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Compass
} from 'lucide-react';
import { HotelDetailModal } from './HotelDetailModal';
import { BookingCheckoutModal } from './BookingCheckoutModal';
import { VoucherModal } from './VoucherModal';

export const MarketplaceView: React.FC = () => {
  const {
    hotels,
    rooms,
    searchQuery,
    setSearchQuery,
    selectedHotel,
    setSelectedHotel,
    selectedRoom,
    setSelectedRoom,
    selectedVoucher,
    setSelectedVoucher
  } = useApp();

  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'rating'>('recommended');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const zones: (CoxsBazarZone | 'All')[] = ['All', 'Kolatoli', 'Sugandha', 'Marine Drive', 'Laboni', 'Inani'];

  // Calculate starting price and available room count for each hotel
  const hotelStats = useMemo(() => {
    const map = new Map<string, { minPrice: number; totalAvailable: number; rooms: Room[] }>();

    hotels.forEach(h => {
      const hotelRooms = rooms.filter(r => r.hotelId === h.id);
      const minPrice = hotelRooms.length > 0
        ? Math.min(...hotelRooms.map(r => r.discountedPrice || r.basePrice))
        : 2500;
      const totalAvailable = hotelRooms.reduce((sum, r) => sum + r.availableUnits, 0);

      map.set(h.id, { minPrice, totalAvailable, rooms: hotelRooms });
    });

    return map;
  }, [hotels, rooms]);

  // Filter and sort hotels
  const filteredHotels = useMemo(() => {
    return hotels
      .filter(hotel => {
        // Zone filter
        if (searchQuery.zone && searchQuery.zone !== 'All' && hotel.zone !== searchQuery.zone) {
          return false;
        }

        // Verified only
        if (searchQuery.verifiedOnly && !hotel.isVerified) {
          return false;
        }

        // Amenities
        if (searchQuery.amenities?.generatorBackup && !hotel.hasGeneratorBackup) {
          return false;
        }
        if (searchQuery.amenities?.ac && !hotel.hasAc) {
          return false;
        }
        if (searchQuery.amenities?.geyser && !hotel.hasGeyser) {
          return false;
        }
        if (searchQuery.amenities?.wifi && !hotel.hasWifi) {
          return false;
        }

        // Price filter
        const stats = hotelStats.get(hotel.id);
        const price = stats?.minPrice || 0;
        if (searchQuery.minPrice && price < searchQuery.minPrice) return false;
        if (searchQuery.maxPrice && price > searchQuery.maxPrice) return false;

        return true;
      })
      .sort((a, b) => {
        const statsA = hotelStats.get(a.id);
        const statsB = hotelStats.get(b.id);
        if (sortBy === 'price_low') {
          return (statsA?.minPrice || 0) - (statsB?.minPrice || 0);
        }
        if (sortBy === 'price_high') {
          return (statsB?.minPrice || 0) - (statsA?.minPrice || 0);
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        return b.reviewCount - a.reviewCount; // Recommended
      });
  }, [hotels, searchQuery, sortBy, hotelStats]);

  const handleOpenHotel = (hotel: Hotel) => {
    setSelectedHotel(hotel);
  };

  const handleSelectZone = (zone: CoxsBazarZone | 'All') => {
    setSearchQuery(prev => ({ ...prev, zone }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Hero Search Section */}
      <section className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          {/* Header Title */}
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              Direct Hotel Deals • 30% Advance Online • 70% at Check-in
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-serif">
              Book Verified Hotels in <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-400">Cox's Bazar</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300">
              No middleman broker hassles. Verified room audits, 24/7 generator load-shedding assurance, and guaranteed instant digital vouchers.
            </p>
          </div>

          {/* Search Box Card */}
          <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-6 border border-slate-700/80 shadow-2xl backdrop-blur-md max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
              {/* Zone Selector */}
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 hover:border-teal-500/50 transition-colors">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" /> Zone / Beach Point
                </label>
                <select
                  value={searchQuery.zone || 'All'}
                  onChange={e => handleSelectZone(e.target.value as any)}
                  className="w-full bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer"
                >
                  <option value="All" className="bg-slate-800 text-white">All Cox's Bazar Zones</option>
                  <option value="Kolatoli" className="bg-slate-800 text-white">Kolatoli (Action & Main Beach)</option>
                  <option value="Sugandha" className="bg-slate-800 text-white">Sugandha (Sunset Point & Food)</option>
                  <option value="Marine Drive" className="bg-slate-800 text-white">Marine Drive (Eco Villas & Nature)</option>
                  <option value="Laboni" className="bg-slate-800 text-white">Laboni (Heritage Beach & Market)</option>
                  <option value="Inani" className="bg-slate-800 text-white">Inani (Coral Reefs & Serenity)</option>
                </select>
              </div>

              {/* Check-in Date */}
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 hover:border-teal-500/50 transition-colors">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-teal-400" /> Check-in Date
                </label>
                <input
                  type="date"
                  value={searchQuery.checkIn}
                  onChange={e => setSearchQuery(prev => ({ ...prev, checkIn: e.target.value }))}
                  className="w-full bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer"
                />
              </div>

              {/* Check-out Date */}
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 hover:border-teal-500/50 transition-colors">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-teal-400" /> Check-out Date
                </label>
                <input
                  type="date"
                  value={searchQuery.checkOut}
                  onChange={e => setSearchQuery(prev => ({ ...prev, checkOut: e.target.value }))}
                  className="w-full bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer"
                />
              </div>

              {/* Guests & Rooms */}
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 hover:border-teal-500/50 transition-colors">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-teal-400" /> Guests & Rooms
                </label>
                <div className="flex items-center justify-between text-sm font-semibold text-white">
                  <span>{searchQuery.guests} Guests, {searchQuery.roomsCount} Room</span>
                  <div className="flex items-center gap-1 text-xs">
                    <button
                      onClick={() => setSearchQuery(prev => ({ ...prev, guests: Math.max(1, prev.guests - 1) }))}
                      className="w-6 h-6 rounded bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-200"
                    >
                      -
                    </button>
                    <button
                      onClick={() => setSearchQuery(prev => ({ ...prev, guests: prev.guests + 1 }))}
                      className="w-6 h-6 rounded bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Amenity Filters Bar */}
            <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-teal-400" /> Quick Filters:
                </span>

                {/* 24/7 Generator Backup - Highlighted for Cox's load shedding */}
                <button
                  onClick={() =>
                    setSearchQuery(prev => ({
                      ...prev,
                      amenities: {
                        ...prev.amenities,
                        generatorBackup: !prev.amenities?.generatorBackup
                      }
                    }))
                  }
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    searchQuery.amenities?.generatorBackup
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                      : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  24/7 Heavy Generator (Load-Shedding Free)
                </button>

                {/* Verified by Local Team */}
                <button
                  onClick={() =>
                    setSearchQuery(prev => ({
                      ...prev,
                      verifiedOnly: !prev.verifiedOnly
                    }))
                  }
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    searchQuery.verifiedOnly
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/50 shadow-sm'
                      : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  Verified Properties
                </button>

                {/* AC */}
                <button
                  onClick={() =>
                    setSearchQuery(prev => ({
                      ...prev,
                      amenities: {
                        ...prev.amenities,
                        ac: !prev.amenities?.ac
                      }
                    }))
                  }
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    searchQuery.amenities?.ac
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
                      : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <Wind className="w-3.5 h-3.5 text-sky-400" />
                  AC Included
                </button>
              </div>

              {/* Price Max Slider Display */}
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span>Max: ৳{searchQuery.maxPrice?.toLocaleString()}</span>
                <input
                  type="range"
                  min="1500"
                  max="10000"
                  step="500"
                  value={searchQuery.maxPrice || 10000}
                  onChange={e => setSearchQuery(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                  className="w-24 accent-teal-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Zone Quick Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pt-5 pb-1 max-w-5xl mx-auto scrollbar-none">
            <span className="text-xs text-slate-400 whitespace-nowrap flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-teal-400" /> Zones:
            </span>
            {zones.map(z => (
              <button
                key={z}
                onClick={() => handleSelectZone(z)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  (searchQuery.zone || 'All') === z
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
                }`}
              >
                {z === 'All' ? 'All Cox\'s Bazar' : z}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Hotel Listings Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Results Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Available Properties
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-teal-300 border border-slate-700">
                {filteredHotels.length} Found
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Showing verified local hotel inventory in {searchQuery.zone || 'Cox\'s Bazar'} for {searchQuery.checkIn} to {searchQuery.checkOut}
            </p>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-500"
            >
              <option value="recommended">Recommended & Verified</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Guest Rating</option>
            </select>
          </div>
        </div>

        {/* Hotel Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {filteredHotels.map(hotel => {
            const stats = hotelStats.get(hotel.id);
            const minPrice = stats?.minPrice || 2500;
            const advance30 = Math.round(minPrice * 0.30);
            const availableUnits = stats?.totalAvailable || 0;

            return (
              <div
                key={hotel.id}
                id={`hotel-card-${hotel.id}`}
                className="bg-slate-900 rounded-2xl border border-slate-800 hover:border-teal-500/40 transition-all duration-200 overflow-hidden group shadow-lg flex flex-col justify-between"
              >
                <div>
                  {/* Image & Badges */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-800">
                    <img
                      src={hotel.coverImage}
                      alt={hotel.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Zone Badge */}
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/80 text-xs font-bold text-white flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-teal-400" />
                      {hotel.zone}
                    </div>

                    {/* Verified by Wavy Badge */}
                    {hotel.isVerified ? (
                      <div className="absolute top-3 right-3 bg-teal-500/90 backdrop-blur-md text-slate-950 px-2.5 py-1 rounded-lg text-[11px] font-extrabold flex items-center gap-1 shadow-md">
                        <ShieldCheck className="w-3.5 h-3.5 fill-slate-950 text-teal-300" />
                        Verified Partner
                      </div>
                    ) : (
                      <div className="absolute top-3 right-3 bg-amber-500/80 backdrop-blur-md text-slate-950 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                        Audit Pending
                      </div>
                    )}

                    {/* Live Inventory Updated timestamp */}
                    <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-slate-300 flex items-center gap-1 border border-slate-800">
                      <Clock className="w-3 h-3 text-teal-400" />
                      Inventory updated {hotel.lastInventoryUpdated}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5">
                    {/* Rating & Distance */}
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <div className="flex items-center gap-1 font-semibold text-amber-300">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{hotel.rating}</span>
                        <span className="text-slate-500 font-normal">({hotel.reviewCount} reviews)</span>
                      </div>
                      <span className="text-teal-300/90 font-medium text-[11px] truncate max-w-[180px]">
                        {hotel.landmarkDistance}
                      </span>
                    </div>

                    {/* Hotel Name */}
                    <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors font-serif line-clamp-1">
                      {hotel.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{hotel.address}</p>

                    {/* Key Amenities */}
                    <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                      {hotel.hasGeneratorBackup && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          <Zap className="w-2.5 h-2.5 text-amber-400 fill-amber-400" /> 24/7 Generator
                        </span>
                      )}
                      {hotel.hasAc && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                          <Wind className="w-2.5 h-2.5 text-sky-400" /> AC
                        </span>
                      )}
                      {hotel.hasGeyser && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                          <Flame className="w-2.5 h-2.5 text-rose-400" /> Geyser
                        </span>
                      )}
                      {hotel.hasWifi && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                          <Wifi className="w-2.5 h-2.5 text-emerald-400" /> Wi-Fi
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer with 30% Advance Highlight */}
                <div className="p-4 sm:p-5 pt-0">
                  <div className="pt-3 border-t border-slate-800/80 flex items-end justify-between gap-2">
                    <div>
                      <div className="text-[11px] text-slate-400">Starting from</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-white font-mono">৳{minPrice.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-500">/night</span>
                      </div>
                      <div className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-300 bg-teal-950/60 px-1.5 py-0.5 rounded mt-0.5 border border-teal-800/40">
                        <span>Pay 30% now:</span>
                        <span className="text-teal-200">৳{advance30.toLocaleString()}</span>
                      </div>
                    </div>

                    <button
                      id={`btn-view-hotel-${hotel.id}`}
                      onClick={() => handleOpenHotel(hotel)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-400 hover:to-sky-500 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
                    >
                      <span>View Rooms</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredHotels.length === 0 && (
          <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800 p-8 my-6">
            <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No properties match your exact filters</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Try adjusting your price range or clearing some amenity filters to see more available hotels in Cox's Bazar.
            </p>
            <button
              onClick={() =>
                setSearchQuery({
                  zone: 'All',
                  checkIn: '2026-08-16',
                  checkOut: '2026-08-18',
                  guests: 2,
                  roomsCount: 1,
                  minPrice: 1000,
                  maxPrice: 10000,
                  amenities: {},
                  verifiedOnly: false
                })
              }
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-bold rounded-lg transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Why Book Wavy Cox's Bazar Feature Banner */}
        <div className="mt-16 bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/40 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
          <div className="max-w-3xl mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white font-serif">Why Cox's Bazar Travelers Choose Wavy</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Built specifically for the unique local dynamics of Cox's Bazar hospitality.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
              </div>
              <h4 className="font-bold text-sm text-white mb-1">Load-Shedding Assurance</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                We physically audit generator wattage. Never endure humid coastal power cuts without AC and Wi-Fi.
              </p>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5 text-teal-300" />
              </div>
              <h4 className="font-bold text-sm text-white mb-1">30% Advance Flexibility</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pay only 30% online via bKash/Nagad/Card. Pay the remaining 70% at the front desk when you arrive.
              </p>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5 text-sky-400" />
              </div>
              <h4 className="font-bold text-sm text-white mb-1">No Overbooking Guarantee</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct Extranet sync. In the rare event of supplier conflict, our local team reassigns you to an equal or better hotel within 500m.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      {selectedHotel && !selectedRoom && (
        <HotelDetailModal
          hotel={selectedHotel}
          onClose={() => setSelectedHotel(null)}
          onSelectRoom={room => setSelectedRoom(room)}
        />
      )}

      {selectedHotel && selectedRoom && (
        <BookingCheckoutModal
          hotel={selectedHotel}
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onSuccess={voucher => {
            setSelectedRoom(null);
            setSelectedHotel(null);
            setSelectedVoucher(voucher);
          }}
        />
      )}

      {selectedVoucher && (
        <VoucherModal
          booking={selectedVoucher}
          onClose={() => setSelectedVoucher(null)}
        />
      )}
    </div>
  );
};
