import { Hotel, Room, Booking, HotelStaff, HotelPayout, TransportBooking, SmsNotification } from '../types';

export const INITIAL_HOTELS: Hotel[] = [
  {
    id: 'htl-001',
    ownerId: 'own-001',
    name: 'Bay Empress Resort & Suites',
    zone: 'Kolatoli',
    address: 'Plot 14, Block C, Kolatoli Main Road, Cox\'s Bazar',
    landmarkDistance: '80m from Kolatoli Beach Point',
    googleMapsUrl: 'https://maps.google.com/?q=Kolatoli+Coxs+Bazar',
    isVerified: true,
    commissionRate: 12.5,
    checkInTime: '12:00 PM',
    checkOutTime: '11:00 AM',
    coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.8,
    reviewCount: 142,
    inventorySource: 'direct',
    syncStatus: 'active',
    hasGeneratorBackup: true, // 24/7 Heavy Silent Generator
    hasAc: true,
    hasGeyser: true,
    hasWifi: true,
    hasRestaurant: true,
    hasParking: true,
    ownerName: 'Rafiqul Islam Chowdhury',
    ownerPhone: '+8801711223344',
    lastInventoryUpdated: '12 mins ago'
  },
  {
    id: 'htl-002',
    ownerId: 'own-002',
    name: 'Coral Breeze Hotel & Restaurant',
    zone: 'Sugandha',
    address: 'Sugandha Point Access Road, Near Burmese Market, Cox\'s Bazar',
    landmarkDistance: '120m from Sugandha Beach Sunset Point',
    googleMapsUrl: 'https://maps.google.com/?q=Sugandha+Point+Coxs+Bazar',
    isVerified: true,
    commissionRate: 15.0,
    checkInTime: '12:00 PM',
    checkOutTime: '11:00 AM',
    coverImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.6,
    reviewCount: 98,
    inventorySource: 'direct',
    syncStatus: 'active',
    hasGeneratorBackup: true,
    hasAc: true,
    hasGeyser: true,
    hasWifi: true,
    hasRestaurant: true,
    hasParking: false,
    ownerName: 'Kazi Mahbub Alam',
    ownerPhone: '+8801819556677',
    lastInventoryUpdated: '5 mins ago'
  },
  {
    id: 'htl-003',
    ownerId: 'own-003',
    name: 'Marine Crest Eco Beach Haven',
    zone: 'Marine Drive',
    address: 'Marine Drive KM 12, Himchari Overpass, Cox\'s Bazar',
    landmarkDistance: 'Direct Beachfront along scenic Marine Drive',
    googleMapsUrl: 'https://maps.google.com/?q=Marine+Drive+Coxs+Bazar',
    isVerified: true,
    commissionRate: 14.0,
    checkInTime: '1:00 PM',
    checkOutTime: '11:30 AM',
    coverImage: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.9,
    reviewCount: 210,
    inventorySource: 'siteminder',
    syncStatus: 'synced',
    hasGeneratorBackup: true,
    hasAc: true,
    hasGeyser: true,
    hasWifi: true,
    hasRestaurant: true,
    hasParking: true,
    ownerName: 'Tariqul Hasan',
    ownerPhone: '+8801912349988',
    lastInventoryUpdated: 'Just now'
  },
  {
    id: 'htl-004',
    ownerId: 'own-004',
    name: 'Laboni Heritage Grand Inn',
    zone: 'Laboni',
    address: 'Near Old Laboni Beach Market & Police Plaza, Cox\'s Bazar',
    landmarkDistance: '150m from Laboni Beach Open Stage',
    googleMapsUrl: 'https://maps.google.com/?q=Laboni+Beach+Coxs+Bazar',
    isVerified: true,
    commissionRate: 10.0,
    checkInTime: '12:00 PM',
    checkOutTime: '11:00 AM',
    coverImage: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.4,
    reviewCount: 76,
    inventorySource: 'direct',
    syncStatus: 'active',
    hasGeneratorBackup: true,
    hasAc: true,
    hasGeyser: true,
    hasWifi: true,
    hasRestaurant: false,
    hasParking: true,
    ownerName: 'Saiful Islam Babul',
    ownerPhone: '+8801677889900',
    lastInventoryUpdated: '34 mins ago'
  },
  {
    id: 'htl-005',
    ownerId: 'own-005',
    name: 'Inani Pearl Oceanview Retreat',
    zone: 'Inani',
    address: 'Inani Coral Beach Road, Near Shampa Beach, Cox\'s Bazar',
    landmarkDistance: 'Private access to Coral Reef Sandy Beach',
    googleMapsUrl: 'https://maps.google.com/?q=Inani+Beach+Coxs+Bazar',
    isVerified: false, // Verification pending in Super Admin Desk
    commissionRate: 15.0,
    checkInTime: '1:00 PM',
    checkOutTime: '11:00 AM',
    coverImage: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.7,
    reviewCount: 54,
    inventorySource: 'direct',
    syncStatus: 'manual',
    hasGeneratorBackup: true,
    hasAc: true,
    hasGeyser: true,
    hasWifi: true,
    hasRestaurant: true,
    hasParking: true,
    ownerName: 'Zubair Rahman',
    ownerPhone: '+8801552334455',
    lastInventoryUpdated: '1 hour ago'
  }
];

