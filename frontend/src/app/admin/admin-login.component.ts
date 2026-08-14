import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-4">
      <div class="w-full max-w-md">

        <!-- Logo -->
        <div class="text-center mb-10">
          <a routerLink="/" class="inline-flex items-baseline gap-2">
            <span class="text-gray-900 text-[32px] font-serif tracking-tight">LuxStay</span>
            <span class="text-gray-400 text-[10px] font-semibold tracking-[0.2em] uppercase">Admin</span>
          </a>
          <p class="text-gray-500 text-sm font-light mt-3">Administrator access only</p>
        </div>

        <!-- Card -->
        <div class="bg-white rounded-[2rem] p-10 shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-gray-50">
          <div class="text-[10px] font-semibold text-gray-400 tracking-[0.3em] uppercase mb-4">Admin Portal</div>
          <h1 class="text-3xl font-serif text-gray-900 mb-8">Sign in</h1>

          <div *ngIf="error" class="bg-red-50 border border-red-100 text-red-600 text-sm font-light rounded-xl px-4 py-3 mb-6">
            {{error}}
          </div>

          <div class="space-y-5">
            <div>
              <label class="block text-[10px] font-semibold text-gray-400 tracking-[0.2em] uppercase mb-2">Username</label>
              <input #username type="text" placeholder="admin" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-light focus:outline-none focus:border-[#BCA47B] transition-colors placeholder-gray-400" />
            </div>
            <div>
              <label class="block text-[10px] font-semibold text-gray-400 tracking-[0.2em] uppercase mb-2">Password</label>
              <input #password type="password" placeholder="••••••••" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-light focus:outline-none focus:border-[#BCA47B] transition-colors placeholder-gray-400" />
            </div>
            <div class="pt-2">
              <button (click)="login(username.value, password.value)" class="w-full bg-[#111827] hover:bg-black text-white px-6 py-4 rounded-xl text-[11px] font-bold tracking-[0.15em] uppercase transition-colors shadow-md">
                Sign In to Dashboard
              </button>
            </div>
          </div>

          <p class="text-xs text-gray-400 font-light text-center mt-6">
            Demo credentials: <span class="font-medium text-gray-600">admin / admin123</span>
          </p>
        </div>

        <div class="text-center mt-6">
          <a routerLink="/" class="text-[10px] font-semibold text-gray-400 hover:text-gray-700 tracking-[0.15em] uppercase transition-colors">
            &larr; Back to site
          </a>
        </div>
      </div>
    </div>
  `,
})
export class AdminLoginComponent {
  error = '';

  constructor(private router: Router) {}

  login(username: string, password: string) {
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('overnight_role', 'admin');
      this.router.navigate(['/admin/hotels']);
    } else {
      this.error = 'Invalid credentials. Please try again.';
    }
  }
}
