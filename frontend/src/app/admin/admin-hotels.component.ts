import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Hotel {
  id: number;
  name: string;
  city: string;
  cityId?: number;
  cityName?: string;
  chain: string;
  rating: number;
  address: string;
  email: string;
  imageUrl?: string;
  description?: string;
  checkIn?: string;
  checkOut?: string;
  hotelChainId?: number;
  hotelChainName?: string;
  isActive?: boolean;
  rooms: Room[];
}

interface Room {
  id: number;
  roomNumber: string;
  price: number;
  capacity: number;
  isExtendable: boolean;
  conditionNote: string;
  imageUrl?: string;
  isActive?: boolean;
  roomTypeId?: number;
  roomAmenityIds?: number[];
  roomTypeName?: string;
  amenities?: string;  // For display
  extendable?: boolean; // For backward compatibility
  condition?: string;   // For backward compatibility
  number?: string;      // For backward compatibility
}

interface City {
  id: number;
  name: string;
  country?: string;
}

interface HotelChain {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  hotelCount?: number;
}

interface RoomType {
  id: number;
  name: string;
  description?: string;
  basePrice: number;
  maxOccupancy: number;
}

interface RoomAmenity {
  id: number;
  name: string;
  description?: string;
}

@Component({
  selector: 'app-admin-hotels',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-hotels.component.html',
})
export class AdminHotelsComponent implements OnInit {
  activeTab: 'hotels' | 'rooms' = 'hotels';
  selectedHotelId: number | null = null;

  showHotelModal = false;
  showRoomModal = false;
  showDeleteConfirm = false;
  deleteTarget: { type: 'hotel' | 'room'; id: number } | null = null;

  editingHotel: Partial<Hotel> = {};
  editingRoom: Partial<Room> = {};

  hotelSearch = '';
  roomSearch = '';

  cities: City[] = [];
  hotelChains: HotelChain[] = [];
  roomTypes: RoomType[] = [];
  roomAmenities: RoomAmenity[] = [];

  hotels: Hotel[] = [
    {
      id: 1, name: 'Marriott St Johns East', city: 'St Johns', chain: 'Marriott',
      rating: 4, address: '200 Coventry Rd, St Johns, NL', email: 'stjohns@marriott.com',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
      description: 'A refined boutique stay with calm interiors, thoughtful details, and a smooth booking experience.',
      checkIn: '15:00',
      checkOut: '11:00',
      rooms: [
        {
          id: 1, roomNumber: '217', price: 300.86, capacity: 4, isExtendable: true,
          conditionNote: 'Good', imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80',
          amenities: 'WiFi, AC, Smart TV, Work Desk'
        },
        {
          id: 2, roomNumber: '218', price: 260.00, capacity: 2, isExtendable: false,
          conditionNote: 'Good',
          amenities: 'WiFi, AC'
        },
      ]
    },
  ];

  nextHotelId = 4;
  nextRoomId = 6;

  constructor() {}

  ngOnInit(): void {
    this.loadCities();
    this.loadHotelChains();
    this.loadRoomTypes();
    this.loadRoomAmenities();
  }

  loadCities(): void {
    this.cities = [
      { id: 1, name: 'St Johns', country: 'Canada' },
      { id: 2, name: 'Ottawa', country: 'Canada' },
      { id: 3, name: 'Montreal', country: 'Canada' },
      { id: 4, name: 'Toronto', country: 'Canada' },
      { id: 5, name: 'Vancouver', country: 'Canada' },
    ];
  }

  loadHotelChains(): void {
    this.hotelChains = [
      { id: 1, name: 'Marriott' },
      { id: 2, name: 'Hilton' },
      { id: 3, name: 'Hyatt' },
      { id: 4, name: 'Westin' },
      { id: 5, name: 'Delta' },
    ];
  }

  loadRoomTypes(): void {
    this.roomTypes = [
      { id: 1, name: 'Standard', basePrice: 150, maxOccupancy: 2 },
      { id: 2, name: 'Deluxe', basePrice: 250, maxOccupancy: 4 },
      { id: 3, name: 'Suite', basePrice: 400, maxOccupancy: 6 },
      { id: 4, name: 'Penthouse', basePrice: 600, maxOccupancy: 8 },
    ];
  }

  loadRoomAmenities(): void {
    this.roomAmenities = [
      { id: 1, name: 'Free WiFi' },
      { id: 2, name: 'Air Conditioning' },
      { id: 3, name: 'Smart TV' },
      { id: 4, name: 'Mini Bar' },
      { id: 5, name: 'Work Desk' },
      { id: 6, name: 'Premium Bedding' },
      { id: 7, name: 'Balcony' },
      { id: 8, name: 'Room Service' },
    ];
  }

  get filteredHotels() {
    const q = this.hotelSearch.toLowerCase();
    return this.hotels.filter(h =>
      h.name.toLowerCase().includes(q) ||
      h.city.toLowerCase().includes(q) ||
      h.chain.toLowerCase().includes(q)
    );
  }

  get selectedHotel(): Hotel | undefined {
    return this.hotels.find(h => h.id === this.selectedHotelId);
  }

