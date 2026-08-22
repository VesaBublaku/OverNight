import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { StaffService } from '../services/staff.service';

@Component({
  selector: 'app-staff-login',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-4">
      <div class="w-full max-w-md">

        <div class="text-center mb-10">
          <a routerLink="/" class="inline-flex items-baseline gap-2">
            <span class="text-gray-900 text-[32px] font-serif tracking-tight">LuxStay</span>
            <span class="text-gray-400 text-[10px] font-semibold tracking-[0.2em] uppercase">Staff</span>
          </a>
          <p class="text-gray-500 text-sm font-light mt-3">Staff access to reservations & payments</p>
        </div>

        <div class="bg-white rounded-[2rem] p-10 shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-gray-50">
          <div class="text-[10px] font-semibold text-gray-400 tracking-[0.3em] uppercase mb-4">Staff Portal</div>
          <h1 class="text-3xl font-serif text-gray-900 mb-8">Sign in</h1>

          <div *ngIf="error" class="bg-red-50 border border-red-100 text-red-600 text-sm font-light rounded-xl px-4 py-3 mb-6">
            {{error}}
          </div>

          <div *ngIf="successMessage" class="bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-light rounded-xl px-4 py-3 mb-6">
            {{successMessage}}
          </div>

          <div class="space-y-5">
            <div>
              <label class="block text-[10px] font-semibold text-gray-400 tracking-[0.2em] uppercase mb-2">Email / Username</label>
              <input
                #username
                type="text"
                placeholder="staff@luxstay.com"
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-light focus:outline-none focus:border-[#BCA47B] transition-colors placeholder-gray-400"
              />
            </div>
            <div>
              <label class="block text-[10px] font-semibold text-gray-400 tracking-[0.2em] uppercase mb-2">Password</label>
              <input
                #password
                type="password"
                placeholder="••••••••"
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-light focus:outline-none focus:border-[#BCA47B] transition-colors placeholder-gray-400"
              />
            </div>
            <div class="pt-2">
              <button (click)="login(username.value, password.value)" class="w-full bg-[#111827] hover:bg-black text-white px-6 py-4 rounded-xl text-[11px] font-bold tracking-[0.15em] uppercase transition-colors shadow-md">
                Sign In to Staff Dashboard
              </button>
            </div>
          </div>

          <div class="mt-6 p-4 bg-[#FAF8F5] rounded-xl border border-gray-100">
            <p class="text-xs text-gray-400 font-light text-center">
              Demo Staff Credentials:
            </p>
            <div class="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-600">
              <div class="text-center">
                <span class="font-medium text-gray-700">Front Desk:</span>
                <span class="block text-gray-500 text-[10px]">frontdeskluxstay.com</span>
                <span class="block text-gray-400 text-[9px]">password: staff123</span>
              </div>
              <div class="text-center">
                <span class="font-medium text-gray-700">Manager:</span>
                <span class="block text-gray-500 text-[10px]">managerluxstay.com</span>
                <span class="block text-gray-400 text-[9px]">password: manager456</span>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-6 flex items-center justify-center gap-4">
          <a routerLink="/" class="text-[10px] font-semibold text-gray-400 hover:text-gray-700 tracking-[0.15em] uppercase transition-colors">
            &larr; Back to site
          </a>
          <span class="text-gray-200">|</span>
          <a routerLink="/admin/login" class="text-[10px] font-semibold text-[#BCA47B] hover:text-[#A08B65] tracking-[0.15em] uppercase transition-colors">
            Admin Login
          </a>
        </div>
      </div>
    </div>
  `,
})
export class StaffLoginComponent {
  error = '';
  successMessage = '';

  constructor(
    private staffService: StaffService,
    private router: Router
  ) {}

  login(email: string, password: string): void {
    this.error = '';
    this.successMessage = '';

    if (!email || !password) {
      this.error = 'Please enter both email and password.';
      return;
    }

    console.log('📤 Staff login attempt:', { email });

    this.staffService.login(email, password).subscribe({
      next: (response) => {
        console.log('Staff login success:', response);
        this.successMessage = `Welcome back, ${response.staff.firstName}! Redirecting...`;
        setTimeout(() => {
          this.router.navigate(['/staff/dashboard']);
        }, 1000);
      },
      error: (err) => {
        console.error('Staff login error:', err);
        this.error = err.error?.message || 'Invalid credentials. Please try again.';
      }
    });
  }

  logout(): void {
    this.staffService.logout();
    this.router.navigate(['/staff/login']);
  }
}
