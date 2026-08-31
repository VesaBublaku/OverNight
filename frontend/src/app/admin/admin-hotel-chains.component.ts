import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotelChainService, HotelChain } from '../services/hotel-chain.service';
import { HotelService } from '../services/hotel.service';

@Component({
  selector: 'app-admin-hotel-chains',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-hotel-chains.component.html',
})
export class AdminHotelChainsComponent implements OnInit {
  chains: HotelChain[] = [];
  filteredChains: HotelChain[] = [];
  searchTerm = '';

  showModal = false;
  showDeleteConfirm = false;

  editingChain: Partial<HotelChain> = {};
  deleteTargetId: number | null = null;

  errorMessage = '';
  isLoading = false;

  constructor(
    private hotelChainService: HotelChainService,
    private hotelService: HotelService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadChains();
  }

  loadChains(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.hotelChainService.getAllHotelChains().subscribe({
      next: (data) => {
        this.chains = data || [];
        this.applyFilter();
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

  applyFilter(): void {
    const search = this.searchTerm.toLowerCase().trim();
    if (!search) {
      this.filteredChains = [...this.chains];
    } else {
      this.filteredChains = this.chains.filter(chain =>
        chain.name.toLowerCase().includes(search) ||
        (chain.description && chain.description.toLowerCase().includes(search))
      );
    }
    this.cdr.detectChanges();
  }

  get totalHotels(): number {
    return this.chains.reduce((sum, chain) => sum + (chain.hotelCount || 0), 0);
  }

  openAddChain(): void {
    this.errorMessage = '';
    this.editingChain = {
      name: '',
      description: '',
      imageUrl: '',
      isActive: true,
      hotelCount: 0
    };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  openEditChain(chain: HotelChain): void {
    this.errorMessage = '';
    this.editingChain = { ...chain };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.showModal = false;
    this.errorMessage = '';
    this.cdr.detectChanges();
  }

  saveChain(): void {
    if (!this.editingChain.name?.trim()) {
      this.errorMessage = 'Chain name is required.';
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const chainData = {
      name: this.editingChain.name.trim(),
      description: this.editingChain.description || '',
      imageUrl: this.editingChain.imageUrl || '',
      isActive: this.editingChain.isActive !== undefined ? this.editingChain.isActive : true,
      hotelCount: this.editingChain.hotelCount || 0
    };

    if (this.editingChain.id) {
      this.hotelChainService.updateHotelChain(this.editingChain.id, chainData).subscribe({
        next: () => {
          this.loadChains();
          this.closeModal();
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error updating chain:', err);
          this.errorMessage = err.error?.message || `Failed to update chain. Please try again.`;
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.hotelChainService.createHotelChain(chainData).subscribe({
        next: () => {
          this.loadChains();
          this.closeModal();
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error creating chain:', err);
          if (err.status === 409) {
            this.errorMessage = `A chain with name "${chainData.name}" already exists.`;
          } else {
            this.errorMessage = err.error?.message || `Failed to create chain. Please try again.`;
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  confirmDelete(id: number): void {
    this.deleteTargetId = id;
    this.showDeleteConfirm = true;
    this.cdr.detectChanges();
  }

  executeDelete(): void {
    if (!this.deleteTargetId) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.hotelChainService.deleteHotelChain(this.deleteTargetId).subscribe({
      next: () => {
        this.loadChains();
        this.showDeleteConfirm = false;
        this.deleteTargetId = null;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error deleting chain:', err);
        if (err.status === 409) {
          this.errorMessage = 'Cannot delete chain that has hotels associated with it. Please remove hotels first.';
        } else {
          this.errorMessage = err.error?.message || `Failed to delete chain. Please try again.`;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearchChange(): void {
    this.applyFilter();
  }
}
