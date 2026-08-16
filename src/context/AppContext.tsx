import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Hotel,
  Room,
  Booking,
  HotelStaff,
  HotelPayout,
  TransportBooking,
  SmsNotification,
  UserRole,
  PaymentMode,
  SearchQuery,
  CoxsBazarZone
} from '../types';
import {
  INITIAL_HOTELS,
  INITIAL_ROOMS,
  INITIAL_STAFF,
  INITIAL_BOOKINGS,
  INITIAL_PAYOUTS,
  INITIAL_TRANSPORTS,
  INITIAL_SMS_LOGS
} from '../data/mockData';

export type ActiveTab =
  | 'marketplace'
  | 'my_bookings'
  | 'transport'
  | 'extranet_frontdesk'
  | 'extranet_owner'
  | 'admin_console'
  | 'adapter_architecture'
  | 'sql_schema';

interface AppContextType {
  // State
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;

  hotels: Hotel[];
  rooms: Room[];
  bookings: Booking[];
  staffList: HotelStaff[];
  payouts: HotelPayout[];
  transports: TransportBooking[];
  smsLogs: SmsNotification[];

  // Selected entities for modals
  selectedHotel: Hotel | null;
  setSelectedHotel: (hotel: Hotel | null) => void;
  selectedRoom: Room | null;
  setSelectedRoom: (room: Room | null) => void;
  selectedVoucher: Booking | null;
  setSelectedVoucher: (booking: Booking | null) => void;

  // Search State
  searchQuery: SearchQuery;
  setSearchQuery: React.Dispatch<React.SetStateAction<SearchQuery>>;

  // Front desk PIN session
  currentStaff: HotelStaff | null;
  staffPinAuth: (pin: string, hotelId: string) => { success: boolean; staff?: HotelStaff; message?: string };
  logoutStaff: () => void;
  activeHotelForExtranet: Hotel;
  setActiveHotelForExtranet: (hotel: Hotel) => void;

  // Actions
  createBooking: (params: {
    hotelId: string;
    roomId: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    checkInDate: string;
    checkOutDate: string;
    nights: number;
    guestCount: number;
    roomsCount: number;
    paymentMode: PaymentMode;
    gateway: 'bKash' | 'Nagad' | 'SSLCommerz' | 'Card';
  }) => Booking;

  frontDeskCheckIn: (voucherCode: string, collectedAmount: number, paymentMethod: 'FrontDeskCash' | 'bKash' | 'Card') => { success: boolean; message: string; booking?: Booking };

  updateRoomAvailability: (roomId: string, changeDelta: number) => void;
  emergencyFreezeRoom: (roomId: string) => void;
  unfreezeRoom: (roomId: string) => void;

  updateRoomPrice: (roomId: string, newBasePrice: number, newDiscountedPrice?: number) => void;
  toggleHotelVerification: (hotelId: string) => void;
  updateHotelCommission: (hotelId: string, newRate: number) => void;

  reassignOverbookedGuest: (bookingId: string, targetHotelId: string, targetRoomId: string) => boolean;
  settlePayout: (payoutId: string, reference: string, channel: 'bKash_Merchant' | 'City_Bank_BEFTN' | 'Islami_Bank_NPSB') => void;
  generateWeeklyPayouts: () => void;

