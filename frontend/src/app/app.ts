import { Component, signal } from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';

import { format, addDays } from 'date-fns';

interface Hotel {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  category: string;
}

interface Chain {
  name: string;
  logo: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,  // This will show routed components
  styles: []
})
export class App {
  readonly title = signal('Luxstay Booking');

  // Search State
  destination = signal('');
  checkInDate = signal(format(new Date(), 'yyyy-MM-dd'));
  checkOutDate = signal(format(addDays(new Date(), 3), 'yyyy-MM-dd'));
  guests = signal(2);

  // Chains
  chains = signal<Chain[]>([
    { name: 'Ritz-Carlton', logo: 'RC' },
    { name: 'Four Seasons', logo: 'FS' },
    { name: 'Aman Resorts', logo: 'AR' },
    { name: 'Rosewood', logo: 'RW' },
    { name: 'St. Regis', logo: 'SR' },
    { name: 'Waldorf Astoria', logo: 'WA' }
  ]);

  // Filters
  categories = signal(['All', 'Beachfront', 'City Center', 'Mountain Retreat', 'Boutique']);
  activeCategory = signal('All');

  // Featured Hotels
  hotels = signal<Hotel[]>([
    {
      id: 1,
      name: 'The Azure Ocean Resort',
      location: 'Maldives',
      price: 1250,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      category: 'Beachfront'
    },
    {
      id: 2,
      name: 'Grand Skyline Hotel',
      location: 'New York, USA',
      price: 850,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      category: 'City Center'
    },
    {
      id: 3,
      name: 'Alpine Serenity Lodge',
      location: 'Swiss Alps, Switzerland',
      price: 1100,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
      category: 'Mountain Retreat'
    },
    {
      id: 4,
      name: 'Villa Royale Boutique',
      location: 'Paris, France',
      price: 950,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      category: 'Boutique'
    }
  ]);

  get filteredHotels() {
    if (this.activeCategory() === 'All') return this.hotels();
    return this.hotels().filter(h => h.category === this.activeCategory());
  }

  setCategory(cat: string) {
    this.activeCategory.set(cat);
  }
}
