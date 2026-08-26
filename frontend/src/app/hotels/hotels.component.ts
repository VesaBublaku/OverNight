import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HotelService, Hotel } from '../services/hotel.service';

interface DisplayHotel extends Hotel {
  isActive: boolean;
  hotelAmenities: any[];
}

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, Footer, RouterModule],
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
export class HotelsComponent implements OnInit {
  hotels: DisplayHotel[] = [];
  filteredHotels: DisplayHotel[] = [];
  searchQuery: string = '';
  selectedCity: string = '';
  selectedChainId: number | null = null;
  selectedChainName: string = '';
  cities: string[] = [];
  chains: string[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private hotelService: HotelService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('HotelsComponent initialized!');

    this.route.queryParams.subscribe(params => {
      const chainId = params['chain'];
      if (chainId) {
        this.selectedChainId = parseInt(chainId);
        console.log('Filtering by chain ID:', this.selectedChainId);
      }
      this.loadHotels();
    });
  }

  loadHotels(): void {
    console.log('Loading hotels...');
    this.isLoading = true;
    this.errorMessage = '';

    this.hotelService.getActiveHotels().subscribe({
      next: (data) => {
        console.log('Hotels loaded:', data);

        this.hotels = (data || []).map(hotel => ({
          ...hotel,
          isActive: hotel.isActive === true,
          name: hotel.name || 'Unnamed Hotel',
          cityName: hotel.cityName || hotel.city || 'Unknown City',
          rating: hotel.rating || 0,
          chain: hotel.chain || '',
          address: hotel.address || '',
          imageUrl: hotel.imageUrl || '',
          description: hotel.description || '',
          checkIn: hotel.checkIn || '15:00',
          checkOut: hotel.checkOut || '11:00',
          hotelAmenities: hotel.hotelAmenities || []
        }));

        if (this.selectedChainId) {
          this.filteredHotels = this.hotels.filter(hotel =>
            hotel.hotelChainId === this.selectedChainId
          );
          if (this.filteredHotels.length > 0) {
            this.selectedChainName = this.filteredHotels[0].chain || 'Chain';
          }
        } else {
          this.filteredHotels = this.hotels;
        }

        this.extractCities();
        this.extractChains();
        this.isLoading = false;
        this.cdr.detectChanges();

      },
      error: (err) => {
        console.error('Error loading hotels:', err);
        this.errorMessage = 'Failed to load hotels. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  extractCities(): void {
    const citySet = new Set<string>();
    this.hotels.forEach(hotel => {
      if (hotel.cityName) {
        citySet.add(hotel.cityName);
      } else if (hotel.city) {
        citySet.add(hotel.city);
      }
    });
    this.cities = Array.from(citySet).sort();
    console.log('📊 Cities extracted:', this.cities);
  }

  extractChains(): void {
    const chainSet = new Set<string>();
    this.hotels.forEach(hotel => {
      if (hotel.chain) {
        chainSet.add(hotel.chain);
      }
    });
    this.chains = Array.from(chainSet).sort();
    console.log('📊 Chains extracted:', this.chains);
  }

  searchHotels(): void {
    if (!this.searchQuery.trim() && !this.selectedCity && !this.selectedChainId) {
      this.filteredHotels = this.hotels;
      return;
    }

    this.filteredHotels = this.hotels.filter(hotel => {
      let matches = true;

      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        matches = matches && !!(
          hotel.name?.toLowerCase().includes(query) ||
          hotel.cityName?.toLowerCase().includes(query) ||
          hotel.city?.toLowerCase().includes(query) ||
          hotel.address?.toLowerCase().includes(query) ||
          hotel.chain?.toLowerCase().includes(query)
        );
      }

      if (this.selectedCity) {
        matches = matches && !!(
          hotel.cityName === this.selectedCity ||
          hotel.city === this.selectedCity
        );
      }

      if (this.selectedChainId) {
        matches = matches && (hotel.hotelChainId === this.selectedChainId);
      }

      return matches;
    });
  }

  clearChainFilter(): void {
    this.selectedChainId = null;
    this.selectedChainName = '';
    this.router.navigate(['/hotels']);
    this.filteredHotels = this.hotels;
    this.cdr.detectChanges();
  }

  onCityChange(): void {
    this.searchHotels();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCity = '';
    this.selectedChainId = null;
    this.selectedChainName = '';
    this.router.navigate(['/hotels']);
    this.filteredHotels = this.hotels;
    this.cdr.detectChanges();
  }

  getImageUrl(hotel: DisplayHotel): string {
    if (hotel.imageUrl) {
      return hotel.imageUrl;
    }
    const fallbacks = [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542314831-c53cd426d116?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    ];
    const index = (hotel.id || 0) % fallbacks.length;
    return fallbacks[index];
  }

  getCityName(hotel: DisplayHotel): string {
    return hotel.cityName || hotel.city || 'Unknown City';
  }

  getStarRating(rating?: number): string {
    if (!rating) return '';
    return '★'.repeat(Math.min(rating, 5)) + '☆'.repeat(Math.max(0, 5 - rating));
  }

  viewHotelDetails(hotelId?: number): void {
    if (hotelId) {
      console.log('Viewing hotel details for:', hotelId);
      this.router.navigateByUrl(`/hotel-details?id=${hotelId}`);
    }
  }

  viewRooms(hotelId?: number): void {
    if (hotelId) {
      console.log('Viewing rooms for hotel:', hotelId);
      this.router.navigate(['/room'], {
        queryParams: { hotel: hotelId }
      });
    }
  }
}
