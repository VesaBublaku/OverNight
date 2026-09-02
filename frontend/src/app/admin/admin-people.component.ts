import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User as Customer } from '../services/user.service';
import { StaffService, Staff } from '../services/staff.service';

interface CustomerDisplay extends Customer {
  name?: string;
  city?: string;
  idType?: string;
  idNumber?: string;
  joined?: string;
  reservations?: number;
  dob?: string;
}

interface StaffDisplay extends Staff {
  name?: string;
  hotel?: string;
  status?: 'active' | 'inactive';
  since?: string;
}

@Component({
  selector: 'app-admin-people',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-people.component.html',
})
export class AdminPeopleComponent implements OnInit {
  activeTab: 'customers' | 'staff' = 'customers';

  showCustomerModal = false;
  showStaffModal = false;
  showDeleteConfirm = false;
  deleteTarget: { type: 'customer' | 'staff'; id: number } | null = null;

  editingCustomer: Partial<CustomerDisplay> = {};
  editingStaff: Partial<StaffDisplay> = {};

  customerSearch = '';
  staffSearch = '';

  customers: CustomerDisplay[] = [];
  staff: StaffDisplay[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private userService: UserService,
    private staffService: StaffService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
    this.loadStaff();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.customers = (data || []).map((user: any) => ({
          ...user,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
          city: user.address ? user.address.split(',')[1]?.trim() || 'N/A' : 'N/A',
          idType: 'Passport',
          idNumber: 'N/A',
          joined: user.memberSince || new Date().getFullYear().toString(),
          reservations: user.stays || 0
        }));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching customers:', err);
        this.errorMessage = 'Failed to load customers. Please try again.';
        this.isLoading = false;
        this.customers = [
          {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1 416-555-0123',
            address: '123 Main St, Toronto, ON',
            city: 'Toronto',
            idType: 'Passport',
            idNumber: 'AB123456',
            joined: '2025',
            reservations: 0,
            isActive: true
          }
        ];
        this.cdr.detectChanges();
      }
    });
  }

  loadStaff(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.staffService.getAllStaff().subscribe({
      next: (data) => {
        this.staff = (data || []).map((s: any) => ({
          ...s,
          name: `${s.firstName || ''} ${s.lastName || ''}`.trim() || s.email,
          hotel: 'LuxStay Hotel',
          status: s.isActive ? 'active' : 'inactive',
          since: s.createdAt ? new Date(s.createdAt).getFullYear().toString() : '2025'
        }));
        this.isLoading = false;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching staff:', err);
        this.errorMessage = 'Failed to load staff. Please try again.';
        this.isLoading = false;
        this.staff = [
          {
            id: 1,
            firstName: 'Admin',
            lastName: 'User',
            name: 'Admin User',
            email: 'admin@luxstay.com',
            phone: '+1 555-000-0000',
            role: 'ADMIN',
            hotel: 'LuxStay Hotel',
            status: 'active',
            since: '2025',
            isActive: true
          }
        ];
        this.cdr.detectChanges();
      }
    });
  }

  get filteredCustomers() {
    const q = this.customerSearch.toLowerCase();
    return this.customers.filter(c =>
      (c.name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.city || '').toLowerCase().includes(q)
    );
  }

  get filteredStaff() {
    const q = this.staffSearch.toLowerCase();
    return this.staff.filter(s =>
      (s.name || '').toLowerCase().includes(q) ||
      (s.role || '').toLowerCase().includes(q) ||
      (s.hotel || '').toLowerCase().includes(q)
    );
  }

  get activeStaff() {
    return this.staff.filter(s => s.isActive === true).length;
  }

  get inactiveStaff() {
    return this.staff.filter(s => s.isActive === false).length;
  }

  openAddCustomer() {
    this.editingCustomer = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      isActive: true
    };
    this.showCustomerModal = true;
  }

  openEditCustomer(c: CustomerDisplay) {
    this.editingCustomer = { ...c };
    this.showCustomerModal = true;
  }

  saveCustomer() {
    this.isLoading = true;
    this.errorMessage = '';

    if (this.editingCustomer.id) {
      this.userService.updateUser(this.editingCustomer.id, this.editingCustomer as Customer).subscribe({
        next: () => {
          this.loadCustomers();
          this.showCustomerModal = false;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error updating customer:', err);
          this.errorMessage = 'Failed to update customer. Please try again.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      const newCustomer = {
        email: this.editingCustomer.email || '',
        password: 'temp123',
        firstName: this.editingCustomer.firstName || '',
        lastName: this.editingCustomer.lastName || '',
        phone: this.editingCustomer.phone || '',
        address: this.editingCustomer.address || '',
        isActive: true
      };
      this.userService.register(newCustomer as any).subscribe({
        next: () => {
          this.loadCustomers();
          this.showCustomerModal = false;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error creating customer:', err);
          this.errorMessage = 'Failed to create customer. Please try again.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  openAddStaff() {
    this.editingStaff = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'staff',
      isActive: true
    };
    this.showStaffModal = true;
  }

  openEditStaff(s: StaffDisplay) {
    this.editingStaff = { ...s };
    this.showStaffModal = true;
  }

  saveStaff() {
    this.isLoading = true;
    this.errorMessage = '';

    if (this.editingStaff.id) {
      const staffId = this.editingStaff.id;
      const currentStaff = this.staff.find(s => s.id === staffId);

      const newIsActive = this.editingStaff.isActive === true || (this.editingStaff.isActive as any) === 'true';
      const oldIsActive = currentStaff?.isActive === true;

      const updateData = {
        firstName: this.editingStaff.firstName,
        lastName: this.editingStaff.lastName,
        email: this.editingStaff.email,
        phone: this.editingStaff.phone,
        role: this.editingStaff.role
      };

      this.staffService.updateStaff(staffId, updateData as Staff).subscribe({
        next: () => {
          if (oldIsActive !== newIsActive) {
            const statusObservable = newIsActive
              ? this.staffService.activateStaff(staffId)
              : this.staffService.deactivateStaff(staffId);

            statusObservable.subscribe({
              next: () => {
                this.loadStaff();
                this.showStaffModal = false;
                this.isLoading = false;
                this.cdr.detectChanges();
              },
              error: (err) => {
                console.error('Error updating status:', err);
                this.errorMessage = 'Failed to update staff status.';
                this.isLoading = false;
                this.cdr.detectChanges();
              }
            });
          } else {
            this.loadStaff();
            this.showStaffModal = false;
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          console.error('Error updating staff:', err);
          this.errorMessage = 'Failed to update staff. Please try again.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      const newStaff = {
        email: this.editingStaff.email || '',
        password: 'staff123',
        firstName: this.editingStaff.firstName || '',
        lastName: this.editingStaff.lastName || '',
        phone: this.editingStaff.phone || '',
        role: this.editingStaff.role || 'staff',
        isActive: true
      };
      this.staffService.register(newStaff as Staff).subscribe({
        next: () => {
          this.loadStaff();
          this.showStaffModal = false;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error creating staff:', err);
          this.errorMessage = 'Failed to create staff. Please try again.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  confirmDelete(type: 'customer' | 'staff', id: number) {
    this.deleteTarget = { type, id };
    this.showDeleteConfirm = true;
  }

  executeDelete() {
    if (!this.deleteTarget) return;
    this.isLoading = true;
    this.errorMessage = '';

    if (this.deleteTarget.type === 'customer') {
      this.userService.deleteUser(this.deleteTarget.id).subscribe({
        next: () => {
          this.loadCustomers();
          this.showDeleteConfirm = false;
          this.deleteTarget = null;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error deleting customer:', err);
          this.errorMessage = 'Failed to delete customer. Please try again.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.staffService.deleteStaff(this.deleteTarget.id).subscribe({
        next: () => {
          this.loadStaff();
          this.showDeleteConfirm = false;
          this.deleteTarget = null;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error deleting staff:', err);
          this.errorMessage = 'Failed to delete staff. Please try again.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
}