export const INITIAL_ROOMS: Room[] = [
  // Bay Empress Resort (Kolatoli)
  {
    id: 'rm-101',
    hotelId: 'htl-001',
    roomTitle: 'Deluxe AC Sea View Couple',
    bedType: '1 King Size Bed',
    maxGuests: 2,
    basePrice: 3800,
    discountedPrice: 3420,
    totalRoomsCount: 12,
    availableUnits: 5,
    hasAc: true,
    hasGeneratorBackup: true,
    hasGeyser: true,
    hasWifi: true,
    hasSeaView: true,
    hasBalcony: true,
    photos: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'rm-102',
    hotelId: 'htl-001',
    roomTitle: 'Premium Quad Family Suite (AC)',
    bedType: '2 Queen Beds',
    maxGuests: 4,
    basePrice: 5800,
    discountedPrice: 5220,
    totalRoomsCount: 8,
    availableUnits: 3,
    hasAc: true,
    hasGeneratorBackup: true,
    hasGeyser: true,
    hasWifi: true,
    hasSeaView: true,
    hasBalcony: true,
    photos: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'rm-103',
    hotelId: 'htl-001',
    roomTitle: 'Standard Couple AC City View',
    bedType: '1 Queen Bed',
    maxGuests: 2,
    basePrice: 2600,
    totalRoomsCount: 10,
    availableUnits: 6,
    hasAc: true,
    hasGeneratorBackup: true,
    hasGeyser: true,
    hasWifi: true,
    hasSeaView: false,
    hasBalcony: false,
    photos: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'
    ]
  },

  // Coral Breeze (Sugandha)
  {
    id: 'rm-201',
    hotelId: 'htl-002',
    roomTitle: 'Super Deluxe Sunset View Couple Room',
    bedType: '1 King Bed',
    maxGuests: 2,
    basePrice: 3200,
    discountedPrice: 2880,
    totalRoomsCount: 14,
    availableUnits: 4,
    hasAc: true,
    hasGeneratorBackup: true,
    hasGeyser: true,
    hasWifi: true,
    hasSeaView: true,
    hasBalcony: true,
    photos: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'rm-202',
    hotelId: 'htl-002',
    roomTitle: 'Triple Deluxe Family Room AC',
    bedType: '1 Double + 1 Single Bed',
    maxGuests: 3,
    basePrice: 4200,
    totalRoomsCount: 8,
    availableUnits: 2,
    hasAc: true,
    hasGeneratorBackup: true,
    hasGeyser: true,
    hasWifi: true,
    hasSeaView: false,
    hasBalcony: true,
    photos: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80'
    ]
  },

  // Marine Crest Eco (Marine Drive)
  {
    id: 'rm-301',
    hotelId: 'htl-003',
    roomTitle: 'Ocean Breeze Panoramic Villa Room',
    bedType: '1 Super King Bed',
    maxGuests: 2,
    basePrice: 7500,
    discountedPrice: 6750,
    totalRoomsCount: 6,
    availableUnits: 2,
    hasAc: true,
    hasGeneratorBackup: true,
    hasGeyser: true,
    hasWifi: true,
    hasSeaView: true,
    hasBalcony: true,
    photos: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
    ]
  },

  // Laboni Heritage (Laboni)
  {
    id: 'rm-401',
    hotelId: 'htl-004',
    roomTitle: 'Standard AC Double Room',
    bedType: '1 Double Bed',
    maxGuests: 2,
    basePrice: 2200,
    totalRoomsCount: 16,
    availableUnits: 7,
    hasAc: true,
    hasGeneratorBackup: true,
    hasGeyser: true,
    hasWifi: true,
    hasSeaView: false,
    hasBalcony: false,
    photos: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80'
    ]
  },

  // Inani Pearl (Inani)
  {
    id: 'rm-501',
    hotelId: 'htl-005',
    roomTitle: 'Coral View Luxury Suite',
    bedType: '1 King Bed',
    maxGuests: 2,
    basePrice: 6200,
    totalRoomsCount: 10,
    availableUnits: 4,
    hasAc: true,
    hasGeneratorBackup: true,
    hasGeyser: true,
    hasWifi: true,
    hasSeaView: true,
    hasBalcony: true,
    photos: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

export const INITIAL_STAFF: HotelStaff[] = [
  {
    id: 'stf-001',
    hotelId: 'htl-001',
    hotelName: 'Bay Empress Resort & Suites',
    userId: 'usr-stf-01',
    fullName: 'Kamrul Hasan (Front Desk Lead)',
    designation: 'Front Desk Manager',
    staffPin: '1234',
    phone: '+8801822334455'
  },
  {
    id: 'stf-002',
    hotelId: 'htl-002',
    hotelName: 'Coral Breeze Hotel & Restaurant',
    userId: 'usr-stf-02',
    fullName: 'Shuvo Barua (Shift Supervisor)',
    designation: 'Reception Executive',
    staffPin: '5678',
    phone: '+8801933445566'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-1001',
    voucherCode: 'WVY-7821-CXB',
    customerId: 'cust-001',
    customerName: 'Tanvir Ahmed',
    customerPhone: '+8801712998877',
    customerEmail: 'tanvir.traveler@gmail.com',
    hotelId: 'htl-001',
    hotelName: 'Bay Empress Resort & Suites',
    hotelZone: 'Kolatoli',
    roomId: 'rm-101',
    roomTitle: 'Deluxe AC Sea View Couple',
    checkInDate: '2026-08-16', // Today/Tomorrow
    checkOutDate: '2026-08-18',
    nights: 2,
    roomsCount: 1,
    guestCount: 2,
    totalAmount: 6840,
    advancePaid: 2052, // 30% advance
    dueAmount: 4788, // 70% due at check-in
    paymentMode: 'advance_partial',
    status: 'confirmed',
    paymentGateway: 'bKash',
    createdAt: '2026-08-14 18:22:00',
    notes: 'Late check-in requested around 4:00 PM via Green Line bus'
  },
  {
    id: 'bk-1002',
    voucherCode: 'WVY-4491-CXB',
    customerId: 'cust-002',
    customerName: 'Farhana Yeasmin',
    customerPhone: '+8801811443322',
    customerEmail: 'farhana.y@yahoo.com',
    hotelId: 'htl-001',
    hotelName: 'Bay Empress Resort & Suites',
    hotelZone: 'Kolatoli',
    roomId: 'rm-102',
    roomTitle: 'Premium Quad Family Suite (AC)',
    checkInDate: '2026-08-15',
    checkOutDate: '2026-08-17',
    nights: 2,
    roomsCount: 1,
    guestCount: 4,
    totalAmount: 10440,
    advancePaid: 10440, // 100% full
    dueAmount: 0,
    paymentMode: 'full',
    status: 'checked_in',
    paymentGateway: 'SSLCommerz',
    createdAt: '2026-08-12 11:15:00',
    balancePaidAt: '2026-08-12 11:17:00'
  },
  {
    id: 'bk-1003',
    voucherCode: 'WVY-9932-CXB',
    customerId: 'cust-003',
    customerName: 'Dr. Mahmudul Hoque',
    customerPhone: '+8801919887766',
    customerEmail: 'm.hoque@medbangla.org',
    hotelId: 'htl-002',
    hotelName: 'Coral Breeze Hotel & Restaurant',
    hotelZone: 'Sugandha',
    roomId: 'rm-201',
    roomTitle: 'Super Deluxe Sunset View Couple Room',
    checkInDate: '2026-08-16',
    checkOutDate: '2026-08-19',
    nights: 3,
    roomsCount: 1,
    guestCount: 2,
    totalAmount: 8640,
    advancePaid: 2592, // 30% advance
    dueAmount: 6048,
    paymentMode: 'advance_partial',
    status: 'confirmed',
    paymentGateway: 'Nagad',
    createdAt: '2026-08-15 09:30:00'
  },
  {
    id: 'bk-1004',
    voucherCode: 'WVY-3120-CXB',
    customerId: 'cust-004',
    customerName: 'Anisur Rahman',
    customerPhone: '+8801677332211',
    customerEmail: 'anis.dhaka@gmail.com',
    hotelId: 'htl-003',
    hotelName: 'Marine Crest Eco Beach Haven',
    hotelZone: 'Marine Drive',
    roomId: 'rm-301',
    roomTitle: 'Ocean Breeze Panoramic Villa Room',
    checkInDate: '2026-08-10',
    checkOutDate: '2026-08-13',
    nights: 3,
    roomsCount: 1,
    guestCount: 2,
    totalAmount: 20250,
    advancePaid: 20250,
    dueAmount: 0,
    paymentMode: 'full',
    status: 'completed',
    paymentGateway: 'SSLCommerz',
    createdAt: '2026-08-05 14:10:00'
  }
];

export const INITIAL_PAYOUTS: HotelPayout[] = [
  {
    id: 'pay-001',
    hotelId: 'htl-001',
    hotelName: 'Bay Empress Resort & Suites',
    cycleStart: '2026-08-04',
    cycleEnd: '2026-08-10',
    completedBookingsCount: 14,
    grossEarnings: 78400,
    commissionRate: 12.5,
    commissionDeducted: 9800,
    gatewayChargesDeducted: 1960, // 2.5%
    netPayout: 66640,
    payoutStatus: 'settled',
    paymentReference: 'bKash-COMM-891042941',
    payoutChannel: 'bKash_Merchant',
    settledAt: '2026-08-12 14:30:00'
  },
  {
    id: 'pay-002',
    hotelId: 'htl-002',
    hotelName: 'Coral Breeze Hotel & Restaurant',
    cycleStart: '2026-08-04',
    cycleEnd: '2026-08-10',
    completedBookingsCount: 8,
    grossEarnings: 42000,
    commissionRate: 15.0,
    commissionDeducted: 6300,
    gatewayChargesDeducted: 1050,
    netPayout: 34650,
    payoutStatus: 'settled',
    paymentReference: 'CityBank-BEFTN-20260812-771',
    payoutChannel: 'City_Bank_BEFTN',
    settledAt: '2026-08-12 15:10:00'
  },
  {
    id: 'pay-003',
    hotelId: 'htl-001',
    hotelName: 'Bay Empress Resort & Suites',
    cycleStart: '2026-08-11',
    cycleEnd: '2026-08-17',
    completedBookingsCount: 11,
    grossEarnings: 61200,
    commissionRate: 12.5,
    commissionDeducted: 7650,
    gatewayChargesDeducted: 1530,
    netPayout: 52020,
    payoutStatus: 'pending' // Due next Tuesday!
  }
];

export const INITIAL_TRANSPORTS: TransportBooking[] = [
  {
    id: 'tr-001',
    transportType: 'bus',
    providerName: 'Green Line Paribahan (Scania Multi-Axle AC)',
    origin: 'Dhaka (Arambagh / Rajarbagh)',
    destination: 'Cox\'s Bazar (Kolatoli Point)',
    departureTime: '11:00 PM (Overnight)',
    arrivalTime: '07:30 AM (Next Day)',
    seatNumbers: ['B1', 'B2'],
    pricePerSeat: 1800,
    classType: 'Executive Sleeper / Semi-Sleeper',
    ticketStatus: 'confirmed',
    ticketPnr: 'GL-CXB-88391'
  },
  {
    id: 'tr-002',
    transportType: 'air',
    providerName: 'Biman Bangladesh Airlines (Boeing 737-800)',
    origin: 'Dhaka (Hazrat Shahjalal Intl - DAC)',
    destination: 'Cox\'s Bazar (Cox\'s Bazar Airport - CXB)',
    departureTime: '10:45 AM',
    arrivalTime: '11:45 AM (60 Mins Flight)',
    seatNumbers: ['14A', '14B'],
    pricePerSeat: 4500,
    classType: 'Economy Special',
    ticketStatus: 'confirmed',
    ticketPnr: 'BG-433-DAC-CXB'
  },
  {
    id: 'tr-003',
    transportType: 'train',
    providerName: 'Cox\'s Bazar Express (Train 814)',
    origin: 'Dhaka (Kamalapur Railway Station)',
    destination: 'Cox\'s Bazar Iconic Oyster Railway Station',
    departureTime: '10:30 PM (Night Express)',
    arrivalTime: '06:40 AM (Next Morning)',
    seatNumbers: ['CHA-18', 'CHA-19'],
    pricePerSeat: 1350,
    classType: 'Snigdha (AC Chair)',
    ticketStatus: 'confirmed',
    ticketPnr: 'BR-TRN-814-772'
  }
];

export const INITIAL_SMS_LOGS: SmsNotification[] = [
  {
    id: 'sms-001',
    timestamp: '2026-08-15 09:30:15',
    recipientPhone: '+8801919887766',
    recipientRole: 'Customer',
    message: 'Wavy Booking Confirmed! Hotel: Coral Breeze (Sugandha). Voucher: WVY-9932-CXB. Advance Paid: ৳2,592. Due at check-in: ৳6,048.',
    provider: 'Greenweb SMS Gateway',
    type: 'booking_confirm'
  },
  {
    id: 'sms-002',
    timestamp: '2026-08-15 09:30:16',
    recipientPhone: '+8801819556677',
    recipientRole: 'Hotel Owner',
    message: 'New Wavy Booking! Guest: Dr. Mahmudul Hoque, Room: Super Deluxe Sunset View, Check-in: 16 Aug, Nights: 3. Voucher: WVY-9932-CXB.',
    provider: 'Greenweb SMS Gateway',
    type: 'booking_confirm'
  },
  {
    id: 'sms-003',
    timestamp: '2026-08-15 08:00:00',
    recipientPhone: '+8801712998877',
    recipientRole: 'Customer',
    message: 'Friendly Reminder: Your stay at Bay Empress Resort begins tomorrow 12:00 PM. Due Balance: ৳4,788 payable at front desk. Voucher: WVY-7821-CXB.',
    provider: 'Elitbuzz',
    type: 'balance_reminder'
  }
];
