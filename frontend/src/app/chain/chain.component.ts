import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { HotelChainService, HotelChain } from '../services/hotel-chain.service';

@Component({
  selector: 'app-chain',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, Footer],
  templateUrl: './chain.component.html',
  styleUrls: ['./chain.component.css']
})
export class ChainComponent implements OnInit {
  chains: HotelChain[] = [];
  filteredChains: HotelChain[] = [];
  searchQuery: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private hotelChainService: HotelChainService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('ChainComponent initialized!');
    this.loadChains();
  }

  loadChains(): void {
    console.log('Loading chains...');
    this.isLoading = true;
    this.errorMessage = '';

    this.hotelChainService.getActiveHotelChains().subscribe({
      next: (data) => {
        console.log('Hotel chains loaded:', data);
        this.chains = data || [];
        this.filteredChains = data || [];
        this.isLoading = false;

        this.cdr.detectChanges();

      },
      error: (err) => {
        console.error('Error loading hotel chains:', err);
        this.errorMessage = 'Failed to load hotel chains. Please try again.';
        this.isLoading = false;

        this.cdr.detectChanges();
      }
    });
  }

  searchChains(): void {
    if (!this.searchQuery.trim()) {
      this.filteredChains = this.chains;
      this.cdr.detectChanges();
      return;
    }

    this.hotelChainService.searchHotelChains(this.searchQuery).subscribe({
      next: (data) => {
        this.filteredChains = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error searching chains:', err);
      }
    });
  }

  getImageUrl(chain: HotelChain): string {
    if (chain.imageUrl) {
      return chain.imageUrl;
    }
    const fallbackImages = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1542314831-c53cd426d116?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'
    ];
    const index = (chain.id || 0) % fallbackImages.length;
    return fallbackImages[index];
  }

  viewChainHotels(chainId?: number): void {
    if (chainId) {
      console.log('Viewing hotels for chain:', chainId);
      this.router.navigate(['/hotels'], {
        queryParams: { chain: chainId }
      });
    }
  }
}
