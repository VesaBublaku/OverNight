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
    private cdr: ChangeDetectorRef  // ADD THIS
  ) {}

  ngOnInit(): void {
    this.loadPayments();
    this.loadStats();
  }

  loadPayments(): void {
    this.paymentService.getAllPayments().subscribe({
      next: (data) => {
        this.payments = (data || []).map(p => ({
          ...p,
          customerName: p.customerName || (p.reservation?.user ? `${p.reservation.user.firstName || ''} ${p.reservation.user.lastName || ''}`.trim() : 'Unknown'),
          customerEmail: p.customerEmail || p.reservation?.user?.email || 'N/A',
          hotel: p.hotel || p.reservation?.room?.hotel?.name || 'Unknown',
          roomNumber: p.roomNumber || p.reservation?.room?.roomNumber || 'N/A',
          reservationId: p.reservationId || p.reservation?.id
        }));
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching payments:', err);
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
        console.error('Error fetching stats:', err);
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
      const date = p.paymentDate ? new Date(p.paymentDate) : new Date();
      return p.status === 'COMPLETED' && date.getMonth() === month && date.getFullYear() === year;
    }).length;
  }

  viewReceipt(payment: Payment): void {
    this.receiptData = payment;
    this.showReceiptModal = true;
    this.cdr.detectChanges();
  }

  completePayment(payment: Payment): void {
    if (!payment.id) return;
    this.paymentService.completePayment(payment.id).subscribe({
      next: () => {
        this.loadPayments();
        this.loadStats();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error completing payment:', err);
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