  addSmsLog: (notification: Omit<SmsNotification, 'id' | 'timestamp'>) => void;
  updateStaffPin: (staffId: string, newPin: string) => void;
  bookTransport: (transportId: string, guestName: string, guestPhone: string, seats: string[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or default
  const [activeTab, setActiveTab] = useState<ActiveTab>('marketplace');
  const [activeRole, setActiveRole] = useState<UserRole>('customer');

  const [hotels, setHotels] = useState<Hotel[]>(() => {
    const saved = localStorage.getItem('wavy_hotels');
    return saved ? JSON.parse(saved) : INITIAL_HOTELS;
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('wavy_rooms');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('wavy_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [staffList, setStaffList] = useState<HotelStaff[]>(() => {
    const saved = localStorage.getItem('wavy_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [payouts, setPayouts] = useState<HotelPayout[]>(() => {
    const saved = localStorage.getItem('wavy_payouts');
    return saved ? JSON.parse(saved) : INITIAL_PAYOUTS;
  });

  const [transports, setTransports] = useState<TransportBooking[]>(INITIAL_TRANSPORTS);
  const [smsLogs, setSmsLogs] = useState<SmsNotification[]>(INITIAL_SMS_LOGS);

  // Selected states
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<Booking | null>(null);

  const [activeHotelForExtranet, setActiveHotelForExtranet] = useState<Hotel>(INITIAL_HOTELS[0]);
  const [currentStaff, setCurrentStaff] = useState<HotelStaff | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    zone: 'All',
    checkIn: '2026-08-16',
    checkOut: '2026-08-18',
    guests: 2,
    roomsCount: 1,
    minPrice: 1000,
    maxPrice: 10000,
    amenities: {
      generatorBackup: false,
      ac: false,
      geyser: false,
      wifi: false
    },
    verifiedOnly: false
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('wavy_hotels', JSON.stringify(hotels));
  }, [hotels]);

  useEffect(() => {
    localStorage.setItem('wavy_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('wavy_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('wavy_staff', JSON.stringify(staffList));
  }, [staffList]);

  useEffect(() => {
    localStorage.setItem('wavy_payouts', JSON.stringify(payouts));
  }, [payouts]);

  // Helper for SMS logging
  const addSmsLog = (item: Omit<SmsNotification, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timeStr = now.toISOString().replace('T', ' ').substring(0, 19);
    const newLog: SmsNotification = {
      ...item,
      id: 'sms-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      timestamp: timeStr
    };
    setSmsLogs(prev => [newLog, ...prev]);
  };

  // Staff PIN verification
  const staffPinAuth = (pin: string, hotelId: string) => {
    const matched = staffList.find(s => s.hotelId === hotelId && s.staffPin === pin.trim());
    if (matched) {
      setCurrentStaff(matched);
      return { success: true, staff: matched };
    }
    return { success: false, message: 'Invalid Staff PIN. Please try again or contact your Hotel Owner.' };
  };

  const logoutStaff = () => {
    setCurrentStaff(null);
  };

  // Create booking (Customer flow)
  const createBooking = (params: {
    hotelId: string;
    roomId: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    checkInDate: string;
    checkOutDate: string;
    nights: number;
    guestCount: number;
    roomsCount: number;
    paymentMode: PaymentMode;
    gateway: 'bKash' | 'Nagad' | 'SSLCommerz' | 'Card';
  }): Booking => {
    const hotel = hotels.find(h => h.id === params.hotelId) || hotels[0];
    const room = rooms.find(r => r.id === params.roomId) || rooms[0];

    const pricePerNight = room.discountedPrice || room.basePrice;
    const totalAmount = pricePerNight * params.nights * params.roomsCount;

    let advancePaid = totalAmount;
    let dueAmount = 0;

    if (params.paymentMode === 'advance_partial') {
      // 30% advance
      advancePaid = Math.round(totalAmount * 0.30);
      dueAmount = totalAmount - advancePaid; // 70% remaining
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const voucherCode = `WVY-${randomSuffix}-CXB`;

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newBooking: Booking = {
      id: 'bk-' + Date.now(),
      voucherCode,
      customerId: 'cust-' + Date.now(),
      customerName: params.customerName,
      customerPhone: params.customerPhone,
      customerEmail: params.customerEmail,
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelZone: hotel.zone,
      roomId: room.id,
      roomTitle: room.roomTitle,
      checkInDate: params.checkInDate,
      checkOutDate: params.checkOutDate,
      nights: params.nights,
      roomsCount: params.roomsCount,
      guestCount: params.guestCount,
      totalAmount,
      advancePaid,
      dueAmount,
      paymentMode: params.paymentMode,
      status: 'confirmed',
      paymentGateway: params.gateway,
      createdAt: nowStr,
      notes: params.paymentMode === 'advance_partial' ? '30% Advance Paid Online. Remaining 70% due at hotel check-in.' : '100% Full Payment Paid Online.'
    };

    // Decrement availability
    setRooms(prevRooms =>
      prevRooms.map(r => {
        if (r.id === room.id) {
          const nextCount = Math.max(0, r.availableUnits - params.roomsCount);
          return { ...r, availableUnits: nextCount };
        }
        return r;
      })
    );

    // Save booking
    setBookings(prev => [newBooking, ...prev]);

    // Send SMS to Customer
    addSmsLog({
      recipientPhone: params.customerPhone,
      recipientRole: 'Customer',
      message: `Wavy: Booking Confirmed at ${hotel.name}! Voucher: ${voucherCode}. Total: ৳${totalAmount.toLocaleString()}, Paid: ৳${advancePaid.toLocaleString()}, Due: ৳${dueAmount.toLocaleString()} at check-in. Show voucher at reception.`,
      provider: 'Greenweb SMS Gateway',
      type: 'booking_confirm'
    });

    // Send SMS to Hotel Owner / Front Desk
    addSmsLog({
      recipientPhone: hotel.ownerPhone,
      recipientRole: 'Hotel Owner',
      message: `[Wavy Partner Alert] New Booking! Guest: ${params.customerName} (${params.customerPhone}), Room: ${room.roomTitle}, Check-in: ${params.checkInDate} (${params.nights}N). Voucher: ${voucherCode}. Advance collected by Wavy.`,
      provider: 'Greenweb SMS Gateway',
      type: 'booking_confirm'
    });

    // Also send email alert simulation
    addSmsLog({
      recipientPhone: params.customerEmail,
      recipientRole: 'Customer',
      message: `[Email: Resend] Reservation Confirmed for ${hotel.name}. Digital Voucher Code: ${voucherCode}. PDF receipt attached.`,
      provider: 'Resend Email API',
      type: 'booking_confirm'
    });

    return newBooking;
  };

  // Front Desk Check-In & Balance Collector
  const frontDeskCheckIn = (
    voucherCode: string,
    collectedAmount: number,
    paymentMethod: 'FrontDeskCash' | 'bKash' | 'Card'
  ) => {
    const bookingIndex = bookings.findIndex(
      b => b.voucherCode.toUpperCase().trim() === voucherCode.toUpperCase().trim()
    );

    if (bookingIndex === -1) {
      return { success: false, message: `Voucher "${voucherCode}" not found in system.` };
    }

    const booking = bookings[bookingIndex];

    if (booking.status === 'checked_in') {
      return { success: false, message: `Guest "${booking.customerName}" has ALREADY checked in with voucher ${voucherCode}.` };
    }

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const updatedBooking: Booking = {
      ...booking,
      status: 'checked_in',
      advancePaid: booking.advancePaid + collectedAmount,
      dueAmount: Math.max(0, booking.dueAmount - collectedAmount),
      balancePaidAt: nowStr,
      notes: `${booking.notes || ''} | 70% Balance (৳${collectedAmount}) collected at Front Desk via ${paymentMethod} on ${nowStr}.`
    };

    setBookings(prev => {
      const copy = [...prev];
      copy[bookingIndex] = updatedBooking;
      return copy;
    });

    // Notify guest
    addSmsLog({
      recipientPhone: booking.customerPhone,
      recipientRole: 'Customer',
      message: `Welcome to ${booking.hotelName}! Check-in completed. Balance settled: ৳${collectedAmount}. Have a wonderful stay in Cox's Bazar!`,
      provider: 'Greenweb SMS Gateway',
      type: 'checkin_alert'
    });

    return {
      success: true,
      message: `Successfully checked in ${booking.customerName}. Collected ৳${collectedAmount.toLocaleString()}.`,
      booking: updatedBooking
    };
  };

  // Frictionless Inventory Updates (+ / -)
  const updateRoomAvailability = (roomId: string, changeDelta: number) => {
    setRooms(prev =>
      prev.map(r => {
        if (r.id === roomId) {
          const nextVal = Math.max(0, r.availableUnits + changeDelta);
          return {
            ...r,
            availableUnits: nextVal,
            isBlackedOut: nextVal === 0
          };
        }
        return r;
      })
    );

    // Update hotel's last updated timestamp
    setHotels(prev =>
      prev.map(h => {
        const hasRoom = rooms.some(r => r.id === roomId && r.hotelId === h.id);
        if (hasRoom) {
          return { ...h, lastInventoryUpdated: 'Just now' };
        }
        return h;
      })
    );
  };

  // Emergency Walk-in Lock
  const emergencyFreezeRoom = (roomId: string) => {
    setRooms(prev =>
      prev.map(r => {
        if (r.id === roomId) {
          return {
            ...r,
            availableUnits: 0,
            isBlackedOut: true
          };
        }
        return r;
      })
    );

    const room = rooms.find(r => r.id === roomId);
    if (room) {
      addSmsLog({
        recipientPhone: '+8801800000000',
        recipientRole: 'Front Desk',
        message: `EMERGENCY LOCK ACTIVATED: Room "${room.roomTitle}" blacked out instantly due to Walk-in fullness. OTA marketplace inventory is set to 0.`,
        provider: 'Greenweb SMS Gateway',
        type: 'inventory_lock'
      });
    }
  };

  const unfreezeRoom = (roomId: string) => {
    setRooms(prev =>
      prev.map(r => {
        if (r.id === roomId) {
          return {
            ...r,
            availableUnits: r.totalRoomsCount > 0 ? 3 : 1,
            isBlackedOut: false
          };
        }
        return r;
      })
    );
  };

  // Room pricing update
  const updateRoomPrice = (roomId: string, newBasePrice: number, newDiscountedPrice?: number) => {
    setRooms(prev =>
      prev.map(r => {
        if (r.id === roomId) {
          return {
            ...r,
            basePrice: newBasePrice,
            discountedPrice: newDiscountedPrice && newDiscountedPrice > 0 ? newDiscountedPrice : undefined
          };
        }
        return r;
      })
    );
  };

  // Super Admin: Toggle verification
  const toggleHotelVerification = (hotelId: string) => {
    setHotels(prev =>
      prev.map(h => {
        if (h.id === hotelId) {
          const nextState = !h.isVerified;
          return { ...h, isVerified: nextState };
        }
        return h;
      })
    );
  };

  // Super Admin: Update commission
  const updateHotelCommission = (hotelId: string, newRate: number) => {
    setHotels(prev =>
      prev.map(h => {
        if (h.id === hotelId) {
          return { ...h, commissionRate: newRate };
        }
        return h;
      })
    );
  };

  // Super Admin: Reassign overbooked guest to nearby partner hotel
  const reassignOverbookedGuest = (bookingId: string, targetHotelId: string, targetRoomId: string) => {
    const targetHotel = hotels.find(h => h.id === targetHotelId);
    const targetRoom = rooms.find(r => r.id === targetRoomId);
    const booking = bookings.find(b => b.id === bookingId);

    if (!targetHotel || !targetRoom || !booking) return false;

    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          return {
            ...b,
            hotelId: targetHotel.id,
            hotelName: targetHotel.name,
            hotelZone: targetHotel.zone,
            roomId: targetRoom.id,
            roomTitle: targetRoom.roomTitle,
            notes: `${b.notes || ''} | Reassigned by Super Admin Ops to ${targetHotel.name} (${targetHotel.landmarkDistance}) due to overbooking conflict.`
          };
        }
        return b;
      })
    );

    addSmsLog({
      recipientPhone: booking.customerPhone,
      recipientRole: 'Customer',
      message: `[Wavy Concierge Priority Update] Your booking voucher ${booking.voucherCode} has been upgraded/relocated to ${targetHotel.name} (${targetHotel.zone}) with zero extra cost. Our local Cox's Bazar support team is escorting you.`,
      provider: 'Greenweb SMS Gateway',
      type: 'booking_confirm'
    });

    return true;
  };

