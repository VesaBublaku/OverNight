import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HotelChainService, HotelChain } from '../services/hotel-chain.service';
import {Header} from '../header/header';
import {Footer} from '../footer/footer';

@Component({
  selector: 'app-chain',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Header, Footer],
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
        console.log('Chains loaded:', data);
        console.log('Number of chains:', data?.length);

        this.chains = data || [];
        this.filteredChains = data || [];
        this.isLoading = false;

        this.cdr.detectChanges();

      },
      error: (err) => {
        console.error('Error loading chains:', err);
        this.errorMessage = 'Failed to load hotel chains.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  searchChains(): void {
    if (!this.searchQuery.trim()) {
      this.filteredChains = this.chains;
      return;
    }

    this.hotelChainService.searchHotelChains(this.searchQuery).subscribe({
      next: (data) => {
        this.filteredChains = data || [];
      },
      error: (err) => {
        console.error('Error searching chains:', err);
      }
    });
  }

  getLogoText(name: string): string {
    if (!name) return '?';
    const words = name.split(' ');
    if (words.length > 1) {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  }

  getImageUrl(chain: HotelChain): string {
    if (chain.imageUrl) {
      return chain.imageUrl;
    }
    return `https://via.placeholder.com/200x200/1a1a2e/ffffff?text=${encodeURIComponent(chain.name)}`;
  }

  viewChainHotels(chainId?: number): void {
    if (chainId) {
      console.log('View hotels for chain:', chainId);
    }
  }
}