  get filteredRooms(): Room[] {
    if (!this.selectedHotel) return [];
    const q = this.roomSearch.toLowerCase();
    return this.selectedHotel.rooms.filter(r =>
      r.roomNumber.includes(q) ||
      (r.amenities && r.amenities.toLowerCase().includes(q))
    );
  }

  get totalRooms() { return this.hotels.reduce((s, h) => s + h.rooms.length, 0); }

  openAddHotel() {
    this.editingHotel = {
      name: '',
      cityId: undefined,
      city: '',
      chain: '',
      rating: 3,
      address: '',
      email: '',
      imageUrl: '',
      description: '',
      checkIn: '15:00',
      checkOut: '11:00',
      hotelChainId: undefined,
      isActive: true
    };
    this.showHotelModal = true;
  }

  openEditHotel(h: Hotel) {
    this.editingHotel = { ...h };
    this.showHotelModal = true;
  }

  saveHotel() {
    if (this.editingHotel.id) {
      const idx = this.hotels.findIndex(h => h.id === this.editingHotel.id);
      if (idx > -1) {
        if (this.editingHotel.cityId) {
          const city = this.cities.find(c => c.id === this.editingHotel.cityId);
          this.editingHotel.city = city ? city.name : '';
        }
        if (this.editingHotel.hotelChainId) {
          const chain = this.hotelChains.find(c => c.id === this.editingHotel.hotelChainId);
          this.editingHotel.chain = chain ? chain.name : '';
        }
        this.hotels[idx] = { ...this.hotels[idx], ...this.editingHotel } as Hotel;
      }
    } else {
      if (this.editingHotel.cityId) {
        const city = this.cities.find(c => c.id === this.editingHotel.cityId);
        this.editingHotel.city = city ? city.name : '';
      }
      if (this.editingHotel.hotelChainId) {
        const chain = this.hotelChains.find(c => c.id === this.editingHotel.hotelChainId);
        this.editingHotel.chain = chain ? chain.name : '';
      }
      this.hotels.push({
        ...this.editingHotel,
        id: this.nextHotelId++,
        rooms: []
      } as Hotel);
    }
    this.showHotelModal = false;
  }

  openAddRoom() {
    this.editingRoom = {
      roomNumber: '',
      price: 0,
      capacity: 2,
      isExtendable: false,
      conditionNote: 'Good',
      imageUrl: '',
      roomTypeId: undefined,
      roomAmenityIds: [],
      isActive: true
    };
    this.showRoomModal = true;
  }

  openEditRoom(r: Room) {
    this.editingRoom = { ...r };
    this.showRoomModal = true;
  }

  saveRoom() {
    const hotel = this.hotels.find(h => h.id === this.selectedHotelId);
    if (!hotel) return;

    if (this.editingRoom.id) {
      const idx = hotel.rooms.findIndex(r => r.id === this.editingRoom.id);
      if (idx > -1) {
        // Get room type name if selected
        if (this.editingRoom.roomTypeId) {
          const type = this.roomTypes.find(t => t.id === this.editingRoom.roomTypeId);
          this.editingRoom.roomTypeName = type ? type.name : '';
        }
        if (this.editingRoom.roomAmenityIds && this.editingRoom.roomAmenityIds.length > 0) {
          const amenityNames = this.roomAmenities
            .filter(a => this.editingRoom.roomAmenityIds?.includes(a.id))
            .map(a => a.name);
          this.editingRoom.amenities = amenityNames.join(', ');
        }
        hotel.rooms[idx] = { ...hotel.rooms[idx], ...this.editingRoom } as Room;
      }
    } else {
      if (this.editingRoom.roomTypeId) {
        const type = this.roomTypes.find(t => t.id === this.editingRoom.roomTypeId);
        this.editingRoom.roomTypeName = type ? type.name : '';
      }
      if (this.editingRoom.roomAmenityIds && this.editingRoom.roomAmenityIds.length > 0) {
        const amenityNames = this.roomAmenities
          .filter(a => this.editingRoom.roomAmenityIds?.includes(a.id))
          .map(a => a.name);
        this.editingRoom.amenities = amenityNames.join(', ');
      }
      hotel.rooms.push({
        ...this.editingRoom,
        id: this.nextRoomId++
      } as Room);
    }
    this.showRoomModal = false;
  }

  confirmDelete(type: 'hotel' | 'room', id: number) {
    this.deleteTarget = { type, id };
    this.showDeleteConfirm = true;
  }

  executeDelete() {
    if (!this.deleteTarget) return;
    if (this.deleteTarget.type === 'hotel') {
      this.hotels = this.hotels.filter(h => h.id !== this.deleteTarget!.id);
      if (this.selectedHotelId === this.deleteTarget.id) this.selectedHotelId = null;
    } else {
      const hotel = this.hotels.find(h => h.id === this.selectedHotelId);
      if (hotel) hotel.rooms = hotel.rooms.filter(r => r.id !== this.deleteTarget!.id);
    }
    this.showDeleteConfirm = false;
    this.deleteTarget = null;
  }

  selectHotel(id: number) {
    this.selectedHotelId = id;
    this.activeTab = 'rooms';
  }

  starsArray(n: number) { return Array(5).fill(0).map((_, i) => i < n); }
}