  // Super Admin / Owner: Settle Payout
  const settlePayout = (
    payoutId: string,
    reference: string,
    channel: 'bKash_Merchant' | 'City_Bank_BEFTN' | 'Islami_Bank_NPSB'
  ) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setPayouts(prev =>
      prev.map(p => {
        if (p.id === payoutId) {
          return {
            ...p,
            payoutStatus: 'settled',
            paymentReference: reference,
            payoutChannel: channel,
            settledAt: nowStr
          };
        }
        return p;
      })
    );

    const payout = payouts.find(p => p.id === payoutId);
    if (payout) {
      const hotel = hotels.find(h => h.id === payout.hotelId);
      if (hotel) {
        addSmsLog({
          recipientPhone: hotel.ownerPhone,
          recipientRole: 'Hotel Owner',
          message: `[Wavy Settlement Payout Disbursed] ৳${payout.netPayout.toLocaleString()} has been transferred via ${channel}. Ref: ${reference}. Thank you for partnering with Wavy!`,
          provider: 'Greenweb SMS Gateway',
          type: 'payout_alert'
        });
      }
    }
  };

  // Weekly Payout Generation (Every Monday calculation)
  const generateWeeklyPayouts = () => {
    const newPayouts: HotelPayout[] = hotels.map(hotel => {
      const hotelBookings = bookings.filter(b => b.hotelId === hotel.id && b.status !== 'cancelled');
      const gross = hotelBookings.reduce((sum, b) => sum + b.totalAmount, 0) || 45000;
      const commRate = hotel.commissionRate;
      const commissionDeducted = Math.round(gross * (commRate / 100));
      const gatewayFee = Math.round(gross * 0.025); // 2.5% gateway fee
      const netPayout = gross - commissionDeducted - gatewayFee;

      return {
        id: 'pay-new-' + Date.now() + '-' + hotel.id,
        hotelId: hotel.id,
        hotelName: hotel.name,
        cycleStart: '2026-08-11',
        cycleEnd: '2026-08-17',
        completedBookingsCount: hotelBookings.length || 6,
        grossEarnings: gross,
        commissionRate: commRate,
        commissionDeducted,
        gatewayChargesDeducted: gatewayFee,
        netPayout,
        payoutStatus: 'pending'
      };
    });

    setPayouts(prev => [...newPayouts, ...prev]);
  };

  // Update staff PIN
  const updateStaffPin = (staffId: string, newPin: string) => {
    setStaffList(prev =>
      prev.map(s => {
        if (s.id === staffId) {
          return { ...s, staffPin: newPin };
        }
        return s;
      })
    );
  };

  // Book Transport ticket
  const bookTransport = (transportId: string, guestName: string, guestPhone: string, seats: string[]) => {
    const tr = transports.find(t => t.id === transportId);
    if (!tr) return;

    addSmsLog({
      recipientPhone: guestPhone,
      recipientRole: 'Customer',
      message: `[Wavy Transit Ticket] Confirmed on ${tr.providerName}! Route: ${tr.origin} -> ${tr.destination}. Departure: ${tr.departureTime}. Seats: ${seats.join(', ')}. PNR: ${tr.ticketPnr}.`,
      provider: 'Greenweb SMS Gateway',
      type: 'booking_confirm'
    });
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeRole,
        setActiveRole,
        hotels,
        rooms,
        bookings,
        staffList,
        payouts,
        transports,
        smsLogs,
        selectedHotel,
        setSelectedHotel,
        selectedRoom,
        setSelectedRoom,
        selectedVoucher,
        setSelectedVoucher,
        searchQuery,
        setSearchQuery,
        currentStaff,
        staffPinAuth,
        logoutStaff,
        activeHotelForExtranet,
        setActiveHotelForExtranet,
        createBooking,
        frontDeskCheckIn,
        updateRoomAvailability,
        emergencyFreezeRoom,
        unfreezeRoom,
        updateRoomPrice,
        toggleHotelVerification,
        updateHotelCommission,
        reassignOverbookedGuest,
        settlePayout,
        generateWeeklyPayouts,
        addSmsLog,
        updateStaffPin,
        bookTransport
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
