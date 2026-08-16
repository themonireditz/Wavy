export type UserRole = 'super_admin' | 'hotel_owner' | 'hotel_staff' | 'customer';

export type BookingStatus = 'pending_advance' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled' | 'disputed';

export type PaymentMode = 'full' | 'advance_partial';

export type TransactionType = 'advance_payment' | 'balance_settlement' | 'refund' | 'payout';

export type TransportType = 'bus' | 'air' | 'train' | 'rental';

export type InventorySource = 'direct' | 'siteminder' | 'staah' | 'agoda_api';

export type CoxsBazarZone = 'Kolatoli' | 'Sugandha' | 'Marine Drive' | 'Laboni' | 'Inani';

export interface Profile {
  id: string;
  fullName: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface Hotel {
  id: string;
  ownerId: string;
  name: string;
  zone: CoxsBazarZone;
  address: string;
  landmarkDistance: string; // e.g. '120m from Kolatoli Beach Point'
  googleMapsUrl?: string;
  isVerified: boolean;
  commissionRate: number; // e.g. 15.00 (%)
  checkInTime: string; // '12:00 PM'
  checkOutTime: string; // '11:00 AM'
  coverImage: string;
  galleryImages: string[];
  rating: number;
  reviewCount: number;
  inventorySource: InventorySource;
  externalHotelId?: string;
  syncStatus: 'active' | 'synced' | 'manual';
  hasGeneratorBackup: boolean; // highlighted assurance for load shedding
  hasAc: boolean;
  hasGeyser: boolean;
  hasWifi: boolean;
  hasRestaurant: boolean;
  hasParking: boolean;
  ownerName: string;
  ownerPhone: string;
  lastInventoryUpdated: string;
}

export interface Room {
  id: string;
  hotelId: string;
  roomTitle: string; // e.g. 'Deluxe AC Sea View Couple'
  bedType: string; // '1 King Bed' | '2 Queen Beds' | '1 Double + 1 Single'
  maxGuests: number;
  basePrice: number; // in BDT ৳
  discountedPrice?: number;
  totalRoomsCount: number;
  availableUnits: number;
  hasAc: boolean;
  hasGeneratorBackup: boolean;
  hasGeyser: boolean;
  hasWifi: boolean;
  hasSeaView: boolean;
  hasBalcony: boolean;
  photos: string[];
  externalRoomId?: string;
  isBlackedOut?: boolean;
}

export interface Booking {
  id: string;
  voucherCode: string; // e.g. 'WVY-9482-CXB'
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  hotelId: string;
  hotelName: string;
  hotelZone: CoxsBazarZone;
  roomId: string;
  roomTitle: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  nights: number;
  roomsCount: number;
  guestCount: number;
  totalAmount: number; // in BDT ৳
  advancePaid: number; // 30% or 100%
  dueAmount: number; // 70% or 0
  paymentMode: PaymentMode;
  status: BookingStatus;
  paymentGateway: 'bKash' | 'Nagad' | 'SSLCommerz' | 'Card' | 'FrontDeskCash';
  externalBookingId?: string;
  createdAt: string;
  balancePaidAt?: string;
  notes?: string;
}

export interface HotelStaff {
  id: string;
  hotelId: string;
  hotelName: string;
  userId: string;
  fullName: string;
  designation: string;
  staffPin: string; // 4-6 digit PIN for quick check-in kiosk
  phone: string;
}

export interface Transaction {
  id: string;
  bookingId: string;
  voucherCode: string;
  gatewayTxnId: string;
  paymentChannel: 'bKash' | 'Nagad' | 'Rocket' | 'Upay' | 'SSLCommerz_Card' | 'FrontDesk_Cash';
  amount: number;
  transactionType: TransactionType;
  createdAt: string;
  status: 'success' | 'refunded' | 'pending';
}

export interface HotelPayout {
  id: string;
  hotelId: string;
  hotelName: string;
  cycleStart: string;
  cycleEnd: string;
  completedBookingsCount: number;
  grossEarnings: number;
  commissionRate: number;
  commissionDeducted: number;
  gatewayChargesDeducted: number;
  netPayout: number;
  payoutStatus: 'pending' | 'settled' | 'processing';
  paymentReference?: string;
  payoutChannel?: 'bKash_Merchant' | 'City_Bank_BEFTN' | 'Islami_Bank_NPSB';
  settledAt?: string;
}

export interface TransportBooking {
  id: string;
  bookingId?: string;
  transportType: TransportType;
  providerName: string; // e.g. 'Green Line Paribahan (Scania Multi-Axle)', 'Biman Bangladesh Airlines', 'Cox\'s Bazar Express (Train)'
  origin: string; // e.g. 'Dhaka (Arambagh / Sayedabad)'
  destination: string; // 'Cox\'s Bazar (Kolatoli)'
  departureTime: string;
  arrivalTime: string;
  seatNumbers: string[];
  pricePerSeat: number;
  classType: string; // 'Business Class', 'Economy', 'Snigdha AC'
  ticketStatus: 'confirmed' | 'reserved';
  ticketPnr: string;
}

export interface SmsNotification {
  id: string;
  timestamp: string;
  recipientPhone: string;
  recipientRole: 'Customer' | 'Hotel Owner' | 'Front Desk' | 'Admin';
  message: string;
  provider: 'Greenweb SMS Gateway' | 'Elitbuzz' | 'Resend Email API';
  type: 'booking_confirm' | 'balance_reminder' | 'checkin_alert' | 'payout_alert' | 'inventory_lock';
}

export interface UnifiedProperty {
  id: string;
  source: InventorySource;
  name: string;
  zone: CoxsBazarZone;
  address: string;
  coverImage: string;
  startingPrice: number;
  isVerified: boolean;
  commissionRate: number;
  amenities: {
    hasAc: boolean;
    hasGenerator: boolean;
    hasWifi: boolean;
    hasGeyser: boolean;
  };
  rooms: UnifiedRoom[];
}

export interface UnifiedRoom {
  id: string;
  externalRoomId?: string;
  title: string;
  bedType: string;
  maxGuests: number;
  pricePerNight: number;
  availableCount: number;
}

export interface SearchQuery {
  zone?: CoxsBazarZone | 'All';
  checkIn: string;
  checkOut: string;
  guests: number;
  roomsCount: number;
  minPrice?: number;
  maxPrice?: number;
  amenities?: {
    generatorBackup?: boolean;
    ac?: boolean;
    geyser?: boolean;
    wifi?: boolean;
  };
  verifiedOnly?: boolean;
}
