import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotelService, Hotel } from '../services/hotel.service';
import { RoomService, Room } from '../services/room.service';
import { HotelChainService, HotelChain } from '../services/hotel-chain.service';
import { CityService, City } from '../services/city.service';
import { RoomTypeService, RoomType } from '../services/room-type.service';
import { RoomAmenityService, RoomAmenity } from '../services/room-amenity.service';

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

  hotels: Hotel[] = [];
  hotelChains: HotelChain[] = [];
  cities: City[] = [];
  roomTypes: RoomType[] = [];
  roomAmenities: RoomAmenity[] = [];

  isLoading = false;
  errorMessage = '';

  cityMap: Map<number, City> = new Map();
  chainMap: Map<number, HotelChain> = new Map();

  constructor(
    private hotelService: HotelService,
    private roomService: RoomService,
    private hotelChainService: HotelChainService,
    private cityService: CityService,
    private roomTypeService: RoomTypeService,
    private roomAmenityService: RoomAmenityService
  ) {}

  ngOnInit(): void {
    this.loadHotels();
    this.loadHotelChains();
    this.loadCities();
    this.loadRoomTypes();
    this.loadRoomAmenities();
  }

  loadHotels(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.hotelService.getAllHotels().subscribe({
      next: (data) => {
        this.hotels = data || [];

        this.hotels.forEach(hotel => {
          if (hotel.hotelChain && typeof hotel.hotelChain === 'object') {
            const chainObj = hotel.hotelChain as any;
            hotel.chain = chainObj.name || hotel.chain || 'Unknown Chain';
            hotel.hotelChainId = chainObj.id || hotel.hotelChainId;
          }

          else if (hotel.hotelChainName) {
            hotel.chain = hotel.hotelChainName;
          }

          if (hotel.city && typeof hotel.city === 'object') {
            const cityObj = hotel.city as any;
            hotel.city = cityObj.name || 'Unknown City';
            hotel.cityId = cityObj.id || hotel.cityId;
          }
          else if (hotel.cityName) {
            hotel.city = hotel.cityName;
          }
        });

        this.hotels.forEach(hotel => {
          if (hotel.id) {
            this.loadRoomsForHotel(hotel.id);
          }
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading hotels:', err);
        this.errorMessage = 'Failed to load hotels. Please check if backend is running.';
        this.isLoading = false;
      }
    });
  }

  loadRoomsForHotel(hotelId: number): void {
    this.roomService.getRoomsByHotel(hotelId).subscribe({
      next: (rooms) => {
        const hotel = this.hotels.find(h => h.id === hotelId);
        if (hotel) {
          hotel.rooms = rooms || [];
        }
      },
      error: (err) => console.error(`Error loading rooms for hotel ${hotelId}:`, err)
    });
  }

  loadHotelChains(): void {
    this.hotelChainService.getAllHotelChains().subscribe({
      next: (data) => {
        this.hotelChains = data || [];
        this.chainMap = new Map(this.hotelChains.map(chain => [chain.id!, chain]));

        this.hotels.forEach(hotel => {
          if (hotel.hotelChainId && this.chainMap.has(hotel.hotelChainId)) {
            hotel.chain = this.chainMap.get(hotel.hotelChainId)?.name || hotel.chain || 'Unknown Chain';
          }
        });
      },
      error: (err) => {
        console.error('Error loading hotel chains:', err);
        this.hotelChains = [
          { id: 1, name: 'Marriott' },
          { id: 2, name: 'Hilton' },
          { id: 3, name: 'Hyatt' },
          { id: 4, name: 'Four Seasons' },
          { id: 5, name: 'Ritz-Carlton' },
        ];
        this.chainMap = new Map(this.hotelChains.map(chain => [chain.id!, chain]));
      }
    });
  }

  loadCities(): void {
    this.cityService.getAllCities().subscribe({
      next: (data) => {
        this.cities = data || [];
        this.cityMap = new Map(this.cities.map(city => [city.id!, city]));

        this.hotels.forEach(hotel => {
          if (hotel.cityId && this.cityMap.has(hotel.cityId)) {
            hotel.city = this.cityMap.get(hotel.cityId)?.name || hotel.city || 'Unknown City';
          }
        });
      },
      error: (err) => {
        console.error('Error loading cities:', err);
        this.cities = [
          { id: 1, name: 'St Johns', country: 'Canada' },
          { id: 2, name: 'Ottawa', country: 'Canada' },
          { id: 3, name: 'Montreal', country: 'Canada' },
          { id: 4, name: 'Toronto', country: 'Canada' },
          { id: 5, name: 'Vancouver', country: 'Canada' },
        ];
        this.cityMap = new Map(this.cities.map(city => [city.id!, city]));
      }
    });
  }

  loadRoomTypes(): void {
    this.roomTypeService.getAllRoomTypes().subscribe({
      next: (data) => {
        this.roomTypes = data || [];
      },
      error: (err) => {
        console.error('Error loading room types:', err);
        this.roomTypes = [
          { id: 1, name: 'Standard', basePrice: 150, maxOccupancy: 2 },
          { id: 2, name: 'Deluxe', basePrice: 250, maxOccupancy: 4 },
          { id: 3, name: 'Suite', basePrice: 400, maxOccupancy: 6 },
          { id: 4, name: 'Penthouse', basePrice: 600, maxOccupancy: 8 },
        ];
      }
    });
  }

  loadRoomAmenities(): void {
    this.roomAmenityService.getAllRoomAmenities().subscribe({
      next: (data) => {
        this.roomAmenities = data || [];
      },
      error: (err) => {
        console.error('Error loading room amenities:', err);
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
    });
  }

  getRoomAmenities(room: Room): string {
    if (room.amenities && typeof room.amenities === 'string') {
      return room.amenities;
    }

    if (room.roomAmenities && Array.isArray(room.roomAmenities)) {
      const names = room.roomAmenities
        .map((a: any) => typeof a === 'string' ? a : (a.name || a.amenityName || ''))
        .filter((name: string) => name);

      return names.join(', ');
    }

    if (typeof room.roomAmenities === 'string') {
      return room.roomAmenities;
    }

    if (room.roomAmenityIds && Array.isArray(room.roomAmenityIds)) {
      if (this.roomAmenities && this.roomAmenities.length > 0) {
        const names = room.roomAmenityIds
          .map(id => {
            const amenity = this.roomAmenities.find(a => a.id === id);
            return amenity ? amenity.name : '';
          })
          .filter((name: string) => name);

        return names.join(', ');
      }
    }

    return '';
  }

  isGoodCondition(note: string): boolean {
    if (!note) return true;
    const goodPhrases = ['good', 'excellent', 'renovated', 'renovation', 'new', 'perfect', 'great', 'clean', 'updated', 'recently', 'well-maintained'];
    const lower = note.toLowerCase();
    return goodPhrases.some(phrase => lower.includes(phrase));
  }

  getRoomTypeName(room: Room): string {
    if (room.roomTypeName) return room.roomTypeName;
    if (room.roomType && typeof room.roomType === 'object') {
      const typeObj = room.roomType as any;
      return typeObj.name || '';
    }
    return '';
  }

  getCityName(hotel: Hotel): string {
    if (typeof hotel.city === 'string') return hotel.city;
    if (hotel.city && typeof hotel.city === 'object') {
      const cityObj = hotel.city as any;
      return cityObj.name || 'Unknown City';
    }
    if (hotel.cityId && this.cityMap.has(hotel.cityId)) {
      return this.cityMap.get(hotel.cityId)?.name || 'Unknown City';
    }
    return 'Unknown City';
  }

  getChainName(hotel: Hotel): string {
    if (typeof hotel.chain === 'string') return hotel.chain;
    if (hotel.chain && typeof hotel.chain === 'object') {
      const chainObj = hotel.chain as any;
      return chainObj.name || 'Unknown Chain';
    }
    if (hotel.hotelChainId && this.chainMap.has(hotel.hotelChainId)) {
      return this.chainMap.get(hotel.hotelChainId)?.name || 'Unknown Chain';
    }
    return 'Unknown Chain';
  }

  get filteredHotels() {
    const q = this.hotelSearch.toLowerCase();
    return this.hotels.filter(h =>
      (h.name || '').toLowerCase().includes(q) ||
      this.getCityName(h).toLowerCase().includes(q) ||
      this.getChainName(h).toLowerCase().includes(q)
    );
  }

  get selectedHotel(): Hotel | undefined {
    return this.hotels.find(h => h.id === this.selectedHotelId);
  }

  get filteredRooms(): Room[] {
    if (!this.selectedHotel) return [];
    const q = this.roomSearch.toLowerCase();
    const rooms = this.selectedHotel.rooms || [];
    return rooms.filter(r =>
      (r.roomNumber || '').toLowerCase().includes(q) ||
      (r.conditionNote || '').toLowerCase().includes(q)
    );
  }

  get totalRooms() {
    return this.hotels.reduce((sum, h) => sum + (h.rooms?.length || 0), 0);
  }

  openAddHotel() {
    this.errorMessage = '';
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
    this.errorMessage = '';
    const hotelCopy = { ...h };
    if (hotelCopy.city && typeof hotelCopy.city === 'object') {
      const cityObj = hotelCopy.city as any;
      if (cityObj.id) hotelCopy.cityId = cityObj.id;
      hotelCopy.city = cityObj.name || '';
    }
    if (hotelCopy.chain && typeof hotelCopy.chain === 'object') {
      const chainObj = hotelCopy.chain as any;
      if (chainObj.id) hotelCopy.hotelChainId = chainObj.id;
      hotelCopy.chain = chainObj.name || '';
    }
    this.editingHotel = hotelCopy;
    this.showHotelModal = true;
  }

  saveHotel() {
    this.isLoading = true;
    this.errorMessage = '';

    const hotelData: any = { ...this.editingHotel };

    if (hotelData.cityId) {
      hotelData.city = { id: Number(hotelData.cityId) };
    }
    if (hotelData.hotelChainId) {
      hotelData.hotelChain = { id: Number(hotelData.hotelChainId) };
      delete hotelData.chain;
    }

    delete hotelData.cityId;
    delete hotelData.rooms;

    if (this.editingHotel.id) {
      this.hotelService.updateHotel(this.editingHotel.id, hotelData as Hotel).subscribe({
        next: () => {
          this.loadHotels();
          this.showHotelModal = false;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error updating hotel:', err);
          this.errorMessage = err.error?.message || `Failed to update hotel (${err.status}). Please try again.`;
          this.isLoading = false;
        }
      });
    } else {
      this.hotelService.createHotel(hotelData as Hotel).subscribe({
        next: () => {
          this.loadHotels();
          this.showHotelModal = false;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error creating hotel:', err);
          this.errorMessage = err.error?.message || `Failed to create hotel (${err.status}). Please try again.`;
          this.isLoading = false;
        }
      });
    }
  }

  openAddRoom() {
    this.errorMessage = '';
    this.editingRoom = {
      roomNumber: '',
      price: undefined,
      capacity: 2,
      isExtendable: false,
      conditionNote: 'Good',
      hotelId: this.selectedHotelId ?? undefined,
      roomTypeId: undefined,
      roomAmenityIds: [],
      imageUrl: '',
      isActive: true
    };
    this.showRoomModal = true;
  }

  openEditRoom(r: Room) {
    this.errorMessage = '';
    this.editingRoom = {
      ...r,
      roomTypeId: r.roomTypeId ?? (r.roomType as any)?.id,
    };
    this.showRoomModal = true;
  }

  saveRoom() {
    this.errorMessage = '';

    if (!this.editingRoom.roomNumber?.trim()) {
      this.errorMessage = 'Room number is required.';
      return;
    }
    if (!this.editingRoom.price || this.editingRoom.price <= 0) {
      this.errorMessage = 'Price must be greater than 0.';
      return;
    }
    if (!this.selectedHotelId) {
      this.errorMessage = 'Select a hotel before adding a room.';
      return;
    }

    this.isLoading = true;

    const roomData: any = { ...this.editingRoom };

    roomData.hotelId = Number(this.selectedHotelId);
    if (roomData.roomTypeId) {
      roomData.roomType = { id: Number(roomData.roomTypeId) };
    }
    if (roomData.roomAmenityIds?.length) {
      roomData.roomAmenities = roomData.roomAmenityIds.map((id: number | string) => ({
        id: Number(id)
      }));
    }

    delete roomData.roomTypeId;
    delete roomData.roomAmenityIds;
    delete roomData.number;
    delete roomData.extendable;
    delete roomData.amenities;
    delete roomData.roomTypeName;

    if (this.editingRoom.id) {
      this.roomService.updateRoom(this.editingRoom.id, roomData as Room).subscribe({
        next: () => {
          this.loadHotels();
          this.showRoomModal = false;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error updating room:', err);
          this.errorMessage = err.error?.message || `Failed to update room (${err.status}). Please try again.`;
          this.isLoading = false;
        }
      });
    } else {
      this.roomService.createRoom(roomData as Room).subscribe({
        next: () => {
          this.loadHotels();
          this.showRoomModal = false;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error creating room:', err);
          if (err.status === 403) {
            this.errorMessage = 'Access denied (403). Log out, log back in as admin, then try again.';
          } else {
            this.errorMessage = err.error?.message || `Failed to create room (${err.status}). Please try again.`;
          }
          this.isLoading = false;
        }
      });
    }
  }

  confirmDelete(type: 'hotel' | 'room', id: number) {
    this.deleteTarget = { type, id };
    this.showDeleteConfirm = true;
  }

  executeDelete() {
    if (!this.deleteTarget) return;
    this.isLoading = true;

    if (this.deleteTarget.type === 'hotel') {
      this.hotelService.deleteHotel(this.deleteTarget.id).subscribe({
        next: () => {
          this.loadHotels();
          this.showDeleteConfirm = false;
          this.deleteTarget = null;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error deleting hotel:', err);
          this.errorMessage = err.error?.message || `Failed to delete hotel (${err.status}). Please try again.`;
          this.isLoading = false;
        }
      });
    } else {
      this.roomService.deleteRoom(this.deleteTarget.id).subscribe({
        next: () => {
          this.loadHotels();
          this.showDeleteConfirm = false;
          this.deleteTarget = null;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error deleting room:', err);
          this.errorMessage = err.error?.message || `Failed to delete room (${err.status}). Please try again.`;
          this.isLoading = false;
        }
      });
    }
  }

  selectHotel(id: number) {
    this.selectedHotelId = id;
    this.activeTab = 'rooms';
    this.loadRoomsForHotel(id);
  }

  starsArray(n: number) {
    return Array(5).fill(0).map((_, i) => i < n);
  }
}
