import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  memberSince: string;
  idType: string;
  idNumber: string;
  isActive: boolean;
  name: string;
  city?: string;
  joined?: string;
  reservations?: number;
}

interface Staff {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  since: string;
  name: string;
  hotel?: string;
  status?: 'active' | 'inactive';
}

@Component({
  selector: 'app-admin-people',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-people.component.html',
})
export class AdminPeopleComponent {
  activeTab: 'customers' | 'staff' = 'customers';

  showCustomerModal = false;
  showStaffModal    = false;
  showDeleteConfirm = false;
  deleteTarget: { type: 'customer' | 'staff'; id: number } | null = null;

  editingCustomer: Partial<Customer> = {};
  editingStaff:    Partial<Staff>    = {};

  customerSearch = '';
  staffSearch    = '';

  customers: Customer[] = [
    {
      id: 1,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      phone: '+1 416-555-0101',
      address: '123 Main St, Toronto, ON',
      dob: '1990-04-12',
      memberSince: '2025',
      idType: 'Passport',
      idNumber: 'CA982341',
      isActive: true,
      name: 'Jane Doe',
      city: 'Toronto',
      joined: 'Jan 2025',
      reservations: 3
    },
    {
      id: 2,
      firstName: 'Marcus',
      lastName: 'Trent',
      email: 'marcus@mail.ca',
      phone: '+1 613-555-0202',
      address: '456 Queen St, Ottawa, ON',
      dob: '1985-11-30',
      memberSince: '2025',
      idType: "Driver's Lic",
      idNumber: 'ON12345678',
      isActive: true,
      name: 'Marcus Trent',
      city: 'Ottawa',
      joined: 'Mar 2025',
      reservations: 1
    },
    {
      id: 3,
      firstName: 'Sophie',
      lastName: 'Laurent',
      email: 'sophie.l@outlook.com',
      phone: '+1 514-555-0303',
      address: '789 St Catherine, Montreal, QC',
      dob: '1995-07-21',
      memberSince: '2024',
      idType: 'Passport',
      idNumber: 'FR456219',
      isActive: true,
      name: 'Sophie Laurent',
      city: 'Montreal',
      joined: 'Nov 2024',
      reservations: 5
    },
    {
      id: 4,
      firstName: 'David',
      lastName: 'Kim',
      email: 'dkim@gmail.com',
      phone: '+1 403-555-0404',
      address: '321 4th St, Calgary, AB',
      dob: '2000-02-14',
      memberSince: '2025',
      idType: 'National ID',
      idNumber: 'KR889012',
      isActive: true,
      name: 'David Kim',
      city: 'Calgary',
      joined: 'Jun 2025',
      reservations: 2
    },
  ];

  staff: Staff[] = [
    {
      id: 1,
      firstName: 'Robert',
      lastName: 'Haines',
      email: 'r.haines@overnight.ca',
      phone: '+1 709 555 0101',
      role: 'Front Desk',
      isActive: true,
      since: '2023',
      name: 'Robert Haines',
      hotel: 'Marriott St Johns East',
      status: 'active'
    },
    {
      id: 2,
      firstName: 'Amina',
      lastName: 'Diallo',
      email: 'a.diallo@overnight.ca',
      phone: '+1 613 555 0202',
      role: 'Manager',
      isActive: true,
      since: '2022',
      name: 'Amina Diallo',
      hotel: 'Delta Coventry Suites',
      status: 'active'
    },
    {
      id: 3,
      firstName: 'Pierre',
      lastName: 'Lemay',
      email: 'p.lemay@overnight.ca',
      phone: '+1 514 555 0303',
      role: 'Concierge',
      isActive: true,
      since: '2024',
      name: 'Pierre Lemay',
      hotel: 'Westin Montreal Notre-Dame',
      status: 'active'
    },
    {
      id: 4,
      firstName: 'Grace',
      lastName: 'Okonkwo',
      email: 'g.okonkwo@overnight.ca',
      phone: '+1 613 555 0404',
      role: 'Housekeeping',
      isActive: false,
      since: '2024',
      name: 'Grace Okonkwo',
      hotel: 'Delta Coventry Suites',
      status: 'inactive'
    },
  ];

