import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Customer {
  id: number; name: string; email: string; city: string; dob: string; idType: string; idNumber: string; reservations: number; joined: string;
}

interface Staff {
  id: number; name: string; email: string; role: string; hotel: string; phone: string; since: string; status: 'active' | 'inactive';
}

@Component({
  selector: 'app-admin-people',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-people.component.html',
})
export class AdminPeopleComponent {
  activeTab: 'customers' | 'staff' = 'customers';

  // Modals
  showCustomerModal = false;
  showStaffModal    = false;
  showDeleteConfirm = false;
  deleteTarget: { type: 'customer' | 'staff'; id: number } | null = null;

  editingCustomer: Partial<Customer> = {};
  editingStaff:    Partial<Staff>    = {};

  customerSearch = '';
  staffSearch    = '';

  // ── Mock Data ──────────────────────────────────────────
  customers: Customer[] = [
    { id: 1, name: 'Jane Doe',       email: 'jane.doe@example.com',   city: 'Toronto', dob: '1990-04-12', idType: 'Passport',    idNumber: 'CA982341', reservations: 3, joined: 'Jan 2025' },
    { id: 2, name: 'Marcus Trent',   email: 'marcus@mail.ca',         city: 'Ottawa',  dob: '1985-11-30', idType: "Driver's Lic", idNumber: 'ON12345678', reservations: 1, joined: 'Mar 2025' },
    { id: 3, name: 'Sophie Laurent', email: 'sophie.l@outlook.com',   city: 'Montreal',dob: '1995-07-21', idType: 'Passport',    idNumber: 'FR456219', reservations: 5, joined: 'Nov 2024' },
    { id: 4, name: 'David Kim',      email: 'dkim@gmail.com',         city: 'Calgary', dob: '2000-02-14', idType: 'National ID', idNumber: 'KR889012', reservations: 2, joined: 'Jun 2025' },
  ];

  staff: Staff[] = [
    { id: 1, name: 'Robert Haines',  email: 'r.haines@overnight.ca',  role: 'Front Desk', hotel: 'Marriott St Johns East',    phone: '+1 709 555 0101', since: '2023', status: 'active' },
    { id: 2, name: 'Amina Diallo',   email: 'a.diallo@overnight.ca',  role: 'Manager',    hotel: 'Delta Coventry Suites',     phone: '+1 613 555 0202', since: '2022', status: 'active' },
    { id: 3, name: 'Pierre Lemay',   email: 'p.lemay@overnight.ca',   role: 'Concierge',  hotel: 'Westin Montreal Notre-Dame', phone: '+1 514 555 0303', since: '2024', status: 'active' },
    { id: 4, name: 'Grace Okonkwo',  email: 'g.okonkwo@overnight.ca', role: 'Housekeeping', hotel: 'Delta Coventry Suites',  phone: '+1 613 555 0404', since: '2024', status: 'inactive' },
  ];

  nextCustomerId = 5;
  nextStaffId    = 5;

  // ── Computed ───────────────────────────────────────────
  get filteredCustomers() {
    const q = this.customerSearch.toLowerCase();
    return this.customers.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.city.toLowerCase().includes(q));
  }

  get filteredStaff() {
    const q = this.staffSearch.toLowerCase();
    return this.staff.filter(s => s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q) || s.hotel.toLowerCase().includes(q));
  }

  get activeStaff()   { return this.staff.filter(s => s.status === 'active').length; }
  get inactiveStaff() { return this.staff.filter(s => s.status === 'inactive').length; }

  // ── Customer CRUD ──────────────────────────────────────
  openAddCustomer() {
    this.editingCustomer = { name:'', email:'', city:'', dob:'', idType:'Passport', idNumber:'', reservations:0, joined:'' };
    this.showCustomerModal = true;
  }
  openEditCustomer(c: Customer) { this.editingCustomer = { ...c }; this.showCustomerModal = true; }
  saveCustomer() {
    if (this.editingCustomer.id) {
      const idx = this.customers.findIndex(c => c.id === this.editingCustomer.id);
      if (idx > -1) this.customers[idx] = { ...this.customers[idx], ...this.editingCustomer } as Customer;
    } else {
      this.customers.push({ ...this.editingCustomer, id: this.nextCustomerId++, reservations: 0, joined: new Date().getFullYear().toString() } as Customer);
    }
    this.showCustomerModal = false;
  }

  // ── Staff CRUD ─────────────────────────────────────────
  openAddStaff() {
    this.editingStaff = { name:'', email:'', role:'Front Desk', hotel:'', phone:'', since: new Date().getFullYear().toString(), status:'active' };
    this.showStaffModal = true;
  }
  openEditStaff(s: Staff) { this.editingStaff = { ...s }; this.showStaffModal = true; }
  saveStaff() {
    if (this.editingStaff.id) {
      const idx = this.staff.findIndex(s => s.id === this.editingStaff.id);
      if (idx > -1) this.staff[idx] = { ...this.staff[idx], ...this.editingStaff } as Staff;
    } else {
      this.staff.push({ ...this.editingStaff, id: this.nextStaffId++ } as Staff);
    }
    this.showStaffModal = false;
  }

  // ── Delete ─────────────────────────────────────────────
  confirmDelete(type: 'customer' | 'staff', id: number) { this.deleteTarget = { type, id }; this.showDeleteConfirm = true; }
  executeDelete() {
    if (!this.deleteTarget) return;
    if (this.deleteTarget.type === 'customer') this.customers = this.customers.filter(c => c.id !== this.deleteTarget!.id);
    else this.staff = this.staff.filter(s => s.id !== this.deleteTarget!.id);
    this.showDeleteConfirm = false; this.deleteTarget = null;
  }
}
