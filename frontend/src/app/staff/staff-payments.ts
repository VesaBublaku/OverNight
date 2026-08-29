// staff-payments.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentService, Payment } from '../services/payment.service';

@Component({
  selector: 'app-staff-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff-payments.html',
})
export class StaffPaymentsComponent implements OnInit {
  searchQuery = '';
  showReceiptModal = false;
  receiptData: Payment | null = null;
  payments: Payment[] = [];
  isLoading = true;

  // Stats from backend
  stats = {
    totalRevenue: 0,
    pendingAmount: 0,
    pendingCount: 0,
    thisMonthRevenue: 0
  };

  constructor(
    private router: Router,
    private paymentService: PaymentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPayments();
    this.loadStats();
  }

  loadPayments(): void {
    this.isLoading = true;
    this.paymentService.getAllPayments().subscribe({
      next: (data) => {
        console.log('📊 Raw payment data:', data);

        this.payments = (data || []).map(p => {
          // Safely extract customer name
          let customerName = 'Unknown';
          let customerEmail = 'N/A';

          if (p.reservation?.user) {
            const user = p.reservation.user;
            customerName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Unknown';
            customerEmail = user.email || 'N/A';
          } else if (p.user) {
            const user = p.user;
            customerName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Unknown';
            customerEmail = user.email || 'N/A';
          }

          // Safely extract hotel name
          let hotel = 'Unknown';
          if (p.reservation?.room?.hotel) {
            hotel = p.reservation.room.hotel.name || 'Unknown';
          }

          // Safely extract room number
          let roomNumber = 'N/A';
          if (p.reservation?.room) {
            roomNumber = p.reservation.room.roomNumber || 'N/A';
          }

          return {
            ...p,
            customerName: customerName,
            customerEmail: customerEmail,
            hotel: hotel,
            roomNumber: roomNumber,
            reservationId: p.reservationId || p.reservation?.id
          };
        });

        console.log('✅ Mapped payments:', this.payments);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error fetching payments:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadStats(): void {
    this.paymentService.getRevenueStats().subscribe({
      next: (data) => {
        this.stats = {
          totalRevenue: data.totalRevenue || 0,
          pendingAmount: data.pendingAmount || 0,
          pendingCount: data.pendingCount || 0,
          thisMonthRevenue: data.thisMonthRevenue || 0
        };
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error fetching stats:', err);
        this.cdr.detectChanges();
      }
    });
  }

  get filteredPayments(): Payment[] {
    const q = this.searchQuery.toLowerCase();
    return this.payments.filter(p =>
      (p.customerName || '').toLowerCase().includes(q) ||
      (p.customerEmail || '').toLowerCase().includes(q) ||
      (p.hotel || '').toLowerCase().includes(q) ||
      (p.method || '').toLowerCase().includes(q) ||
      (p.transactionId || '').toLowerCase().includes(q)
    );
  }

  get totalRevenue(): string {
    return this.stats.totalRevenue.toFixed(2);
  }

  get pendingAmount(): string {
    return this.stats.pendingAmount.toFixed(2);
  }

  get pendingCount(): number {
    return this.stats.pendingCount;
  }

  get thisMonthRevenue(): string {
    return this.stats.thisMonthRevenue.toFixed(2);
  }

  get thisMonthCount(): number {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return this.payments.filter(p => {
      if (!p.paymentDate) return false;
      const date = new Date(p.paymentDate);
      return p.status?.toUpperCase() === 'COMPLETED' &&
        date.getMonth() === month &&
        date.getFullYear() === year;
    }).length;
  }

  viewReceipt(payment: Payment): void {
    this.receiptData = payment;
    this.showReceiptModal = true;
    this.cdr.detectChanges();
  }

  completePayment(payment: Payment): void {
    if (!payment.id) return;
    if (!confirm(`Complete payment ${payment.transactionId}?`)) return;

    this.paymentService.completePayment(payment.id).subscribe({
      next: () => {
        alert('✅ Payment completed successfully!');
        this.loadPayments();
        this.loadStats();
      },
      error: (err) => {
        console.error('❌ Error completing payment:', err);
        alert('Failed to complete payment. Please try again.');
        this.cdr.detectChanges();
      }
    });
  }

  printReceipt(): void {
    window.print();
  }

  goBack(): void {
    this.router.navigate(['/staff/dashboard']);
  }

  get receiptAmount(): string {
    return this.receiptData?.amount ? this.receiptData.amount.toFixed(2) : '0.00';
  }
}
