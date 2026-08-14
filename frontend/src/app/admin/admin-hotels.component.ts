import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Hotel {
  id: number;
  name: string;
  city: string;
  chain: string;
  rating: number;
  address: string;
  email: string;
  rooms: Room[];
}

interface Room {
  id: number;
  number: string;
  price: number;
  capacity: number;
  extendable: boolean;
  amenities: string;
  condition: string;
}

@Component({
  selector: 'app-admin-hotels',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-hotels.component.html',
})
export class AdminHotelsComponent {
  // ── State ──────────────────────────────────────────────
  activeTab: 'hotels' | 'rooms' = 'hotels';
  selectedHotelId: number | null = null;

  showHotelModal = false;
  showRoomModal   = false;
  showDeleteConfirm = false;
  deleteTarget: { type: 'hotel' | 'room'; id: number } | null = null;

  editingHotel: Partial<Hotel> = {};
  editingRoom:  Partial<Room>  = {};

  hotelSearch = '';
  roomSearch  = '';

  // ── Mock Data ──────────────────────────────────────────
  hotels: Hotel[] = [
    {
      id: 1, name: 'Marriott St Johns East', city: 'St Johns', chain: 'Marriott',
      rating: 4, address: '200 Coventry Rd, St Johns, NL', email: 'stjohns@marriott.com',
      rooms: [
        { id: 1, number: '217', price: 300.86, capacity: 4, extendable: true, amenities: 'WiFi, AC, Smart TV, Work Desk', condition: 'Good' },
        { id: 2, number: '218', price: 260.00, capacity: 2, extendable: false, amenities: 'WiFi, AC', condition: 'Good' },
      ]
    },
    {
      id: 2, name: 'Delta Coventry Suites', city: 'Ottawa', chain: 'Delta',
      rating: 2, address: '200 Coventry Rd, Ottawa, ON K1K 4S3', email: 'delta-1@outlook.ca',
      rooms: [
        { id: 3, number: '122', price: 413.21, capacity: 4, extendable: true, amenities: 'WiFi, AC, Premium Bedding, Smart TV', condition: 'Lamp flickers occasionally' },
      ]
    },
    {
      id: 3, name: 'Westin Montreal Notre-Dame', city: 'Montreal', chain: 'Westin',
      rating: 5, address: '350 Dalhousie St, Montreal, QC', email: 'montreal@westin.com',
      rooms: [
        { id: 4, number: '138', price: 306.98, capacity: 4, extendable: true, amenities: 'WiFi, AC, Smart TV, Mini Bar', condition: 'Excellent' },
        { id: 5, number: '139', price: 280.00, capacity: 2, extendable: false, amenities: 'WiFi, AC', condition: 'Good' },
      ]
    },
  ];

  nextHotelId = 4;
  nextRoomId  = 6;

  // ── Computed ───────────────────────────────────────────
  get filteredHotels() {
    const q = this.hotelSearch.toLowerCase();
    return this.hotels.filter(h =>
      h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q) || h.chain.toLowerCase().includes(q)
    );
  }

  get selectedHotel(): Hotel | undefined {
    return this.hotels.find(h => h.id === this.selectedHotelId);
  }

  get filteredRooms(): Room[] {
    if (!this.selectedHotel) return [];
    const q = this.roomSearch.toLowerCase();
    return this.selectedHotel.rooms.filter(r =>
      r.number.includes(q) || r.amenities.toLowerCase().includes(q)
    );
  }

  get totalRooms() { return this.hotels.reduce((s, h) => s + h.rooms.length, 0); }

  // ── Hotel CRUD ─────────────────────────────────────────
  openAddHotel() {
    this.editingHotel = { name:'', city:'', chain:'', rating:3, address:'', email:'' };
    this.showHotelModal = true;
  }

  openEditHotel(h: Hotel) {
    this.editingHotel = { ...h };
    this.showHotelModal = true;
  }

  saveHotel() {
    if (this.editingHotel.id) {
      const idx = this.hotels.findIndex(h => h.id === this.editingHotel.id);
      if (idx > -1) this.hotels[idx] = { ...this.hotels[idx], ...this.editingHotel } as Hotel;
    } else {
      this.hotels.push({ ...this.editingHotel, id: this.nextHotelId++, rooms: [] } as Hotel);
    }
    this.showHotelModal = false;
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

  // ── Room CRUD ──────────────────────────────────────────
  openAddRoom() {
    this.editingRoom = { number:'', price:0, capacity:2, extendable:false, amenities:'', condition:'Good' };
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
      if (idx > -1) hotel.rooms[idx] = { ...hotel.rooms[idx], ...this.editingRoom } as Room;
    } else {
      hotel.rooms.push({ ...this.editingRoom, id: this.nextRoomId++ } as Room);
    }
    this.showRoomModal = false;
  }

  selectHotel(id: number) {
    this.selectedHotelId = id;
    this.activeTab = 'rooms';
  }

  starsArray(n: number) { return Array(5).fill(0).map((_, i) => i < n); }
}
