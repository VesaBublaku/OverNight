import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Payment {
  id: number;
  transactionId: string;
  reservationId: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  hotel: string;
  roomNumber: string;
  amount: number;
  method: 'Credit Card' | 'Debit Card' | 'Cash' | 'Bank Transfer' | 'Online Payment';
  status: 'completed' | 'pending' | 'failed';
  paymentDate: string;
  paymentTime: string;
  cardNumber?: string;
}

@Component({
  selector: 'app-staff-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff-payments.html',
})
export class StaffPaymentsComponent {
  searchQuery = '';
  showReceiptModal = false;
  receiptData: Payment | null = null;

  payments: Payment[] = [
    {
      id: 1,
      transactionId: 'TXN-2026-001',
      reservationId: 1,
      customerId: 1,
      customerName: 'John Doe',
      customerEmail: 'john.doe@email.com',
      hotel: 'Marriott St Johns East',
      roomNumber: '217',
      amount: 1504.30,
      method: 'Credit Card',
      status: 'completed',
      paymentDate: '2026-08-20',
      paymentTime: '14:30',
      cardNumber: '**** **** **** 1234'
    },
    {
      id: 2,
      transactionId: 'TXN-2026-002',
      reservationId: 3,
      customerId: 3,
      customerName: 'Robert Johnson',
      customerEmail: 'robert.j@email.com',
      hotel: 'Marriott St Johns East',
      roomNumber: '218',
      amount: 520.00,
      method: 'Cash',
      status: 'completed',
      paymentDate: '2026-08-10',
      paymentTime: '09:15',
      cardNumber: ''
    },
    {
      id: 3,
      transactionId: 'TXN-2026-003',
      reservationId: 2,
      customerId: 2,
      customerName: 'Jane Smith',
      customerEmail: 'jane.smith@email.com',
      hotel: 'Delta Coventry Suites',
      roomNumber: '122',
      amount: 1652.84,
      method: 'Credit Card',
      status: 'pending',
      paymentDate: '2026-09-01',
      paymentTime: '15:00',
      cardNumber: '**** **** **** 5678'
    },
    {
      id: 4,
      transactionId: 'TXN-2026-004',
      reservationId: 4,
      customerId: 4,
      customerName: 'Sarah Williams',
      customerEmail: 'sarah.w@email.com',
      hotel: 'Westin Montreal Notre-Dame',
      roomNumber: '138',
      amount: 1534.90,
      method: 'Online Payment',
      status: 'pending',
      paymentDate: '2026-09-10',
      paymentTime: '11:20',
      cardNumber: '**** **** **** 9012'
    }
  ];

  get filteredPayments(): Payment[] {
    const q = this.searchQuery.toLowerCase();
    return this.payments.filter(p =>
      p.customerName.toLowerCase().includes(q) ||
      p.customerEmail.toLowerCase().includes(q) ||
      p.hotel.toLowerCase().includes(q) ||
      p.method.toLowerCase().includes(q) ||
      p.transactionId.toLowerCase().includes(q)
    );
  }

  get totalRevenue(): string {
    return this.payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0)
      .toFixed(2);
  }

  get pendingAmount(): string {
    return this.payments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0)
      .toFixed(2);
  }

  get pendingCount(): number {
    return this.payments.filter(p => p.status === 'pending').length;
  }

  get thisMonthRevenue(): string {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return this.payments
      .filter(p => {
        const date = new Date(p.paymentDate);
        return p.status === 'completed' && date.getMonth() === month && date.getFullYear() === year;
      })
      .reduce((sum, p) => sum + p.amount, 0)
      .toFixed(2);
  }

  get thisMonthCount(): number {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return this.payments
      .filter(p => {
        const date = new Date(p.paymentDate);
        return p.status === 'completed' && date.getMonth() === month && date.getFullYear() === year;
      }).length;
  }

  constructor(private router: Router) {}

  viewReceipt(payment: Payment): void {
    this.receiptData = payment;
    this.showReceiptModal = true;
  }

  completePayment(payment: Payment): void {
    const idx = this.payments.findIndex(p => p.id === payment.id);
    if (idx > -1) {
      this.payments[idx].status = 'completed';
    }
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