  nextCustomerId = 5;
  nextStaffId    = 5;

  get filteredCustomers() {
    const q = this.customerSearch.toLowerCase();
    return this.customers.filter(c =>
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.name && c.name.toLowerCase().includes(q))
    );
  }

  get filteredStaff() {
    const q = this.staffSearch.toLowerCase();
    return this.staff.filter(s =>
      s.firstName.toLowerCase().includes(q) ||
      s.lastName.toLowerCase().includes(q) ||
      s.role.toLowerCase().includes(q) ||
      (s.name && s.name.toLowerCase().includes(q))
    );
  }

  get activeStaff()   { return this.staff.filter(s => s.isActive === true).length; }
  get inactiveStaff() { return this.staff.filter(s => s.isActive === false).length; }

  openAddCustomer() {
    this.editingCustomer = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      dob: '',
      memberSince: new Date().getFullYear().toString(),
      idType: 'Passport',
      idNumber: '',
      isActive: true
    };
    this.showCustomerModal = true;
  }

  openEditCustomer(c: Customer) {
    this.editingCustomer = { ...c };
    this.showCustomerModal = true;
  }

  saveCustomer() {
    if (this.editingCustomer.id) {
      const idx = this.customers.findIndex(c => c.id === this.editingCustomer.id);
      if (idx > -1) {
        this.editingCustomer.name = `${this.editingCustomer.firstName} ${this.editingCustomer.lastName}`;
        this.customers[idx] = { ...this.customers[idx], ...this.editingCustomer } as Customer;
      }
    } else {
      const newCustomer = {
        ...this.editingCustomer,
        id: this.nextCustomerId++,
        name: `${this.editingCustomer.firstName} ${this.editingCustomer.lastName}`,
        city: 'City',
        joined: new Date().getFullYear().toString(),
        reservations: 0
      } as Customer;
      this.customers.push(newCustomer);
    }
    this.showCustomerModal = false;
  }

  openAddStaff() {
    this.editingStaff = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'Front Desk',
      isActive: true,
      since: new Date().getFullYear().toString()
    };
    this.showStaffModal = true;
  }

  openEditStaff(s: Staff) {
    this.editingStaff = { ...s };
    this.showStaffModal = true;
  }

  saveStaff() {
    if (this.editingStaff.id) {
      const idx = this.staff.findIndex(s => s.id === this.editingStaff.id);
      if (idx > -1) {
        this.editingStaff.name = `${this.editingStaff.firstName} ${this.editingStaff.lastName}`;
        this.editingStaff.status = this.editingStaff.isActive ? 'active' : 'inactive';
        this.staff[idx] = { ...this.staff[idx], ...this.editingStaff } as Staff;
      }
    } else {
      const newStaff = {
        ...this.editingStaff,
        id: this.nextStaffId++,
        name: `${this.editingStaff.firstName} ${this.editingStaff.lastName}`,
        hotel: 'LuxStay Hotel',
        status: this.editingStaff.isActive ? 'active' : 'inactive'
      } as Staff;
      this.staff.push(newStaff);
    }
    this.showStaffModal = false;
  }

  confirmDelete(type: 'customer' | 'staff', id: number) {
    this.deleteTarget = { type, id };
    this.showDeleteConfirm = true;
  }

  executeDelete() {
    if (!this.deleteTarget) return;
    if (this.deleteTarget.type === 'customer') {
      this.customers = this.customers.filter(c => c.id !== this.deleteTarget!.id);
    } else {
      this.staff = this.staff.filter(s => s.id !== this.deleteTarget!.id);
    }
    this.showDeleteConfirm = false;
    this.deleteTarget = null;
  }
}
