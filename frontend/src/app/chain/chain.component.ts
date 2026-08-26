import { Component, OnInit, ChangeDetectorRef } from '@angular/core';  // ✅ Add ChangeDetectorRef
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
    private cdr: ChangeDetectorRef  // ✅ Add ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('🚀 ChainComponent initialized!');
    this.loadChains();
  }

  loadChains(): void {
    console.log('🔄 Loading chains...');
    this.isLoading = true;
    this.errorMessage = '';

    this.hotelChainService.getActiveHotelChains().subscribe({
      next: (data) => {
        console.log('✅ Hotel chains loaded:', data);
        this.chains = data || [];
        this.filteredChains = data || [];
        this.isLoading = false;

        // ✅ Force change detection
        this.cdr.detectChanges();

        console.log('📊 Number of chains:', this.chains.length);
        console.log('📊 isLoading set to:', this.isLoading);
      },
      error: (err) => {
        console.error('❌ Error loading hotel chains:', err);
        this.errorMessage = 'Failed to load hotel chains. Please try again.';
        this.isLoading = false;

        // ✅ Force change detection on error too
        this.cdr.detectChanges();
      }
    });
  }

  searchChains(): void {
    if (!this.searchQuery.trim()) {
      this.filteredChains = this.chains;
      // ✅ Force change detection after reset
      this.cdr.detectChanges();
      return;
    }

    this.hotelChainService.searchHotelChains(this.searchQuery).subscribe({
      next: (data) => {
        this.filteredChains = data || [];
        // ✅ Force change detection after search
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
    return `https://via.placeholder.com/200x200/1a1a2e/ffffff?text=${encodeURIComponent(chain.name)}`;
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
